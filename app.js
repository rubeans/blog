const express = require("express");
const app = express();
const _ = require("lodash");
const mongoose = require("mongoose");

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

mongoose.connect("mongodb://localhost:27017/blog");

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = new mongoose.model("Post", postSchema);

app.get('/', (req, res) => {
  Post.find({}, (error, docs) => {
    if (!error)
      res.render("home", {
        posts: docs
      });
  })
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', (req, res) => {
  const post = new Post({
    title: req.body.titleTxt,
    content: req.body.postTxt
  });
  post.save();
  res.redirect("/");
});


app.get(`/posts/:id`, (req, res) => {
  const requestedId = req.params.id;

  Post.findOne({ _id: requestedId }, (error, docs) => {
    if (!error) {
      res.render('post', {
        postsTitle: docs.title,
        postsContent: docs.content
      });
    };
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};

app.listen(port, () => {
  console.log("Server has started.");
});