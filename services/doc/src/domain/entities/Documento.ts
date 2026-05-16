export class Documento {
  constructor(
    public readonly id: string,
    public readonly filename: string,
    public readonly storageKey: string,
    public readonly fileSize: number,
    public readonly mimeType: string,
    public readonly licitacionId: string,
    public readonly uploadedBy: string,
    public readonly uploadedAt: Date
  ) {}
}
