import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import learnerRoutes from './routes/learnerRoutes.js';
import curriculumRoutes from './routes/curriculumRoutes.js';
import familyRoutes from './routes/familyRoutes.js';
import invitationRoutes from './routes/invitationRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import { initDatabase } from './db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB schema on app creation
initDatabase();

export const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/learners', learnerRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/lessons', lessonRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'ThutoBridge (CAPS Adaptive Learning Platform)',
    stage: 'Stage 1 — Application Foundation',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build if present (for unified single-command production deployment)
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Client SPA fallback
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // In dev mode when client isn't built yet
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>ThutoBridge API</title></head>
          <body style="font-family: sans-serif; padding: 2rem; max-width: 600px; margin: auto;">
            <h2>ThutoBridge API Server is running</h2>
            <p>API endpoints are accessible at <code>/api/...</code>.</p>
            <p>To run the full web UI in development mode, run <code>npm run dev</code> from the project root.</p>
          </body>
        </html>
      `);
    }
  });
});
