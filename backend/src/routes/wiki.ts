import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireMod } from '../middleware/requireMod';
import { db } from '../config/db';

const router = Router();

// Rechercher des pages (titre, contenu, id) - doit être avant /:id
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.json({ pages: [] });
    return;
  }
  try {
    const [rows] = await db.query(
      'SELECT id, title FROM wiki_pages WHERE deleted_at IS NULL AND (id = ? OR title LIKE ? OR content LIKE ?)',
      [q, `%${q}%`, `%${q}%`]
    );
    res.json({ pages: rows });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ message: "Erreur lors de la recherche." });
  }
});

// Lister toutes les pages du wiki
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, title FROM wiki_pages WHERE deleted_at IS NULL ORDER BY updated_at DESC');
    res.json({ pages: rows });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ message: "Erreur lors de la récupération des pages." });
  }
});

// Récupérer une page par ID (avec tags)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM wiki_pages WHERE id = ? AND deleted_at IS NULL', [id]);
    if ((rows as any[]).length === 0) {
      if (!res.headersSent) res.status(404).json({ message: "Page non trouvée." });
      return;
    }
    const page = (rows as any)[0];
    // Récupérer les tags associés à la page
    const [tagRows] = await db.query(
      'SELECT t.id, t.name FROM wiki_tags t JOIN wiki_page_tags pt ON t.id = pt.tag_id WHERE pt.page_id = ?',
      [id]
    );
    page.tags = tagRows;
    res.json({ page });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ message: "Erreur lors de la récupération de la page." });
  }
});

// Créer une nouvelle page (authentifié, mod ou admin)
router.post('/', authenticateToken, requireMod, async (req, res) => {
  let { id, title, content } = req.body;
  const author_id = (req as any).user?.id;
  if (!title || content === undefined || content === null) {
    res.status(400).json({ message: "Titre et contenu requis." });
    return;
  }
  if (!id) {
    id = uuidv4();
  }
  try {
    await db.query('INSERT INTO wiki_pages (id, title, content, author_id) VALUES (?, ?, ?, ?)', [id, title, content, author_id]);
    res.json({ id });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ message: "Erreur lors de la création de la page." });
  }
});

// Modifier une page (authentifié, mod ou admin)
router.put('/:id', authenticateToken, requireMod, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const editor_id = (req as any).user?.id;
  if (!title || !content) {
    res.status(400).json({ message: "Titre et contenu requis." });
    return;
  }
  try {
    // Historique
    const [rows] = await db.query('SELECT content FROM wiki_pages WHERE id = ?', [id]);
    if ((rows as any[]).length === 0) {
      if (!res.headersSent) res.status(404).json({ message: "Page non trouvée." });
      return;
    }
    await db.query('INSERT INTO wiki_page_history (page_id, content, editor_id) VALUES (?, ?, ?)', [id, (rows as any)[0].content, editor_id]);
    // Update
    await db.query('UPDATE wiki_pages SET title = ?, content = ? WHERE id = ?', [title, content, id]);
    res.json({ message: "Page mise à jour." });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ message: "Erreur lors de la mise à jour de la page." });
  }
});

// Supprimer (soft delete) une page (authentifié, mod ou admin)
router.delete('/:id', authenticateToken, requireMod, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE wiki_pages SET deleted_at = NOW() WHERE id = ?', [id]);
    res.json({ message: "Page supprimée." });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ message: "Erreur lors de la suppression de la page." });
  }
});

// Historique d'une page
router.get('/:id/history', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT h.id, h.content, h.edited_at, h.editor_id, u.username as editor_username
       FROM wiki_page_history h
       LEFT JOIN users u ON h.editor_id = u.id
       WHERE h.page_id = ? ORDER BY h.edited_at DESC`,
      [id]
    );
    res.json({ history: rows });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ message: "Erreur lors de la récupération de l'historique." });
  }
});

// Restaurer une version de l'historique (authentifié, mod ou admin)
router.post('/:id/restore/:historyId', authenticateToken, requireMod, async (req, res) => {
  const { id, historyId } = req.params;
  const editor_id = (req as any).user?.id;
  try {
    const [rows] = await db.query('SELECT content FROM wiki_page_history WHERE id = ?', [historyId]);
    if ((rows as any[]).length === 0) {
      if (!res.headersSent) res.status(404).json({ message: "Version non trouvée." });
      return;
    }
    const content = (rows as any)[0].content;
    await db.query('UPDATE wiki_pages SET content = ? WHERE id = ?', [content, id]);
    await db.query('INSERT INTO wiki_page_history (page_id, content, editor_id) VALUES (?, ?, ?)', [id, content, editor_id]);
    res.json({ message: "Page restaurée." });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ message: "Erreur lors de la restauration." });
  }
});

export default router;
