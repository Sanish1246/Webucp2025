import path from 'path';
import { Post } from '../models/Post.js';
import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';

const __dirname = import.meta.dirname;
const postRoute = express.Router();

// Middleware to handle file uploads
postRoute.use(fileUpload());

postRoute.post('/api/post', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized: No user session found' });
    }

    
    const { title, likes, theme, font, music } = req.body;
    const contentArray = [];

    const username = req.session.user.username;

    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Build contentArray based on messageN and fileN pairs
    const bodyKeys = Object.keys(req.body);
    const messageKeys = bodyKeys.filter(k => /^message\d+$/.test(k));

    for (const msgKey of messageKeys) {
      const index = msgKey.replace('message', '');
      const fileKey = `file${index}`;

      const message = req.body[msgKey] || '';
      let mediaPath = '';

      if (req.files && req.files[fileKey]) {
        const file = req.files[fileKey];
        const timestamp = Date.now();
        const uniqueName = `${timestamp}-${file.name}`;
        const savePath = path.join(uploadDir, uniqueName);

        await file.mv(savePath);
        mediaPath = `/uploads/${uniqueName}`;
      }

      contentArray.push({ message, media: mediaPath });
    }

    // Optional: if there are files without messages (e.g. file2 without message2)
    if (req.files) {
      for (const key in req.files) {
        if (key.startsWith('file')) {
          const index = key.replace('file', '');
          const hasMatchingMessage = contentArray.some(c => c.media.includes(index));
          if (!req.body[`message${index}`] && !hasMatchingMessage) {
            const file = req.files[key];
            const timestamp = Date.now();
            const uniqueName = `${timestamp}-${file.name}`;
            const savePath = path.join(uploadDir, uniqueName);

            await file.mv(savePath);

            contentArray.push({
              message: '',
              media: `/uploads/${uniqueName}`
            });
          }
        }
      }
    }

    const newPost = new Post({
      username,
      title,
      likes: Number(likes) || 0,
      theme,
      font,
      music,
      content: contentArray,
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating post' });
  }
});

postRoute.get('/api/post', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized: No user session found' });
    }

    const username = req.session.user.username;

    const userPosts = await Post.find({ username }).sort({ _id: -1 }); // newest first

    res.status(200).json({ posts: userPosts });

  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
});


export default postRoute;
