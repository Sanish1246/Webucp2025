import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Regex
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(value);
      },
      message: 'Invalid password.'
    }
  }
}, { collection: 'Users' });

export const User = mongoose.model('User', userSchema);