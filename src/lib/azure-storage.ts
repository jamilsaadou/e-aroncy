import { BlobServiceClient } from '@azure/storage-blob';

// Azure Storage configuration
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) {
  console.warn('AZURE_STORAGE_CONNECTION_STRING not found. File uploads will be disabled.');
}

const blobServiceClient = connectionString 
  ? BlobServiceClient.fromConnectionString(connectionString)
  : null;

// Upload file to Azure Blob Storage
export async function uploadToAzure(
  file: File | Buffer, 
  containerName: string,
  fileName?: string
): Promise<string> {
  if (!blobServiceClient) {
    throw new Error('Azure Storage not configured');
  }

  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({
      access: 'blob' // Public read access
    });
    
    const blobName = fileName || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    let buffer: Buffer;
    let contentType: string;
    
    if (file instanceof File) {
      buffer = Buffer.from(await file.arrayBuffer());
      contentType = file.type;
    } else {
      buffer = file;
      contentType = 'application/octet-stream';
    }
    
    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: { blobContentType: contentType }
    });
    
    return blockBlobClient.url;
  } catch (error) {
    console.error('Azure upload error:', error);
    throw new Error('Erreur lors de l\'upload du fichier');
  }
}

// Upload from multer file
export async function uploadMulterFileToAzure(
  file: Express.Multer.File,
  containerName: string
): Promise<string> {
  if (!blobServiceClient) {
    throw new Error('Azure Storage not configured');
  }

  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({
      access: 'blob'
    });
    
    const blobName = `${Date.now()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    await blockBlobClient.upload(file.buffer, file.buffer.length, {
      blobHTTPHeaders: { blobContentType: file.mimetype }
    });
    
    return blockBlobClient.url;
  } catch (error) {
    console.error('Azure upload error:', error);
    throw new Error('Erreur lors de l\'upload du fichier');
  }
}

// Delete file from Azure Blob Storage
export async function deleteFromAzure(
  containerName: string,
  blobName: string
): Promise<boolean> {
  if (!blobServiceClient) {
    return false;
  }

  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    await blockBlobClient.delete();
    return true;
  } catch (error) {
    console.error('Azure delete error:', error);
    return false;
  }
}

// Get container names for different file types
export const CONTAINERS = {
  FORMATION_IMAGES: 'formation-images',
  FORMATION_VIDEOS: 'formation-videos',
  FORMATION_DOCUMENTS: 'formation-documents',
  USER_AVATARS: 'user-avatars',
  CERTIFICATES: 'certificates'
} as const;

// Validate file type
export function validateFileType(file: File | Express.Multer.File, allowedTypes: string[]): boolean {
  const mimeType = file instanceof File ? file.type : file.mimetype;
  return allowedTypes.includes(mimeType);
}

// Get file extension from filename
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

// Generate unique filename
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const extension = getFileExtension(originalName);
  return `${timestamp}-${random}.${extension}`;
}
