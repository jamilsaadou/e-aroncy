"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { useRequireRole } from '@/components/SessionProvider';
import { 
  Save, X, Eye, Calendar, Clock, Image, Video, Type, List, 
  Quote, Code, Link2, Upload, Trash2, Plus, Settings,
  ChevronDown, Tag, User, Globe, Camera, AlignLeft,
  AlignCenter, Bold, Italic, Underline, RotateCcw,
  RotateCw, Maximize, Minimize, BookOpen, ArrowLeft,
  Loader, Check, AlertCircle, FileText, Sparkles
} from 'lucide-react';

// Types
interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'video' | 'quote' | 'code' | 'list' | 'embed';
  content: any;
  settings?: {
    alignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large';
    style?: string;
  };
}

interface Article {
  id?: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishDate: string;
  publishTime: string;
  status: 'draft' | 'scheduled' | 'published';
  featured: boolean;
  allowComments: boolean;
  featuredImage: File | null;
  featuredImageUrl?: string;
  blocks: Block[];
  seoTitle: string;
  seoDescription: string;
}

// Composants d'outils d'édition
const BlockToolbar = ({ onAddBlock, selectedBlockType, setSelectedBlockType }: {
  onAddBlock: (type: string) => void;
  selectedBlockType: string;
  setSelectedBlockType: (type: string) => void;
}) => {
  const blockTypes = [
    { type: 'paragraph', icon: Type, label: 'Paragraphe' },
    { type: 'heading', icon: Type, label: 'Titre' },
    { type: 'image', icon: Image, label: 'Image' },
    { type: 'video', icon: Video, label: 'Vidéo' },
    { type: 'quote', icon: Quote, label: 'Citation' },
    { type: 'code', icon: Code, label: 'Code' },
    { type: 'list', icon: List, label: 'Liste' },
    { type: 'embed', icon: Link2, label: 'Intégration' },
  ];

  return (
    <div className="flex flex-wrap gap-3 p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
      <div className="flex items-center space-x-2 mb-2 w-full">
        <FileText className="h-5 w-5 text-aroncy-blue" />
        <h3 className="font-display font-semibold text-slate-800">Outils d'édition</h3>
      </div>
      {blockTypes.map((block) => (
        <button
          key={block.type}
          onClick={() => onAddBlock(block.type)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200 font-medium ${
            selectedBlockType === block.type 
              ? 'bg-aroncy-gradient text-white border-transparent shadow-lg' 
              : 'bg-white text-slate-700 border-slate-200 hover:border-aroncy-blue hover:bg-aroncy-blue hover:bg-opacity-5 hover:text-aroncy-blue'
          }`}
        >
          <block.icon size={16} />
          <span className="text-sm">{block.label}</span>
        </button>
      ))}
    </div>
  );
};

// Composant bloc paragraphe
const ParagraphBlock = ({ block, onUpdate, onDelete }: {
  block: Block;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}) => {
  const [content, setContent] = useState(block.content.text || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onUpdate(block.id, { ...block.content, text: e.target.value });
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onDelete(block.id)}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all"
        >
          <X size={16} />
        </button>
      </div>
      
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        placeholder="Tapez votre texte ici..."
        className="w-full border-none resize-none focus:outline-none text-slate-800 placeholder-slate-400 leading-relaxed"
        style={{ minHeight: '80px' }}
      />
      
      <div className="flex items-center mt-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Bold size={16} /></button>
        <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Italic size={16} /></button>
        <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Underline size={16} /></button>
        <div className="border-l border-slate-300 pl-2 ml-2">
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><AlignLeft size={16} /></button>
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><AlignCenter size={16} /></button>
        </div>
      </div>
    </div>
  );
};

// Composant bloc titre
const HeadingBlock = ({ block, onUpdate, onDelete }: {
  block: Block;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}) => {
  const [content, setContent] = useState(block.content.text || '');
  const [level, setLevel] = useState(block.content.level || 'h2');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    onUpdate(block.id, { ...block.content, text: e.target.value, level });
  };

  const headingClasses = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-semibold',
    h5: 'text-lg font-medium',
    h6: 'text-base font-medium'
  };

  return (
    <div className="group relative p-4 border rounded-lg hover:border-blue-300 transition-colors">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete(block.id)}
          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-2">
        <select 
          value={level} 
          onChange={(e) => {
            setLevel(e.target.value);
            onUpdate(block.id, { ...block.content, text: content, level: e.target.value });
          }}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="h1">Titre 1</option>
          <option value="h2">Titre 2</option>
          <option value="h3">Titre 3</option>
          <option value="h4">Titre 4</option>
          <option value="h5">Titre 5</option>
          <option value="h6">Titre 6</option>
        </select>
      </div>

      <input
        type="text"
        value={content}
        onChange={handleChange}
        placeholder="Votre titre ici..."
        className={`w-full border-none focus:outline-none text-gray-800 bg-transparent ${headingClasses[level as keyof typeof headingClasses]}`}
      />
    </div>
  );
};

// Composant bloc image avec upload
const ImageBlock = ({ block, onUpdate, onDelete, onUploadImage }: {
  block: Block;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
  onUploadImage: (file: File) => Promise<{ url: string; id: string }>;
}) => {
  const [imageUrl, setImageUrl] = useState(block.content.url || '');
  const [caption, setCaption] = useState(block.content.caption || '');
  const [alt, setAlt] = useState(block.content.alt || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const uploadedImage = await onUploadImage(file);
        setImageUrl(uploadedImage.url);
        onUpdate(block.id, { 
          ...block.content, 
          url: uploadedImage.url, 
          file, 
          alt, 
          caption,
          mediaId: uploadedImage.id
        });
      } catch (error) {
        console.error('Erreur upload image:', error);
        alert('Erreur lors de l\'upload de l\'image');
      }
      setUploading(false);
    }
  };

  return (
    <div className="group relative p-4 border rounded-lg hover:border-blue-300 transition-colors">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onDelete(block.id)}
          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <X size={14} />
        </button>
      </div>

      {!imageUrl ? (
        <div 
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors ${uploading ? 'opacity-50' : ''}`}
        >
          {uploading ? (
            <Loader className="mx-auto h-12 w-12 text-blue-500 mb-4 animate-spin" />
          ) : (
            <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          )}
          <p className="text-gray-500">
            {uploading ? 'Upload en cours...' : 'Cliquez pour ajouter une image'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </div>
      ) : (
        <div>
          <div className="relative">
            <img 
              src={imageUrl} 
              alt={alt}
              className="w-full rounded-lg"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-2 left-2 p-2 bg-black bg-opacity-50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Upload size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                onUpdate(block.id, { ...block.content, caption: e.target.value });
              }}
              placeholder="Légende de l'image..."
              className="w-full text-sm text-gray-600 border-none focus:outline-none"
            />
            <input
              type="text"
              value={alt}
              onChange={(e) => {
                setAlt(e.target.value);
                onUpdate(block.id, { ...block.content, alt: e.target.value });
              }}
              placeholder="Texte alternatif (SEO)..."
              className="w-full text-xs text-gray-500 border-none focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Composant bloc citation
const QuoteBlock = ({ block, onUpdate, onDelete }: {
  block: Block;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}) => {
  const [quote, setQuote] = useState(block.content.quote || '');
  const [author, setAuthor] = useState(block.content.author || '');

  return (
    <div className="group relative p-4 border rounded-lg hover:border-blue-300 transition-colors">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete(block.id)}
          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <X size={14} />
        </button>
      </div>

      <div className="border-l-4 border-blue-500 pl-4">
        <textarea
          value={quote}
          onChange={(e) => {
            setQuote(e.target.value);
            onUpdate(block.id, { ...block.content, quote: e.target.value });
          }}
          placeholder="Votre citation..."
          className="w-full text-xl italic text-gray-700 border-none resize-none focus:outline-none"
          style={{ minHeight: '80px' }}
        />
        <input
          type="text"
          value={author}
          onChange={(e) => {
            setAuthor(e.target.value);
            onUpdate(block.id, { ...block.content, author: e.target.value });
          }}
          placeholder="Auteur de la citation"
          className="w-full mt-2 text-sm text-gray-500 border-none focus:outline-none"
        />
      </div>
    </div>
  );
};

// Composant bloc code
const CodeBlock = ({ block, onUpdate, onDelete }: {
  block: Block;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}) => {
  const [code, setCode] = useState(block.content.code || '');
  const [language, setLanguage] = useState(block.content.language || 'javascript');

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'php', 'css', 'html', 'sql', 'bash'
  ];

  return (
    <div className="group relative p-4 border rounded-lg hover:border-blue-300 transition-colors">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete(block.id)}
          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <X size={14} />
        </button>
      </div>

      <div className="mb-2">
        <select 
          value={language} 
          onChange={(e) => {
            setLanguage(e.target.value);
            onUpdate(block.id, { ...block.content, language: e.target.value });
          }}
          className="text-sm border rounded px-2 py-1"
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <textarea
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          onUpdate(block.id, { ...block.content, code: e.target.value });
        }}
        placeholder="Votre code ici..."
        className="w-full font-mono text-sm bg-gray-900 text-green-400 p-4 rounded border-none resize-none focus:outline-none"
        style={{ minHeight: '120px' }}
      />
    </div>
  );
};

// Composant principal d'édition
export default function NewArticle() {
  // Protection de la route
  const { hasRole } = useRequireRole(['ADMIN'], '/dashboard');
  
  const [article, setArticle] = useState<Article>({
    title: '',
    subtitle: '',
    excerpt: '',
    category: 'actualites',
    tags: [],
    author: 'Admin',
    publishDate: new Date().toISOString().split('T')[0],
    publishTime: '09:00',
    status: 'draft',
    featured: false,
    allowComments: true,
    featuredImage: null,
    featuredImageUrl: '',
    blocks: [],
    seoTitle: '',
    seoDescription: ''
  });

  const [selectedBlockType, setSelectedBlockType] = useState('paragraph');
  const [newTag, setNewTag] = useState('');
  const [showMetadata, setShowMetadata] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'actualites', label: 'Actualités' },
    { value: 'guides-pratiques', label: 'Guides Pratiques' },
    { value: 'boite-outils', label: 'Boîte à Outils' },
    { value: 'analyse', label: 'Analyse' },
    { value: 'formation', label: 'Formation' }
  ];

  // Auto-save toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      if (article.title && article.blocks.length > 0) {
        saveArticle(true); // true = autosave
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [article]);

  // Fonctions API
  const uploadImage = async (file: File): Promise<{ url: string; id: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/articles/media/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Erreur upload');
    }

    const result = await response.json();
    return result.data.media;
  };

  const saveArticle = async (isAutosave = false) => {
    if (!isAutosave) setSaving(true);
    
    try {
      const articleData = {
        ...article,
        contentBlocks: article.blocks,
        seoKeywords: article.tags
      };

      // Pour les mises à jour, inclure l'ID dans le body
      if (article.id) {
        articleData.id = article.id;
      }

      const response = await fetch('/api/articles', {
        method: article.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(articleData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur sauvegarde');
      }

      const result = await response.json();
      
      if (!article.id && result.data?.article?.id) {
        setArticle(prev => ({ ...prev, id: result.data.article.id }));
      }

      setSaveStatus(isAutosave ? '💾 Sauvegardé automatiquement' : '✅ Article sauvegardé');
      setTimeout(() => setSaveStatus(''), 3000);

    } catch (error: any) {
      console.error('Erreur sauvegarde:', error);
      setSaveStatus(`❌ ${error.message || 'Erreur de sauvegarde'}`);
      setTimeout(() => setSaveStatus(''), 5000);
    }
    
    if (!isAutosave) setSaving(false);
  };

  const publishArticle = async () => {
    if (!article.id) {
      await saveArticle();
    }

    try {
      const response = await fetch(`/api/articles/${article.id}/publish`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur publication');
      }

      setArticle(prev => ({ ...prev, status: 'published' }));
      alert('Article publié avec succès !');
      
    } catch (error) {
      console.error('Erreur publication:', error);
      alert('Erreur lors de la publication');
    }
  };

  const scheduleArticle = async () => {
    const scheduledDate = new Date(`${article.publishDate}T${article.publishTime}`);
    
    if (scheduledDate <= new Date()) {
      alert('La date de publication doit être dans le futur');
      return;
    }

    if (!article.id) {
      await saveArticle();
    }

    try {
      const response = await fetch(`/api/articles/${article.id}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ scheduledFor: scheduledDate.toISOString() })
      });

      if (!response.ok) {
        throw new Error('Erreur planification');
      }

      setArticle(prev => ({ ...prev, status: 'scheduled' }));
      alert(`Article planifié pour le ${scheduledDate.toLocaleString('fr-FR')}`);
      
    } catch (error) {
      console.error('Erreur planification:', error);
      alert('Erreur lors de la planification');
    }
  };

  // Fonction pour ajouter un nouveau bloc
  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type: type as Block['type'],
      content: type === 'paragraph' ? { text: '' } :
               type === 'heading' ? { text: '', level: 'h2' } :
               type === 'image' ? { url: '', caption: '', alt: '' } :
               type === 'quote' ? { quote: '', author: '' } :
               type === 'code' ? { code: '', language: 'javascript' } :
               type === 'list' ? { items: [''], style: 'bullet' } :
               type === 'video' ? { url: '', caption: '' } :
               type === 'embed' ? { url: '', type: 'youtube' } : {}
    };

    setArticle(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  // Fonction pour mettre à jour un bloc
  const updateBlock = (blockId: string, content: any) => {
    setArticle(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId ? { ...block, content } : block
      )
    }));
  };

  // Fonction pour supprimer un bloc
  const deleteBlock = (blockId: string) => {
    setArticle(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId)
    }));
  };

  // Fonction pour ajouter un tag
  const addTag = () => {
    if (newTag.trim() && !article.tags.includes(newTag.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Fonction pour supprimer un tag
  const removeTag = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Fonction pour gérer l'upload de l'image à la une
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadedImage = await uploadImage(file);
        setArticle(prev => ({ 
          ...prev, 
          featuredImage: file,
          featuredImageUrl: uploadedImage.url
        }));
        setImagePreview(uploadedImage.url);
      } catch (error) {
        console.error('Erreur upload image à la une:', error);
        alert('Erreur lors de l\'upload de l\'image');
      }
    }
  };

  // Rendu des blocs selon leur type
  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <ParagraphBlock 
            key={block.id}
            block={block}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
          />
        );
      case 'heading':
        return (
          <HeadingBlock 
            key={block.id}
            block={block}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
          />
        );
      case 'image':
        return (
          <ImageBlock 
            key={block.id}
            block={block}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
            onUploadImage={uploadImage}
          />
        );
      case 'quote':
        return (
          <QuoteBlock 
            key={block.id}
            block={block}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
          />
        );
      case 'code':
        return (
          <CodeBlock 
            key={block.id}
            block={block}
            onUpdate={updateBlock}
            onDelete={deleteBlock}
          />
        );
      default:
        return null;
    }
  };

  if (!hasRole) {
    return null; // Redirection gérée par useRequireRole
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 lg:flex font-body">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col lg:ml-0 pt-20 lg:pt-0">
        {/* Header avec design E-ARONCY */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-6 py-4 lg:px-6">
            <div className="pl-16 lg:pl-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/admin/articles"
                    className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <ArrowLeft size={20} />
                    <span className="hidden sm:inline font-medium">Articles</span>
                  </Link>
                  
                  <div className="border-l border-slate-300 pl-4">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {article.title || 'Nouvel article'}
                    </h1>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        article.status === 'published' ? 'bg-green-100 text-green-700' :
                        article.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {article.status === 'published' ? '✓ Publié' :
                         article.status === 'scheduled' ? '⏰ Planifié' : '📝 Brouillon'}
                      </span>
                      
                      {saveStatus && (
                        <span className="text-sm text-slate-600 flex items-center">
                          {saveStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowScheduler(!showScheduler)}
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 text-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg hover:shadow-md transition-all border border-slate-200"
                  >
                    <Calendar size={16} />
                    <span>Planifier</span>
                  </button>
                  
                  <button
                    onClick={() => saveArticle()}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-700 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-all border border-blue-100 disabled:opacity-50"
                  >
                    {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                    <span className="hidden sm:inline">Sauvegarder</span>
                  </button>

                  <button
                    onClick={publishArticle}
                    className="flex items-center space-x-2 px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:shadow-lg transition-all"
                  >
                    <Globe size={16} />
                    <span className="hidden sm:inline">Publier</span>
                  </button>

                  <button
                    onClick={() => setShowMetadata(!showMetadata)}
                    className="p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-100"
                  >
                    <Settings size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Zone de contenu principal */}
            <div className="col-span-12 lg:col-span-8">
              {/* Métadonnées de l'article */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 hover:shadow-xl transition-all duration-300">
                <div className="p-8">
                  <div className="space-y-6">
                    <input
                      type="text"
                      value={article.title}
                      onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Titre de l'article..."
                      className="w-full text-3xl lg:text-4xl font-bold text-slate-900 border-none focus:outline-none placeholder-slate-400"
                    />
                    
                    <input
                      type="text"
                      value={article.subtitle}
                      onChange={(e) => setArticle(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Sous-titre (optionnel)..."
                      className="w-full text-xl text-slate-600 border-none focus:outline-none placeholder-slate-400"
                    />

                    <textarea
                      value={article.excerpt}
                      onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Résumé de l'article..."
                      className="w-full text-slate-700 border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Image à la une */}
              {!imagePreview && !article.featuredImageUrl ? (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 hover:shadow-xl transition-all duration-300">
                  <div className="p-8">
                    <label className="block">
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
                        <Camera className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                        <p className="text-slate-600 mb-2 font-medium">Ajouter une image à la une</p>
                        <p className="text-sm text-slate-500">JPG, PNG ou WebP (max. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFeaturedImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 relative group hover:shadow-xl transition-all duration-300">
                  <img 
                    src={imagePreview || article.featuredImageUrl} 
                    alt="Image à la une" 
                    className="w-full h-64 object-cover rounded-t-2xl" 
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setArticle(prev => ({ ...prev, featuredImage: null, featuredImageUrl: '' }));
                    }}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                  <div className="p-6">
                    <p className="text-sm text-slate-600 font-medium">Image à la une</p>
                  </div>
                </div>
              )}

              {/* Barre d'outils pour les blocs */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 hover:shadow-xl transition-all duration-300">
                <BlockToolbar 
                  onAddBlock={addBlock}
                  selectedBlockType={selectedBlockType}
                  setSelectedBlockType={setSelectedBlockType}
                />
              </div>

              {/* Zone d'édition des blocs */}
              <div className="space-y-4">
                {article.blocks.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center hover:shadow-xl transition-all duration-300">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Commencez à écrire votre article</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
                      Utilisez la barre d'outils ci-dessus pour ajouter du contenu riche : 
                      paragraphes, titres, images, citations et plus encore.
                    </p>
                    <button
                      onClick={() => addBlock('paragraph')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                    >
                      Ajouter un paragraphe
                    </button>
                  </div>
                ) : (
                  article.blocks.map(renderBlock)
                )}
              </div>

              {/* Bouton d'ajout rapide */}
              {article.blocks.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => addBlock('paragraph')}
                    className="w-full p-6 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <Plus size={24} />
                    <span className="font-medium">Ajouter un nouveau bloc</span>
                  </button>
                </div>
              )}
            </div>

            {/* Panneau latéral */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Planification */}
              {showScheduler && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    Planification
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date de publication
                      </label>
                      <input
                        type="date"
                        value={article.publishDate}
                        onChange={(e) => setArticle(prev => ({ ...prev, publishDate: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Heure
                      </label>
                      <input
                        type="time"
                        value={article.publishTime}
                        onChange={(e) => setArticle(prev => ({ ...prev, publishTime: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={scheduleArticle}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                    >
                      Planifier la publication
                    </button>
                  </div>
                </div>
              )}

              {/* Catégories et tags */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Tag className="h-5 w-5 text-green-600 mr-2" />
                  Organisation
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={article.category}
                      onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tags
                    </label>
                    <div className="flex space-x-2 mb-3">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Nouveau tag..."
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <button
                        onClick={addTag}
                        className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-md transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 rounded-full text-sm border border-slate-200"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-slate-500 hover:text-red-500 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Settings className="h-5 w-5 text-purple-600 mr-2" />
                  Options
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={article.featured}
                      onChange={(e) => setArticle(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-slate-700 font-medium">Article à la une</span>
                  </label>

                  <label className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={article.allowComments}
                      onChange={(e) => setArticle(prev => ({ ...prev, allowComments: e.target.checked }))}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-slate-700 font-medium">Autoriser les commentaires</span>
                  </label>
                </div>
              </div>

              {/* SEO */}
              {showMetadata && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <Globe className="h-5 w-5 text-orange-600 mr-2" />
                    SEO
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Titre SEO
                      </label>
                      <input
                        type="text"
                        value={article.seoTitle}
                        onChange={(e) => setArticle(prev => ({ ...prev, seoTitle: e.target.value }))}
                        placeholder="Titre pour les moteurs de recherche..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {article.seoTitle.length}/60 caractères
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description SEO
                      </label>
                      <textarea
                        value={article.seoDescription}
                        onChange={(e) => setArticle(prev => ({ ...prev, seoDescription: e.target.value }))}
                        placeholder="Description pour les moteurs de recherche..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {article.seoDescription.length}/160 caractères
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
