const mongoose=require('mongoose');

const studentSchema=new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username:String,
    email:String,
    password:String,
    userType:String,
    photo:String

});

module.exports=mongoose.model('Student',studentSchema);