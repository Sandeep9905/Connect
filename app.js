var express             = require("express"),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOveride       = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                = require("./models/user");
    Campground          = require("./models/campground"),
    Comment             = require("./models/comments"),
    Notification        = require("./models/notification")
    
//seed data that we are taking from seed.js file
var seedDb = require("./seeds");
//executing seedDb
//seedDb();

mongoose.connect("data base connection url",{useNewUrlParser:true , useUnifiedTopology:true ,useFindAndModify: false ,useCreateIndex:true}).catch(err=>{
    console.log(err);
});
var app = express();
app.use(bodyParser.json());
//adding moment to use in all pages...
app.locals.moment = require("moment");

var indexRoutes         = require("./routes/index"),
    campgroundRoutes   = require("./routes/campground"),
    commentRoutes       = require("./routes/comment")

//here we requiring the express-session and at the same time we are using in a single line..
app.use(flash());
app.use(require("express-session")({
    secret : "this is the best thing that i will learn",
    resave: false,
    saveUninitialized: false
}));
//setting for ejs to use..
app.set("view engine", "ejs");
//to use body-parser to take data from the form body
app.use(express.static(__dirname+"/public")); 
//using method override ....
app.use(methodOveride("_method"));
app.use(bodyParser.urlencoded({extended:true}));

//initializing the passport function that we require above
app.use(passport.initialize());
app.use(passport.session());
//here we telling passport to use seliazeUser function that the data coming from User Schema that 
//it is using passport local mongoose function
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async function(req, res, next){
    try{
    res.locals.currentUser = req.user;
    if(req.user) {
     
       let user = await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec();
       res.locals.notifications = user.notifications.reverse();
    }
    res.locals.danger = req.flash("error");
    res.locals.success = req.flash("success");
    next();
    } catch(err) {
    console.log(err.message);
    }
 });
 


app.use("/",indexRoutes);
app.use("/viewCamp/:id/comments",commentRoutes);
app.use("/viewCamp",campgroundRoutes);

process.on('unhandledRejection',err =>{
    console.log(err.message);
    console.log('============');
});

app.listen(process.env.PORT || 3000 , function(){
    console.log("Yelp Camp server has been Started");
});
