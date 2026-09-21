import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Detect serverless environment (e.g., Vercel, AWS Lambda)
const IS_SERVERLESS = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);

// In serverless environments, /var/task is read-only; /tmp is the only writable directory
const DATA_DIR = IS_SERVERLESS ? '/tmp' : path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'messages.json');

// In-memory fallback ensuring operations never fail on read-only environments
let inMemoryMessages = [];

// Safe initialization
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    inMemoryMessages = JSON.parse(raw);
  } else {
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
} catch (err) {
  console.warn('[Storage] File system read-only or restricted. Operating with in-memory store:', err.message);
}

// Utility to read messages safely
function readMessages() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        inMemoryMessages = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Storage] Failed to read messages file, using in-memory store:', err.message);
  }
  return inMemoryMessages;
}

// Utility to write messages safely
function writeMessages(messages) {
  inMemoryMessages = messages;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.warn('[Storage] Note: Could not write to disk (persisted in memory):', err.message);
    return true; // Still successful in memory
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    server: "Prince Jain Developer Portfolio API",
    platform: IS_SERVERLESS ? 'serverless-edge' : 'standalone-node',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 2. Dynamic Portfolio Stats Endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    name: 'Prince Jain',
    role: 'Full Stack Developer & AI/DS Student',
    college: 'Laxmi Narain College of Technology (LNCT), Bhopal',
    cgpa: '6.86',
    semester: '5th Semester (Graduation 2028)',
    dsaSolved: 246,
    dsaBreakdown: {
      arraysStrings: 78,
      linkedListsStacks: 46,
      treesBST: 38,
      sortingSearching: 42,
      recursionBacktracking: 28,
      other: 14
    },
    sih: {
      team: 'AlgNite',
      project: 'SmartMet AI',
      problemStatementId: '26034',
      theme: 'Agriculture, FoodTech & Rural Development',
      role: 'Lead Frontend UI/UX Developer',
      status: 'Active SIH 2026 Innovation Sprint'
    },
    projectsCount: 2,
    activeStatus: 'Available for Internship & Full-Time Opportunities'
  });
});

// 3. Dynamic Projects Endpoint
app.get('/api/projects', (req, res) => {
  res.json([
    {
      id: 'sheryians',
      title: "Sheryians Coding School Clone / Course Platform",
      status: 'Completed',
      image: 'assets/sharyn_project.jpg',
      description: 'A responsive educational course platform crafted during frontend web development training at Sheryians Coding School using modern HTML5, CSS3, Flexbox, and CSS Grid.',
      tags: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Sheryians Coding School', 'Responsive UI'],
      github: 'https://github.com/PrinceJain20',
      demoUrl: null
    },
    {
      id: 'movie',
      title: 'Movie Recommendation System',
      status: 'Personal Project',
      image: 'assets/movie_app.jpg',
      description: "Prince's independent AI-driven movie discovery and personalized recommendation platform built with React, JavaScript, and custom UI components.",
      tags: ['React', 'JavaScript', 'Personal Project', 'REST API', 'UI/UX'],
      github: 'https://github.com/PrinceJain20',
      demoUrl: null
    }
  ]);
});

// 4. Contact Form Submission (POST /api/contact)
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Please enter your name.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
  }

  if (!message || message.trim().length < 5) {
    return res.status(400).json({ success: false, error: 'Message must be at least 5 characters long.' });
  }

  const newMessage = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name: name.trim().slice(0, 100),
    email: email.trim().toLowerCase().slice(0, 120),
    subject: (subject ? subject.trim() : 'Portfolio Contact').slice(0, 150),
    message: message.trim().slice(0, 3000),
    createdAt: new Date().toISOString(),
    ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
  };

  const messages = readMessages();
  messages.unshift(newMessage);

  if (writeMessages(messages)) {
    console.log(`[Contact] New inquiry from ${newMessage.name} <${newMessage.email}>: "${newMessage.subject}"`);
    return res.status(201).json({
      success: true,
      message: `Thank you, ${newMessage.name}! Prince has received your message.`,
      id: newMessage.id,
      timestamp: newMessage.createdAt
    });
  } else {
    return res.status(500).json({ success: false, error: 'Failed to save message on server.' });
  }
});

// 5. Admin / Message Retrieval Endpoint (GET /api/messages)
app.get('/api/messages', (req, res) => {
  const messages = readMessages();
  res.json({
    total: messages.length,
    messages: messages
  });
});

// 6. Delete Message Endpoint (DELETE /api/messages/:id)
app.delete('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  const messages = readMessages();
  const filtered = messages.filter(m => m.id !== id);

  if (filtered.length === messages.length) {
    return res.status(404).json({ success: false, error: 'Message not found' });
  }

  writeMessages(filtered);
  res.json({ success: true, message: 'Message deleted successfully.' });
});

export default app;
