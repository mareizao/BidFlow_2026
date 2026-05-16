export interface UploadDocumentDTO {
  filename: string;
  storageKey: string;
  fileSize: number;
  mimeType: string;
  licitacionId: string;
  uploadedBy: string;
}

export interface DocumentoResponseDTO {
  id: string;
  filename: string;
  storageKey: string;
  fileSize: number;
  mimeType: string;
  licitacionId: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface DocumentoListItemDTO {
  id: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface LicitacionDocumentosResponseDTO {
  licitacionId: string;
  documentos: DocumentoListItemDTO[];
  total: number;
}
