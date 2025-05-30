import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import imageHostRoutes from './routes/imagehost';
import wikiRoutes from './routes/wiki';
import wikiTagsRoutes from './routes/wiki_tags';
import path from 'path';

dotenv.config();

const app = express();
// app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/imagehost', imageHostRoutes);
app.use('/api/wiki', wikiRoutes);
app.use('/api/wiki-tags', wikiTagsRoutes);

// Servir les fichiers uploadés statiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
