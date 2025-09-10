'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, X, Eye, Calendar, Clock, Image, Video, Type, List, 
  Quote, Code, Link2, Upload, Trash2, Plus, Settings,
  ChevronDown, Tag, User, Globe, Camera, AlignLeft,
  AlignCenter, Bold, Italic, Underline, RotateCcw,
  RotateCw, Maximize, Minimize, BookOpen
} from 'lucide-react';
import { useSession } from './SessionProvider';

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
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-b">
      {blockTypes.map((block) => (
        <button
          key={block.type}
          onClick={() => onAddBlock(block.type)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
            selectedBlockType === block.type 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
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
    <div className="group relative p-4 border rounded-lg hover:border-blue-300 transition-colors">
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete(block.id)}
          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <X size={14} />
        </button>
      </div>
      
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        placeholder="Tapez votre texte ici..."
        className="w-full border-none resize-none focus:outline-none text-gray-800"
        style={{ minHeight: '60px' }}
      />
      
      <div className="flex items-center mt-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 text-gray-500 hover:text-gray-700"><Bold size={16} /></button>
        <button className="p-1 text-gray-500 hover:text-gray-700"><Italic size={16} /></button>
        <button className="p-1 text-gray-500 hover:text-gray-700"><Underline size={16} /></button>
        <div className="border-l pl-2 ml-2">
          <button className="p-1 text-gray-500 hover:text-gray-700"><AlignLeft size={16} /></button>
          <button className="p-1 text-gray-500 hover:text-gray-700"><AlignCenter size={16} /></button>
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
          onChange={(e) => setLevel(e.target.value)}
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

// Composant bloc image
const ImageBlock = ({ block, onUpdate, onDelete }: {
  block: Block;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}) => {
  const [imageUrl, setImageUrl] = useState(block.content.url || '');
  const [caption, setCaption] = useState(block.content.caption || '');
  const [alt, setAlt] = useState(block.content.alt || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      onUpdate(block.id, { ...block.content, url, file, alt, caption });
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
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
        >
          <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Cliquez pour ajouter une image</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
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
export default function GutenbergArticleEditor() {
  const { user } = useSession();
  
  const [article, setArticle] = useState<Article>({
    title: '',
    subtitle: '',
    excerpt: '',
    category: 'actualites',
    tags: [],
    author: user?.firstName + ' ' + user?.lastName || 'Admin',
    publishDate: new Date().toISOString().split('T')[0],
    publishTime: '09:00',
    status: 'draft',
    featured: false,
    allowComments: true,
    featuredImage: null,
    blocks: [],
    seoTitle: '',
    seoDescription: ''
  });

  const [selectedBlockType, setSelectedBlockType] = useState('paragraph');
  const [newTag, setNewTag] = useState('');
  const [showMetadata, setShowMetadata] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    { value: 'actualites', label: 'Actualités' },
    { value: 'guides-pratiques', label: 'Guides Pratiques' },
    { value: 'boite-outils', label: 'Boîte à Outils' },
    { value: 'analyse', label: 'Analyse' },
    { value: 'formation', label: 'Formation' }
  ];

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
  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArticle(prev => ({ ...prev, featuredImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Fonction pour sauvegarder l'article
  const saveArticle = async (statusOverride?: string) => {
    setIsSaving(true);
    try {
      // Validation des champs requis
      if (!article.title.trim()) {
        alert('Le titre de l\'article est requis');
        setIsSaving(false);
        return false;
      }
      
      if (!article.excerpt.trim()) {
        alert('Le résumé de l\'article est requis');
        setIsSaving(false);
        return false;
      }

      if (article.blocks.length === 0) {
        alert('L\'article doit contenir au moins un bloc de contenu');
        setIsSaving(false);
        return false;
      }

      // Préparer les données à envoyer
      const articleData = {
        ...article,
        status: statusOverride || article.status
      };

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(articleData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Article sauvegardé avec succès !');
        // Optionnel: rediriger vers la liste des articles
        // window.location.href = '/admin/articles';
        return true;
      } else {
        throw new Error(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert(`Erreur lors de la sauvegarde de l'article: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour publier l'article
  const publishArticle = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const success = await saveArticle('published');
    if (success) {
      alert('Article publié avec succès !');
    }
  };

  // Fonction pour planifier l'article
  const scheduleArticle = () => {
    const scheduledDate = new Date(`${article.publishDate}T${article.publishTime}`);
    if (scheduledDate > new Date()) {
      setArticle(prev => ({ ...prev, status: 'scheduled' }));
      saveArticle();
      alert(`Article planifié pour le ${scheduledDate.toLocaleString('fr-FR')}`);
    } else {
      alert('La date de publication doit être dans le futur');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre d'actions */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">
                {article.title || 'Nouvel article'}
              </h1>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                article.status === 'published' ? 'bg-green-100 text-green-800' :
                article.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {article.status === 'published' ? 'Publié' :
                 article.status === 'scheduled' ? 'Planifié' : 'Brouillon'}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowScheduler(!showScheduler)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Calendar size={16} />
                <span>Planifier</span>
              </button>
              
              <button
                onClick={() => saveArticle()}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </button>

              <button
                onClick={publishArticle}
                className="flex items-center space-x-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Globe size={16} />
                <span>Publier</span>
              </button>

              <button
                onClick={() => setShowMetadata(!showMetadata)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Zone de contenu principal */}
          <div className="col-span-12 lg:col-span-8">
            {/* Métadonnées de l'article */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="p-6">
                <div className="space-y-4">
                  <input
                    type="text"
                    value={article.title}
                    onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre de l'article..."
                    className="w-full text-3xl font-bold text-gray-900 border-none focus:outline-none"
                  />
                  
                  <input
                    type="text"
                    value={article.subtitle}
                    onChange={(e) => setArticle(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Sous-titre (optionnel)..."
                    className="w-full text-xl text-gray-600 border-none focus:outline-none"
                  />

                  <textarea
                    value={article.excerpt}
                    onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Résumé de l'article..."
                    className="w-full text-gray-700 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Image à la une */}
            {!imagePreview ? (
              <div className="bg-white rounded-lg shadow-sm border mb-6">
                <div className="p-6">
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 mb-2">Ajouter une image à la une</p>
                      <p className="text-sm text-gray-400">JPG, PNG ou WebP (max. 5MB)</p>
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
              <div className="bg-white rounded-lg shadow-sm border mb-6 relative group">
                <img src={imagePreview} alt="Image à la une" className="w-full h-64 object-cover rounded-t-lg" />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setArticle(prev => ({ ...prev, featuredImage: null }));
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
                <div className="p-4">
                  <p className="text-sm text-gray-600">Image à la une</p>
                </div>
              </div>
            )}

            {/* Barre d'outils pour les blocs */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <BlockToolbar 
                onAddBlock={addBlock}
                selectedBlockType={selectedBlockType}
                setSelectedBlockType={setSelectedBlockType}
              />
            </div>

            {/* Zone d'édition des blocs */}
            <div className="space-y-4">
              {article.blocks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Commencez à écrire</h3>
                  <p className="text-gray-500 mb-4">Utilisez la barre d'outils ci-dessus pour ajouter du contenu</p>
                  <button
                    onClick={() => addBlock('paragraph')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Ajouter un bloc</span>
                </button>
              </div>
            )}
          </div>

          {/* Panneau latéral */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Planification */}
            {showScheduler && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Planification</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de publication
                    </label>
                    <input
                      type="date"
                      value={article.publishDate}
                      onChange={(e) => setArticle(prev => ({ ...prev, publishDate: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure
                    </label>
                    <input
                      type="time"
                      value={article.publishTime}
                      onChange={(e) => setArticle(prev => ({ ...prev, publishTime: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={scheduleArticle}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Planifier la publication
                  </button>
                </div>
              </div>
            )}

            {/* Catégories et tags */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organisation</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={article.category}
                    onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nouveau tag..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <button
                      onClick={addTag}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-500 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Options</h3>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={article.featured}
                    onChange={(e) => setArticle(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Article à la une</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={article.allowComments}
                    onChange={(e) => setArticle(prev => ({ ...prev, allowComments: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Autoriser les commentaires</span>
                </label>
              </div>
            </div>

            {/* SEO */}
            {showMetadata && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre SEO
                    </label>
                    <input
                      type="text"
                      value={article.seoTitle}
                      onChange={(e) => setArticle(prev => ({ ...prev, seoTitle: e.target.value }))}
                      placeholder="Titre pour les moteurs de recherche..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {article.seoTitle.length}/60 caractères
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description SEO
                    </label>
                    <textarea
                      value={article.seoDescription}
                      onChange={(e) => setArticle(prev => ({ ...prev, seoDescription: e.target.value }))}
                      placeholder="Description pour les moteurs de recherche..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">
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
  );
}
