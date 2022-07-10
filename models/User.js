const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        userName:{type:String, required:true, unique:true},
        Email:{type:String, required:true, unique:true},
        passWord:{type:String, required:true},
        isAdmin:{
            type:Boolean,
            default:false,
        },
    },
    {
        timestamps:true,
    }
)

module.exports = mongoose.model("User", UserSchema)