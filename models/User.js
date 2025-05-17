import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
}, { collection: 'Users' });

export const User = mongoose.model('User', userSchema);