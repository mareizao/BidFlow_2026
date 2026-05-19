// services/doc/src/interfaces/middleware/uploadMiddleware.ts
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];

const BASE_UPLOAD_PATH = process.env.UPLOAD_PATH || "/tmp/uploads";
if (!fs.existsSync(BASE_UPLOAD_PATH)) {
  fs.mkdirSync(BASE_UPLOAD_PATH, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const licitacionId = req.body.licitacionId || "temp";
    const uploadPath = path.join(BASE_UPLOAD_PATH, String(licitacionId));
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const storageKey = `${uuidv4()}${extension}`;

    // ✅ Nombres EXACTOS del schema.prisma + fileSize como número
    req.body.filename = file.originalname;
    req.body.mimeType = file.mimetype;
    req.body.fileSize = file.size; // Multer ya lo trae como número (bytes)
    req.body.storageKey = storageKey;

    cb(null, storageKey);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido"));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || "52428800") },
  fileFilter,
});
