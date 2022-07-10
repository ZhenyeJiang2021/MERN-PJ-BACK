const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

//register
router.post("/register",async (req,res)=>{
    console.log(req);
    const newUser = new User({
        userName: req.body.userName,
        Email: req.body.Email,
        passWord: CryptoJS.AES.encrypt(req.body.passWord,process.env.PASS_SEC).toString(),
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json(err)
    }
});

//log in
router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({userName: req.body.userName})
        !user && res.status(401).json("Cannot find this User!")
        const hashPassWord = CryptoJS.AES.decrypt(user.passWord, process.env.PASS_SEC)
        const realPassWord = hashPassWord.toString(CryptoJS.enc.Utf8)
        realPassWord !== req.body.password &&
            res.status(401).json("Wrong passWord!");
        const accessToken = jwt.sign(
            {
                id: user._id, 
                isAdmin: user.isAdmin
            },
            process.env.JWT_SEC,
            {expiresIn:"3d"}
        );
        const { passWord, ...others } = user._doc
        res.status(200).json({...others,accessToken})
    }catch(err){
        res.status(500).json(err)
    }
   
})


module.exports = router;