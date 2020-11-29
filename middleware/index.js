var middlewareObj = {}
middlewareObj.isLoggedIn = function(req , res , next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be loggin to do that..");
    res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req , res , next){
    //checking that any body is logged in or not
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err , commentData){
            if(err){
                res.redirect("back");
            }else{
               //checking that the logged in user is the same user that the guy want to change something...
                if(commentData.author.id.equals(req.user._id)|| req.user.isAdmin){
                    next();
                }else{
                    req.flash("error","You have not the permission to do that..")
                    res.redirect("back");
                }
            }
        });   
    }else{
        //else you will show this.page
        req.flash("error","You need to be login..")
        res.send("back");
    }

}

middlewareObj.checkCampgroundOwnership = function (req , res , next){
    //checking that any body is logged in or not
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err , campground){
            if(err){
                res.redirect("back");
            }else{
               //checking that the logged in user is the same user that the guy want to change something...
                if(campground.author.id.equals(req.user._id)|| req.user.isAdmin){
                    next();
                }else{
                    req.flash("error","You have not the permission to do that..")
                    res.redirect("back");
                }
            }
        });   
    }else{
        //else you will show this.page
        req.flash("error","You need to be logged in..")
        res.send("back");
    }

}

module.exports = middlewareObj;