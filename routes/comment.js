var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req , res){
    Campground.findById(req.params.id,function(err , campground){
        if(err){
            console.log(err);
        }else{
            res.render("comment/new",{campground : campground}); 
        }
    });
});

router.post("/",middleware.isLoggedIn,function(req , res){
    Campground.findById(req.params.id,function(err , campground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err , comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //and save it
                    comment.save();
                    campground.comment.push(comment);
                    campground.save();
                    req.flash("success","comment created successfully..")
                    res.redirect(`/viewCamp/${campground._id}`);
                }
            });
        }
    });
});

// EDIT ROUTES FOR COMMENT==============================
//edit routes to show the form
router.get("/:comment_id/edit" , middleware.checkCommentOwnership ,function(req , res){
    Comment.findById(req.params.comment_id , function(err , commentData){
        if(err){
            console.log(err);
        }else{
            res.render("comment/edit" , {comment : commentData , campground_id: req.params.id});
        }
    });
});
//edit routes handle the logic.... 
router.put("/:comment_id" , middleware.checkCommentOwnership ,function(req , res ){
   Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment , function(err , data){
       if(err){
           req.flash("error","Something went wrong..")
           res.redirect("back");
       }else{
           req.flash("success" , "Commnet created successfully..")
           res.redirect("/viewCamp/"+req.params.id);
       }
   });
});

//DESTROY COMMENT ROUTE=============
router.delete("/:comment_id" ,middleware.checkCommentOwnership , function(req , res){
    Comment.findByIdAndRemove(req.params.comment_id , function(err){
        if(err){
            req.flash("error" , "Something went wrong..")
            res.redirect("back");
        }else{
            req.flash("success","Comment deleted Successfully..")
            res.redirect("/viewCamp/"+req.params.id);
        }
    });
});

module.exports = router;