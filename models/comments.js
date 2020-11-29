var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  text:{type:String , required:true , trim:true},
  createdAt:{
     type:Date,
     default:Date.now
  },
  author:{
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    username:{type:String , trim:true}
  }
});
var Comment = mongoose.model("Comment",commentSchema);

module.exports = Comment;