var expres=require("express"),
    mongoose=require("mongoose"),
    passport=require("passport"),
    bodyParser=require("body-parser"),
    localStartegy=require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose"),
    user=require("./model/user")
    mongoose.connect("mongodb://127.0.0.1:27017/mvc");
    var app=expres();
    app.set("view engine","ejs");
    app.use(bodyParser .urlencoded({extended:true}));
    app.use(require("express-session")({
       secret:"WANNA BE YOURS",
       resave:false,
       saveUninitialized:false}));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localStartegy(user.authenticate()));
    passport.serializeUser(user.serializeUser());
    passport.deserializeUser(user.deserializeUser());
    app.get("/",function(req,res){
        res.render("home");

    });
    app.get("/profile",isloggedIn,function(req,res){
        res.render("profile");
    });
    app.get("/rgistration",function(req,res){
        res.render("rgistration");
    });

    // post method
    app.post("/rgistration",function(req,res)
    {
       var username=req.body.username;
       var password=req.body.password;
    user.register(new user({username:username}),
    password,function(err,user){
        if(err){
            console.log(err);
            return res.render("rgistration");
        }
        passport.authenticate("local")(
          req,res,function(){
            res.render("home");
          });
        
        });
    });
    //showing login form
    app.get("/login",function(req,res){
        res.render("login");
    });
    //handling user login
    app.post("/login",passport.authenticate("local",{successRedirect:"/profile",failureRedirect:"/login"})
    ,function(req,res){});
    //handling user logout
    app.get("/logout",function(req,res,next){
        req.logout(function(err){
            if(err){
                return next(err);
            }
            res.redirect("/");
        });
    });
    function isloggedIn(req,res,next){
        if(req.isAuthenticated())return next();
        res.redirect("/login");
    }
    var port=process.env.port || 8081;
    app.listen(port,function(){
        console.log("server has started");
    });

