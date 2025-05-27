import { Router } from 'express';
import { db } from '../config/db';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Lister tous les tags
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM wiki_tags ORDER BY name ASC');
    res.json({ tags: rows });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des tags." });
  }
});

// Créer un tag
router.post('/', authenticateToken, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: "Nom du tag requis." });
    return;
  }
  try {
    await db.query('INSERT INTO wiki_tags (name) VALUES (?)', [name]);
    res.json({ message: "Tag créé." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du tag." });
  }
});

// Associer un tag à une page
router.post('/assign', authenticateToken, async (req, res) => {
  const { page_id, tag_id } = req.body;
  if (!page_id || !tag_id) {
    res.status(400).json({ message: "page_id et tag_id requis." });
    return;
  }
  try {
    await db.query('INSERT IGNORE INTO wiki_page_tags (page_id, tag_id) VALUES (?, ?)', [page_id, tag_id]);
    res.json({ message: "Tag associé à la page." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'association du tag." });
  }
});

// Retirer un tag d'une page
router.post('/remove', authenticateToken, async (req, res) => {
  const { page_id, tag_id } = req.body;
  if (!page_id || !tag_id) {
    res.status(400).json({ message: "page_id et tag_id requis." });
    return;
  }
  try {
    await db.query('DELETE FROM wiki_page_tags WHERE page_id = ? AND tag_id = ?', [page_id, tag_id]);
    res.json({ message: "Tag retiré de la page." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du retrait du tag." });
  }
});

// Lister les pages par tag
router.get('/:tag', async (req, res) => {
  const { tag } = req.params;
  try {
    const [tagRows] = await db.query('SELECT id FROM wiki_tags WHERE name = ?', [tag]);
    if ((tagRows as any[]).length === 0) {
      res.json({ pages: [] });
      return;
    }
    const tagId = (tagRows as any)[0].id;
    const [rows] = await db.query(
      'SELECT p.id, p.title FROM wiki_pages p JOIN wiki_page_tags pt ON p.id = pt.page_id WHERE pt.tag_id = ? AND p.deleted_at IS NULL',
      [tagId]
    );
    res.json({ pages: rows });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des pages par tag." });
  }
});

export default router;
