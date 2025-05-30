import express, { Request, Response, RequestHandler, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { authenticateToken } from "../middleware/authMiddleware";
import { db } from '../config/db';

const router = express.Router();

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = uuidv4() + ext;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [".png", ".jpg", ".jpeg"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers PNG et JPG sont autorisés."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // 1000 Mo
  fileFilter,
});

interface UserFile {
  filename: string;
  url: string;
}
const userFiles: Record<string, UserFile[]> = {};

// Upload d'image
router.post("/upload", authenticateToken, upload.single("file"), async function (req, res) {
  const username = (req as any).user?.username;
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "Aucun fichier envoyé." });
    return;
  }
  try {
    // Enregistrer dans la base de données
    await db.query(
      'INSERT INTO imagehost (user, original_label, path) VALUES (?, ?, ?)',
      [username, file.originalname, file.filename]
    );
    const fileUrl = `/uploads/${file.filename}`;
    res.json({ url: fileUrl });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement en base de données." });
  }
});

// Lister les fichiers uploadés par l'utilisateur
router.get("/my", authenticateToken, async function (req, res) {
  const username = (req as any).user?.username;
  try {
    const [rows] = await db.query(
      'SELECT path AS filename, original_label, uploaded_at FROM imagehost WHERE user = ? ORDER BY uploaded_at DESC',
      [username]
    );
    // Retourner aussi l'URL d'accès direct
    const files = (rows as any[]).map(row => ({
      filename: row.filename,
      url: `/uploads/${row.filename}`,
      original_label: row.original_label,
      uploaded_at: row.uploaded_at
    }));
    res.json({ files });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des images." });
  }
});

// Gestion d'erreur Multer et globale pour toujours renvoyer du JSON
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    // Erreur Multer (limite de taille, etc)
    res.status(400).json({ message: err.message });
  } else if (err) {
    // Erreur custom (ex: mauvais type)
    res.status(400).json({ message: err.message || "Erreur lors de l'upload." });
  } else {
    next();
  }
});

export default router;
