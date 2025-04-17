import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["Admin","User"],
        default:"User"
    },
    status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Active"
    },
},{
    timestamps:true
});

const User=mongoose.model("User",userSchema);
export default User;