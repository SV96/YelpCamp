var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require('../middleware');


//commets new
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

//commets create
router.post("/",middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           req.flash("error","Something went wrong");
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
                //
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();

                console.log("New comment's username will be " + req.user._id);
                //
               campground.comments.unshift(comment);
               campground.save();
               console.log(comment);
               req.flash("success","successfully added comment")
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});
//Edit
router.get('/:comment_id/edit',middleware.checkcommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.render('comments/edit',{campground_id: req.params.id,comment: foundComment});
        }
    })
    
});

//Comments Update
router.put('/:comment_id',middleware.checkcommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
});

//Deleting
router.delete('/:comment_id',middleware.checkcommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log("back");
        }
        else{
            req.flash("success","comment deleted");
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
});





module.exports = router;