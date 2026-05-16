import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { FileStorage } from './FileStorage';

export class LocalFileStorage implements FileStorage {
  private readonly uploadPath: string;

  constructor() {
    this.uploadPath = process.env.UPLOAD_PATH || '/app/uploads';
  }

  async save(file: Express.Multer.File, licitacionId: string): Promise<string> {
    // Multer ya guardó el archivo en disco con el storageKey como nombre.
    // Solo retornamos el storageKey (nombre del archivo en disco).
    return file.filename;
  }

  async getStream(licitacionId: string, storageKey: string): Promise<Readable> {
    const filePath = path.join(this.uploadPath, licitacionId, storageKey);

    if (!fs.existsSync(filePath)) {
      throw new Error('Archivo no encontrado en el sistema de archivos');
    }

    return fs.createReadStream(filePath);
  }

  async delete(licitacionId: string, storageKey: string): Promise<void> {
    const filePath = path.join(this.uploadPath, licitacionId, storageKey);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
