import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  username: String,
  title: String,
  likes: Number,
  theme: String,
  font: String,
  music: String,
  content: [{
    message: String,
    media: String
  }]
}, { collection: 'Posts' });

export const Post = mongoose.model('Post', postSchema);
