var express = require("express");
var router  = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");

//Root routes
router.get("/", function(req, res){
    res.render("landing");
});

//regsiter form route
router.get('/register',function(req,res){
    res.render("register");
});

//handle sing up logic
router.post('/register',function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
           
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res,function(){
            req.flash("success","Welcome to yelpCamp" +user.username);
            res.redirect("/campgrounds");
        })
    })
}); 

//show login form
router.get('/login',function(req,res){
    res.render("login");
});

//handle login logic
router.post('/login',passport.authenticate("local",{
    successRedirect:"/campgrounds",failureRedirect:"/login"
}),function(req,res){

});

//logout logic
router.get('/logout',function(req,res){
    req.logout();
    req.flash("success","logged you out");
    res.redirect("/campgrounds")
});



module.exports = router;