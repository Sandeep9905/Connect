var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comments");


var seeddata =[
    {
        name:"Gergoia poll",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcS8uGR_bdhbWasshxZXKV-MT8CDb6jHvPKpBsfyniPvlRSUgJsk&usqp=CAU",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
    {
        name:"Night Bulk",
        image:"https://www.treebo.com/blog/wp-content/uploads/2018/04/Night-Camping-near-Mumbai-.jpg",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
    {
        name:"China phawm",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQrwr67sXSJ7SJMvM0MOlfBpWyShkhzRFIKMMwIVy4ItEeTXamX&usqp=CAU",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    }
];
function removeDb(){
    Campground.deleteMany({},function(err){
         if(err){
            console.log(err);
        }
        console.log("deleted");
        seeddata.forEach(function(data){
            Campground.create(data, function(err ,campground){
                if(err){
                    console.log(err);
                }else{
                    //create a comment
                    Comment.create({text:"wow bro what a nice trick",
                                     author:"Sandeep Roy"},function(err, commentdata){
                                         if(err){
                                             console.log(err);
                                         }else{
                                             //saving to the database....
                                             campground.comment.push(commentdata);
                                             campground.save();
                                             //.................
                                         }
                                     });
                    //...........
                }
            });
        });
    });
}
/*
function removeDb(){
    Campground.deleteMany({},function(err){
        if(err){
            console.log(err);
        }else{
            data.forEach(function(data){
                Campground.create(data ,function(err , campground){
                    if(err){
                        console.log(err);
                    }else{
                        //creating a comment...
                        Comment.create({ text:"hiii bro",author:"sandeep" },function(err , commentdata){
                            if(err){
                                console.log(err);
                            }else{
                                campground.comment.push(commentdata);
                                Comment.save(function(err , data){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        console.log(data);
                                    }
                                });
                            }
                        });
                        console.log("created");
                    }
                });
            });
        }
    });
}
*/

module.exports = removeDb;