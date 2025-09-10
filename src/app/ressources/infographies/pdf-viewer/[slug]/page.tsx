'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, ZoomIn, ZoomOut, RotateCw, FileText } from 'lucide-react';
import { useState } from 'react';

const documents = {
  'interpol-cyber-report-2022': {
    title: 'Rapport d\'évaluation des cybermenaces en Afrique 2022',
    description: 'Rapport INTERPOL sur les principales cybermenaces identifiées dans la région africaine',
    author: 'INTERPOL - Desk africain pour les opérations de lutte contre la cybercriminalité',
    date: 'Mars 2023',
    pages: 32,
    size: '4.2 MB',
    language: 'Français',
    category: 'Rapport officiel',
    pdfPath: '/assets/documents/interpol-cyber-report-2022.pdf',
    coverImage: '/assets/images/covers interpol.png'
  }
};

export default function PDFViewer() {
  const params = useParams();
  const slug = params.slug as string;
  const document = documents[slug as keyof typeof documents];
  
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Document non trouvé</h1>
          <p className="text-gray-600 mb-4">Le document demandé n'existe pas ou a été supprimé.</p>
          <Link href="/ressources/infographies" className="text-blue-600 hover:text-blue-800">
            Retour aux infographies
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = document.pdfPath;
    link.download = `${document.title}.pdf`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: document.description,
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
                  {document.title}
                </h1>
                <p className="text-sm text-gray-500">{document.author}</p>
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
              <span>📅 {document.date}</span>
              <span>📄 {document.pages} pages</span>
              <span>💾 {document.size}</span>
              <span>🌐 {document.language}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {document.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <iframe
              src={`${document.pdfPath}#zoom=${zoom}`}
              className="w-full"
              style={{ 
                height: 'calc(100vh - 200px)',
                minHeight: '600px'
              }}
              title={document.title}
            />
          </div>
        </div>
      </div>

      {/* Document Description */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">À propos de ce document</h2>
          <p className="text-gray-600 mb-4">{document.description}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Informations</h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Auteur:</dt>
                  <dd className="text-gray-900">{document.author}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Date:</dt>
                  <dd className="text-gray-900">{document.date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Pages:</dt>
                  <dd className="text-gray-900">{document.pages}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Taille:</dt>
                  <dd className="text-gray-900">{document.size}</dd>
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
                  <span>Télécharger le PDF</span>
                </button>
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Partager ce document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
