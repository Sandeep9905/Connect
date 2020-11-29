var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var middleware = require("../middleware");
var User = require("../models/user");
var Notification = require("../models/notification");
const { retry } = require("async");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dlutl11lx', 
  api_key: 328233165175587, 
  api_secret: '2ghhXJzqjaLSHF1poHGkw_BLGwo'
});

//here we are handling search part with just displaying the whole data..
router.get("/" , function(req , res){
    //search bar======
    var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegrex(req.query.search),'gi');
        Campground.find({name : regex} , function(err , searchData){
              if(err){
                 console.log(err);
              }else{
                  if(searchData.length < 1){
                      noMatch = "No Campground Match that Query , plzz try again ..";
                  }
                 res.render("campground/viewCamp",{data : searchData , noMatch : noMatch});
              }
        });
    }
    else
    {
//simply disaplying data.==========
    Campground.find({},function(err , yelpdata){
     if(err){
         console.log("err occurs");
     }else{
         res.render("campground/viewCamp",{data : yelpdata ,noMatch : noMatch });
     }
    });
  }
});
//here we create the form to create the campground..
router.get("/create" ,middleware.isLoggedIn , function(req , res){
    res.render("campground/createNew");
})
//SHOW CAMPGROUNDS...show info about the campgrounds
router.get("/:id",function(req , res){
    var id=req.params.id;
    Campground.findById(req.params.id).populate("comment likes").exec(function(err , foundData){
        if(err){
            console.log("errr bro");
        }else{
            res.render("campground/show",{campground : foundData});
        }
    });  
});
//==================like button to Hanndle============
router.post("/:id/like" , middleware.isLoggedIn ,function(req , res){
    Campground.findById(req.params.id , function(err , foundCampground){
        if(err){
            console.log(err);
            return res.redirect("/viewCamp");
        }
        //checking if req.user._id exists in foundCampground.likes
        var foundUserLike = foundCampground.likes.some(function(like){
            return like.equals(req.user._id);
        });
        if(foundUserLike){
            //user already liked , removing like
            foundCampground.likes.pull(req.user._id);
        }else{
            //adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function(err){
            if(err){
                console.log(err);
                return res.redirect("/viewCamp");
            }
            return res.redirect("/viewCamp/"+foundCampground._id);
        });
    });
});


//========================MAin========================
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, async function(result) {
       try{   
        // add cloudinary url for the image to the campground object under image property
        req.body.campground.image = result.secure_url;
        // add author to campground
        req.body.campground.author = {
          id: req.user._id,
          username: req.user.username
        }

      let campground = await Campground.create(req.body.campground);
      let user = await User.findById(req.user._id).populate('followers').exec();
      let newNotification = {
          username : req.user.username , 
          campgroundId : campground.id
      }

      for(const follower of user.followers){
          let notification = await Notification.create(newNotification);
          follower.notifications.push(notification);
          follower.save();
      }
      res.redirect("/viewCamp");
    }catch(err){
        req.flash('error' , err.message);
        res.redirect('back');
    }
  });
});



//==========================================================================================================



//EDIT CAMPGROUND=================
router.get("/:id/edit" , middleware.checkCampgroundOwnership ,function(req , res){
        Campground.findById(req.params.id,function(err , campground){
                    res.render("campground/edit" , {campground : campground});
            });
});
//UPDATE CAMPGROUND===============
router.put("/:id", middleware.checkCampgroundOwnership ,upload.single('image'),function(req , res ){
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the campground object under image property
        req.body.campground.image = result.secure_url;
        Campground.findByIdAndUpdate(req.params.id , req.body.campground ,function(err , data){
            if(err){
                console.log(err);
                res.redirect("/viewCamp");
            }else{
                req.flash("success","Campground Updated successfully..");
                res.redirect("/viewCamp/"+req.params.id);
            }
        }); 
      });
});

//DESTROY CAMPGROUND=====================

router.delete("/:id" , middleware.checkCampgroundOwnership , function(req , res){
    Campground.findByIdAndRemove(req.params.id , function(err){
        if(err){
            console.log(err);
            res.redirect("/viewCamp");
        }else{
            req.flash("success","Campground deleted successfully..")
            res.redirect("/viewCamp");
        }
    });
});


function escapeRegrex(text){
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g , "\\$&");
  console.log(text);
}
module.exports = router;
