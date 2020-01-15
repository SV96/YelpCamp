var Campground = require("../models/campground");
var Comment = require("../models/comment");
//all middleware goes here
var middlewareObj = {};

middlewareObj.checkcampgroundOwnership = function (req,res,next){
    if(req.isAuthenticated()){

        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect('/campgrounds')
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){              
                    next();
                }
               else{
                  res.redirect("back");
               } 
            }
        });
    }
    else{
        console.log("You need to loggedIn");
        res.send("YOu need to be loggedIn");
    }
}

middlewareObj.checkcommentOwnership  = function (req,res,next){
    if(req.isAuthenticated()){

        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                }
               else{
                  req.flash("error","you don't have permsiion to do that");
                  res.redirect("back");
               } 
            }
        });
    }
    else{
       
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn =function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
    
}



module.exports = middlewareObj;