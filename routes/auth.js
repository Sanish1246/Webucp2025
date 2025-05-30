//Route for requests related to authorization
import express from 'express';
import { User } from '../models/User.js';
const router = express.Router();

// POST request to register a user
router.post('/register', async (req, res) => {
  const userData = req.body;

  try {
    console.log("Received user:", userData);

    const usernameExists = await User.findOne({ username: userData.username });
    if (usernameExists) {
      return res.status(401).json({ error: "Username already in use!" });
    }

    const emailExists=await User.findOne({ email: userData.email });
    if (emailExists) {
      return res.status(401).json({ error: "Email already in use!" });
    }

    const newUser = await User.create(userData); 

    req.session.user = {
      email: newUser.email,
      username: newUser.username,
      password: newUser.password,
    };

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id
    });

  } catch (err) {
    console.error("Registration error:", err);

      if (err.name === 'ValidationError') {

    const firstError = Object.values(err.errors)[0].message;
    return res.status(400).json({ error: firstError });
  }
    res.status(500).json({ error: "Internal server error" });
  }
});


// POST Request to login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    req.session.user = {
      email:user.email,
      username: user.username,
      password: user.password,
    };

    res.status(200).json({
      message: "User logged in! " + user.username,
      userId: user._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//GET request to check login status
router.get('/login', (req, res) => {
  if (req.session.user) {
    res.status(200).json({
      email: req.session.user.email,
    });
  } else {
    res.status(200).json({error: "Error"});
  }
});
  
  // DELETE request to logout
  router.delete('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ error: "Logout failed" });
      res.status(200).json({ message: "✅ User logged out successfully" });
    });
  });
  
  export default router;