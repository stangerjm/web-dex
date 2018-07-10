const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/posts');
let Post = require('../models/post');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error.'));
db.once('open', function(callback) {
  console.log('Connection success!');
})

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.post('/posts', (req, res) => {
  let db = req.db;
  let title = req.body.title;
  let description = req.body.description;
  let newPost = new Post({
    title: title,
    description: description
  });

  newPost.save(function(error) {
    if (error) {
      console.log(error);
    }

    res.send({
      success: true,
      message: 'Post saved!'
    })
  })
});

app.get('/posts', (req, res) => {
  Post.find({}, 'title description', function (error, posts) {
    if (error) {
      console.error(error);
    }

    res.send({
      posts: posts
    });
  }).sort({_id: -1})
});

app.get('/post/:id', (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, 'title description', function(err, post) {
    if (err) { console.error(err) }
    res.send(post);
  })
});

app.put('/posts/:id', (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, 'title description', function (error, post) {
    if (error) { console.error(error); }

    post.title = req.body.title
    post.description = req.body.description
    post.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
});

app.delete('/posts/:id', (req, res) => {
  var db = req.db;
  Post.remove({
    _id: req.params.id
  }, function(err, post){
    if (err) {
      res.send(err);
    }

    res.send({
      success: true
    })
  })
})

let port = 8081;
app.listen(process.env.PORT || port);
console.log('Listening on port: ' + port);
