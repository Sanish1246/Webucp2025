import express from 'express';
import session from 'express-session';
import { connectToDb } from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';


const app = express();
const port = 8000;
const hostname = 'localhost';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({ secret: 'Sanish12', resave: false, saveUninitialized: true, cookie: { secure: false } }));

// Middleware

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json()); // ✅ Allowing parsing JSON

// Routes
import authRoutes from './routes/auth.js';
app.use('/', authRoutes);

import postRoute from './routes/createPost.js';
app.use('/', postRoute);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// DB connection
async function startServer() {
  try {
    await connectToDb();

    app.listen(port, () => {
      console.log(`Server listening on http://${hostname}:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

startServer();