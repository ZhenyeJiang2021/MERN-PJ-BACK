const User = require("../models/User");
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//update
router.put("/:id",verifyTokenAndAuth, async (req,res)=>{
   if(req.body.passWord){
    req.body.passWord = CryptoJS.AES.encrypt(
        req.body.passWord,
        process.env.PASS_SEC
        ).toString();
   }
   try{
    const updateUser = await User.findByIdAndUpdate(
        req.params.id, 
        {
            $set: req.body
        },
        {new: true}
    );
    res.status(200).json(updateUser)
   }catch(err){
    res.status(500).json(err);
   }
})

//delete

router.delete("/:id",verifyTokenAndAuth, async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted...")
    }catch(err){
        res.status(500).json(err)
    }
})

//get user

router.get("/find/:id",verifyTokenAndAdmin, async (req,res)=>{
    try{
        const user =  await User.findById(req.params.id)
        const { passWord, ...others } = user._doc
        res.status(200).json(others)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all user

router.get("/",verifyTokenAndAdmin, async (req,res)=>{
    try{
        const users =  await User.find();
        res.status(200).json(users)
    }catch(err){
        res.status(500).json(err)
    }
})

//get user stats

router.get("/stats", verifyTokenAndAdmin,async(req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1))
    try{
        const data = await User.aggregate([
            {$match:{createdAt:{$gte:lastYear}}},
            {
                $project:{
                    month:{ $month:"$createdAt"}
                },
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum:1}
                },
            },
        ]);
        res.status(200).json(data)
    }catch(err){
        res.status(500).json(err)
    }
})
module.exports = router;