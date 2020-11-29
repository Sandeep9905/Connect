var mongoose = require("mongoose");

var dataSchema = new mongoose.Schema({
    name:{type:String , required:true , trim:true},
    price:{type:String , required:true , trim:true},
    image:{type:String , required:true , trim:true},
    description:{type:String , required:true , trim:true},
    createdAt:{type: Date , default: Date.now},
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comment:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});
var data = mongoose.model("data" , dataSchema);
module.exports = data;