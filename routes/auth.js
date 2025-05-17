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

    const newUser = await User.create(userData); 

    req.session.user = {
      username: newUser.username,
      password: newUser.password,
    };

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// POST Request to login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    req.session.user = {
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
      username: req.session.user.username,
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