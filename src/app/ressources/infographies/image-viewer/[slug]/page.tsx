'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, ZoomIn, ZoomOut, RotateCw, FileText } from 'lucide-react';
import { useState } from 'react';

const images = {
  'regles-cybersecurite': {
    title: 'Les règles de la cybersécurité',
    description: 'Une infographie complète présentant les bonnes pratiques essentielles pour protéger votre organisation.',
    author: 'E-ARONCY',
    date: 'Janvier 2024',
    size: '2.1 MB',
    dimensions: '1080x1920',
    language: 'Français',
    category: 'Bonnes pratiques',
    imagePath: '/assets/images/R%C3%A8gles%20de%20la%20cybsers%C3%A9curit%C3%A9.png',
    tags: ['Sécurité', 'Bonnes pratiques', 'Formation']
  },
  'anatomie-phishing': {
    title: 'Anatomie d\'une attaque de phishing',
    description: 'Décryptage visuel des techniques utilisées par les cybercriminels dans les attaques de phishing.',
    author: 'E-ARONCY',
    date: 'Février 2024',
    size: '1.8 MB',
    dimensions: '1080x1350',
    language: 'Français',
    category: 'Sensibilisation',
    imagePath: '/assets/images/Anatomie%20d\'une%20attaque%20de%20fishing.png',
    tags: ['Phishing', 'Email', 'Sensibilisation']
  },
  'securisation-teletravail': {
    title: 'Sécurisation du télétravail',
    description: 'Guide visuel pour maintenir la sécurité lors du travail à distance.',
    author: 'E-ARONCY',
    date: 'Mars 2024',
    size: '2.5 MB',
    dimensions: '1080x1920',
    language: 'Français',
    category: 'Télétravail',
    imagePath: '/assets/images/Securisation%20T%C3%A9l%C3%A9travail.png',
    tags: ['Télétravail', 'VPN', 'Sécurité']
  },
  'types-cyberattaques': {
    title: 'Types de cyberattaques',
    description: 'Les différents types de cyberattaques et comment s\'en protéger.',
    author: 'E-ARONCY',
    date: 'Avril 2024',
    size: '1.9 MB',
    dimensions: '1080x1350',
    language: 'Français',
    category: 'Sensibilisation',
    imagePath: '/assets/images/Type%20de%20cybserattaques%201.png',
    tags: ['Cyberattaques', 'Sensibilisation', 'Prévention']
  },
  'plan-cyberresilience-ong': {
    title: 'Plan de cyberrésilience pour ONG',
    description: 'Guide complet pour développer un plan de cyberrésilience adapté aux organisations non gouvernementales.',
    author: 'E-ARONCY',
    date: 'Mai 2024',
    size: '2.3 MB',
    dimensions: '1080x1920',
    language: 'Français',
    category: 'Plan d\'action',
    imagePath: '/assets/images/Plan%20de%20cyberr%C3%A9silience%20pour%20ONG%20(1).png',
    tags: ['ONG', 'Résilience', 'Plan d\'action']
  }
};

export default function ImageViewer() {
  const params = useParams();
  const slug = params.slug as string;
  const image = images[slug as keyof typeof images];
  
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!image) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Infographie non trouvée</h1>
          <p className="text-gray-600 mb-4">L'infographie demandée n'existe pas ou a été supprimée.</p>
          <Link href="/ressources/infographies" className="text-blue-600 hover:text-blue-800">
            Retour aux infographies
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = image.imagePath;
    link.download = `${image.title}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erreur lors du partage:', error);
      }
    } else {
      // Fallback: copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const zoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const rotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/ressources/infographies"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                  {image.title}
                </h1>
                <p className="text-sm text-gray-500">{image.author}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Contrôles de zoom */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={zoomOut}
                  className="p-2 hover:bg-white rounded transition-colors"
                  title="Zoom arrière"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="px-2 py-1 text-sm font-medium min-w-[60px] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={zoomIn}
                  className="p-2 hover:bg-white rounded transition-colors"
                  title="Zoom avant"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
              
              <button
                onClick={rotate}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Rotation"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Partager"
              >
                <Share2 className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Info */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <span>📅 {image.date}</span>
              <span>📐 {image.dimensions}</span>
              <span>💾 {image.size}</span>
              <span>🌐 {image.language}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {image.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden flex items-center justify-center"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              minHeight: '600px'
            }}
          >
            <img
              src={image.imagePath}
              alt={image.title}
              className="max-w-full max-h-full object-contain"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transition: 'transform 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Document Description */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">À propos de cette infographie</h2>
          <p className="text-gray-600 mb-4">{image.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {image.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Informations</h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Auteur:</dt>
                  <dd className="text-gray-900">{image.author}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Date:</dt>
                  <dd className="text-gray-900">{image.date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Dimensions:</dt>
                  <dd className="text-gray-900">{image.dimensions}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Taille:</dt>
                  <dd className="text-gray-900">{image.size}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Télécharger l'infographie</span>
                </button>
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Partager cette infographie</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
