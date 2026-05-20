// services/doc/src/controllers/DocController.ts
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

export class DocController {
  async upload(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const file = req.file;
      const { licitacionId, storageKey } = req.body;

      // ✅ Validaciones básicas
      if (!file || !licitacionId || !storageKey) {
        console.warn("⚠️ Faltan datos:", {
          hasFile: !!file,
          licitacionId,
          storageKey,
          body: req.body,
        });
        res
          .status(400)
          .json({ error: "Archivo, licitacionId y storageKey son requeridos" });
        return;
      }

      // ✅ Obtener fileSize de forma segura (prioridad: req.file > req.body > fallback)
      const fileSize = file.size || Number(req.body.fileSize) || 0;
      if (!fileSize || fileSize <= 0) {
        console.warn("⚠️ fileSize inválido:", {
          file_size: file.size,
          body_fileSize: req.body.fileSize,
        });
        res.status(400).json({ error: "fileSize inválido" });
        return;
      }

      // ✅ Payload alineado 1:1 con schema.prisma
      const docRecord = await prisma.documento.create({
        data: {
          id: crypto.randomUUID(),
          licitacionId,
          filename: file.originalname, // ✅ Usar directamente de req.file
          storageKey,
          fileSize, // ✅ Ya validado como número válido
          mimeType: file.mimetype, // ✅ Usar directamente de req.file
          uploadedBy: req.user!.id,
        },
      });

      res.status(201).json({ success: true, data: docRecord });
    } catch (error: any) {
      console.error("[DocController.upload]", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      res
        .status(500)
        .json({ error: error.message || "Error interno al guardar documento" });
    }
  }

  async getMisDocumentos(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      // Consulta simple: trae todos los documentos donde uploadedBy sea el usuario actual
      const docs = await prisma.documento.findMany({
        where: { uploadedBy: req.user!.id },
        orderBy: { uploadedAt: "desc" },
      });

      res.status(200).json({ success: true, data: docs });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async download(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // 1. Buscar metadatos en Neon
      const doc = await prisma.documento.findUnique({ where: { id } });

      if (!doc) {
        res.status(404).json({ error: "Documento no encontrado" });
        return;
      }

      // 2. Construir ruta física del archivo
      // Ruta esperada: /tmp/uploads/{licitacionId}/{storageKey}
      const uploadPath = process.env.UPLOAD_PATH || "/tmp/uploads";
      const filePath = path.join(uploadPath, doc.licitacionId, doc.storageKey);

      if (!fs.existsSync(filePath)) {
        res
          .status(404)
          .json({ error: "Archivo físico no encontrado en el servidor" });
        return;
      }

      // 3. Enviar el archivo al navegador con su nombre original
      res.download(filePath, doc.filename);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
