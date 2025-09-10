import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { 
  requireAuth, 
  requireRole,
  createAuthErrorResponse,
  logUserActivity
} from '../../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions
    const roleCheck = requireRole(['ADMIN', 'MODERATOR']);
    const authResult = await roleCheck(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non autorisé', 401);
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({
        error: 'Aucun fichier fourni'
      }, { status: 400 });
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Type de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.'
      }, { status: 400 });
    }

    // Vérifier la taille du fichier (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'Fichier trop volumineux. Taille maximum: 5MB'
      }, { status: 400 });
    }

    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${extension}`;

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'articles');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà
    }

    // Sauvegarder le fichier
    const filePath = join(uploadsDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);

    // URL publique du fichier
    const fileUrl = `/uploads/articles/${fileName}`;

    // Logger l'activité
    await logUserActivity(
      authResult.user.id,
      'media_uploaded',
      request,
      true,
      {
        fileName,
        fileSize: file.size,
        fileType: file.type,
        fileUrl
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Image uploadée avec succès',
      data: {
        media: {
          id: `${timestamp}-${randomString}`,
          url: fileUrl,
          fileName,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString()
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur upload image:', error);
    return NextResponse.json({
      error: 'Erreur serveur lors de l\'upload de l\'image'
    }, { status: 500 });
  }
}

// Méthode OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
