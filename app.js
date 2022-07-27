//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lod=require("lodash");
const mongoose=require("mongoose");

const homeStartingContent = "Have a fresh start of your day with an inspiring quote.";
const aboutContentDescription = "We all have many thoughts in our mind regarding various stuff in the world, but always find it difficult to express them. So we provide you your own space for writing them. Always feel free to jot down your thoughts here.";
const contactContentDescription = "Contact:+41-7346558921\n Email:XYZ_Write@usermail.com\n Address:141, Near Banker's Street, London-400706";

const blogs=[];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/blogsDB', {useNewUrlParser: true, useUnifiedTopology: true});


const blogSchema=new mongoose.Schema({
  title:String,
  content:String
});
const Blog=mongoose.model("Blog",blogSchema);


app.get("/",function(req,res){
  Blog.find({},function(err,foundBlogs){
    if(!err){
      res.render("home",{homeContent:homeStartingContent,blogItems:foundBlogs});
    }
  });
});

app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContentDescription});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContentDescription});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.get("/post/:postId",function(req,res){
  let postId=(req.params.postId);
  Blog.findOne({_id:postId},function(err,foundItem){
    if(!err){
      res.render("post",{blogTitle:foundItem.title,blogContent:foundItem.content});
    }
    else{
      console.log("Error");
    }
  });
  
});

app.post("/",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  let post = new Blog({
    title:req.body.blogTitle,
    content:req.body.blogContent
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });


});











app.listen(3000, function() {
  console.log("Server started on port 3000");
});
