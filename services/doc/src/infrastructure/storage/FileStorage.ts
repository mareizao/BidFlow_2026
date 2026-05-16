import { Readable } from 'stream';

export interface FileStorage {
  save(file: Express.Multer.File, licitacionId: string): Promise<string>; // retorna storageKey
  getStream(licitacionId: string, storageKey: string): Promise<Readable>;
  delete(licitacionId: string, storageKey: string): Promise<void>;
}
