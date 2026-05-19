// services/doc/src/controllers/DocController.ts
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export class DocController {
  async upload(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const file = req.file;
      const { licitacionId, filename, mimeType, fileSize, storageKey } =
        req.body;

      if (!file || !licitacionId || !storageKey) {
        res
          .status(400)
          .json({ error: "Archivo, licitacionId y metadatos son requeridos" });
        return;
      }

      // ✅ Validar fileSize explícitamente
      const fileSizeNum = Number(fileSize);
      if (!fileSizeNum || fileSizeNum <= 0) {
        res.status(400).json({ error: "fileSize inválido" });
        return;
      }

      const docRecord = await prisma.documento.create({
        data: {
          id: crypto.randomUUID(),
          licitacionId,
          filename,
          storageKey,
          fileSize: fileSizeNum, // ✅ Ahora es un Int válido
          mimeType,
          uploadedBy: req.user!.id,
        },
      });

      res.status(201).json({ success: true, data: docRecord });
    } catch (error: any) {
      console.error("[DocController.upload]", error);
      res
        .status(500)
        .json({ error: error.message || "Error interno al guardar documento" });
    }
  }
}
