var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var validator = require('validator');

var UserSchema = new mongoose.Schema({
    username:{type:String},
    password:{
        type : String , 
        minlength :7,
        maxlength :10,
        trim : true      
       }, 
    firstName:{type:String , required:true , trim:true},
    lastName:{type:String , required:true , trim:true},
    avatar:{type:String , trim:true},
    email:{
        type:String , 
        unique:true , 
        required:true , 
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is inavlid');
            }
        }
    },
    resetPasswordToken: String,
    resetPasswordExpires : Date,
    isAdmin:{type:Boolean , default : false},
    notifications :[
        {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Notifications"
        }
    ],
    followers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ]

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);