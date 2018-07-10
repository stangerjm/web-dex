const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PostSchema = Schema({
  title: String,
  description: String
});

let Post = mongoose.model('Post', PostSchema);
module.exports = Post;
