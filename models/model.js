const express=require('express');
const mongoose=require('mongoose');
 
const userShcema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    password:{
       
            type:String,
            required:true
        }
    }
)
module.exports=mongoose.model('user',userShcema)