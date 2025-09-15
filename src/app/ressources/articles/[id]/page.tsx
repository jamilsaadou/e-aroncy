'use client';

import React from 'react';
import Link from "next/link";
import Header from '@/components/Header';
import { Shield, Calendar, User, Clock, ChevronRight, FileText, TrendingUp, AlertCircle, Zap, Globe, Users, Eye, Heart, Share2 } from "lucide-react";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  publishDate: string;
  readTime: string;
  featured: boolean;
  featuredImage?: string;
  color: string;
  views: number;
  likes: number;
  blocks: any[];
  allowComments: boolean;
}

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string);
    }
  }, [params.id]);

  const fetchArticle = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/articles/public/${id}`);
      const data = await response.json();

      if (data.success) {
        setArticle(data.article);
      } else {
        setError('Article non trouvé');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-800",
      green: "bg-green-50 border-green-200 text-green-800",
      purple: "bg-purple-50 border-purple-200 text-purple-800",
      orange: "bg-orange-50 border-orange-200 text-orange-800",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-800",
      red: "bg-red-50 border-red-200 text-red-800"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'analyse': <AlertCircle className="h-5 w-5" />,
      'actualites': <FileText className="h-5 w-5" />,
      'guides-pratiques': <Shield className="h-5 w-5" />,
      'formation': <Users className="h-5 w-5" />,
      'boite-outils': <Zap className="h-5 w-5" />,
      'juridique': <Globe className="h-5 w-5" />,
      'innovation': <Zap className="h-5 w-5" />,
      'cas-etude': <TrendingUp className="h-5 w-5" />
    };
    return iconMap[category] || <FileText className="h-5 w-5" />;
  };

  const renderBlock = (block: any, index: number) => {
    // Gérer les blocs de l'éditeur Gutenberg
    if (block.content) {
      switch (block.type) {
        case 'heading':
          const level = block.content.level || 'h2';
          const text = block.content.text || '';
          const headingClasses = {
            h1: 'text-4xl font-bold text-slate-900 mb-6',
            h2: 'text-3xl font-bold text-slate-900 mb-5',
            h3: 'text-2xl font-semibold text-slate-900 mb-4',
            h4: 'text-xl font-semibold text-slate-900 mb-3',
            h5: 'text-lg font-semibold text-slate-900 mb-3',
            h6: 'text-base font-semibold text-slate-900 mb-2'
          };
          const className = headingClasses[level as keyof typeof headingClasses] || headingClasses.h2;
          
          if (level === 'h1') {
            return <h1 key={index} className={className} dangerouslySetInnerHTML={{ __html: text }} />;
          } else if (level === 'h2') {
            return <h2 key={index} className={className} dangerouslySetInnerHTML={{ __html: text }} />;
          } else if (level === 'h3') {
            return <h3 key={index} className={className} dangerouslySetInnerHTML={{ __html: text }} />;
          } else if (level === 'h4') {
            return <h4 key={index} className={className} dangerouslySetInnerHTML={{ __html: text }} />;
          } else if (level === 'h5') {
            return <h5 key={index} className={className} dangerouslySetInnerHTML={{ __html: text }} />;
          } else {
            return <h6 key={index} className={className} dangerouslySetInnerHTML={{ __html: text }} />;
          }

        case 'paragraph':
          return (
            <p 
              key={index} 
              className="text-slate-700 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: block.content.text || '' }}
            />
          );

        case 'image':
          return (
            <figure key={index} className="mb-6">
              <img 
                src={block.content.url} 
                alt={block.content.alt || block.content.caption || ''} 
                className="w-full rounded-lg shadow-sm"
              />
              {block.content.caption && (
                <figcaption className="text-slate-500 text-sm mt-2 text-center">
                  {block.content.caption}
                </figcaption>
              )}
            </figure>
          );

        case 'quote':
          return (
            <blockquote key={index} className="border-l-4 border-green-500 pl-6 py-4 mb-6 bg-green-50 rounded-r-lg">
              <p className="text-slate-700 italic text-lg">
                {block.content.quote}
              </p>
              {block.content.author && (
                <cite className="text-slate-500 text-sm mt-2 block">
                  — {block.content.author}
                </cite>
              )}
            </blockquote>
          );

        case 'code':
          return (
            <pre key={index} className="bg-slate-900 text-green-400 p-4 rounded-lg mb-6 overflow-x-auto">
              <code>{block.content.code}</code>
            </pre>
          );

        case 'list':
          const ListTag = block.content.style === 'ordered' ? 'ol' : 'ul';
          const listClass = block.content.style === 'ordered' 
            ? 'list-decimal list-inside mb-6 space-y-2' 
            : 'list-disc list-inside mb-6 space-y-2';
          
          return (
            <ListTag key={index} className={listClass}>
              {(block.content.items || []).map((item: string, itemIndex: number) => (
                <li key={itemIndex} className="text-slate-700">
                  {item}
                </li>
              ))}
            </ListTag>
          );

        default:
          return null;
      }
    }

    // Gérer les anciens blocs (format Editor.js)
    switch (block.type) {
      case 'header':
        const level = block.data?.level || 2;
        const headerClasses = {
          1: 'text-4xl font-bold text-slate-900 mb-6',
          2: 'text-3xl font-bold text-slate-900 mb-5',
          3: 'text-2xl font-semibold text-slate-900 mb-4',
          4: 'text-xl font-semibold text-slate-900 mb-3',
          5: 'text-lg font-semibold text-slate-900 mb-3',
          6: 'text-base font-semibold text-slate-900 mb-2'
        };
        const className = headerClasses[level as keyof typeof headerClasses] || headerClasses[2];
        
        if (level === 1) {
          return <h1 key={index} className={className} dangerouslySetInnerHTML={{ __html: block.data?.text || '' }} />;
        } else if (level === 2) {
          return <h2 key={index} className={className} dangerouslySetInnerHTML={{ __html: block.data?.text || '' }} />;
        } else if (level === 3) {
          return <h3 key={index} className={className} dangerouslySetInnerHTML={{ __html: block.data?.text || '' }} />;
        } else if (level === 4) {
          return <h4 key={index} className={className} dangerouslySetInnerHTML={{ __html: block.data?.text || '' }} />;
        } else if (level === 5) {
          return <h5 key={index} className={className} dangerouslySetInnerHTML={{ __html: block.data?.text || '' }} />;
        } else {
          return <h6 key={index} className={className} dangerouslySetInnerHTML={{ __html: block.data?.text || '' }} />;
        }

      case 'paragraph':
        return (
          <p 
            key={index} 
            className="text-slate-700 leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: block.data?.text || '' }}
          />
        );

      case 'list':
        const ListTag = block.data?.style === 'ordered' ? 'ol' : 'ul';
        const listClass = block.data?.style === 'ordered' 
          ? 'list-decimal list-inside mb-6 space-y-2' 
          : 'list-disc list-inside mb-6 space-y-2';
        
        return (
          <ListTag key={index} className={listClass}>
            {(block.data?.items || []).map((item: string, itemIndex: number) => (
              <li 
                key={itemIndex} 
                className="text-slate-700"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            ))}
          </ListTag>
        );

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-green-500 pl-6 py-4 mb-6 bg-green-50 rounded-r-lg">
            <p 
              className="text-slate-700 italic text-lg"
              dangerouslySetInnerHTML={{ __html: block.data?.text || '' }}
            />
            {block.data?.caption && (
              <cite className="text-slate-500 text-sm mt-2 block">
                — {block.data.caption}
              </cite>
            )}
          </blockquote>
        );

      case 'code':
        return (
          <pre key={index} className="bg-slate-900 text-green-400 p-4 rounded-lg mb-6 overflow-x-auto">
            <code>{block.data?.code || ''}</code>
          </pre>
        );

      case 'delimiter':
        return (
          <div key={index} className="flex justify-center my-8">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            </div>
          </div>
        );

      case 'image':
        return (
          <figure key={index} className="mb-6">
            <img 
              src={block.url || block.data?.file?.url || block.data?.url} 
              alt={block.alt || block.data?.caption || block.caption || ''} 
              className="w-full rounded-lg shadow-sm"
            />
            {(block.caption || block.data?.caption) && (
              <figcaption className="text-slate-500 text-sm mt-2 text-center">
                {block.caption || block.data?.caption}
              </figcaption>
            )}
          </figure>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
            <Link 
              href="/ressources/articles"
              className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retour aux articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-blue-600">Accueil</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <Link href="/ressources" className="text-slate-500 hover:text-blue-600">Ressources</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <Link href="/ressources/articles" className="text-slate-500 hover:text-blue-600">Articles</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-medium truncate">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category and Featured Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getColorClasses(article.color)}`}>
                {getCategoryIcon(article.category)}
                <span className="ml-2">{article.category}</span>
              </div>
              {article.featured && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                  À la une
                </span>
              )}
            </div>
            
            {/* Share Button */}
            <button className="flex items-center text-slate-500 hover:text-slate-700 transition-colors">
              <Share2 className="h-5 w-5 mr-1" />
              <span className="text-sm">Partager</span>
            </button>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {article.title}
          </h1>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-xl text-slate-600 mb-6">
              {article.subtitle}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-8">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium text-slate-700">{article.author}</span>
              <span className="ml-1">• {article.authorRole}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{article.publishDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              <span>{article.views} vues</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag, index) => (
              <span key={index} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-8">
              <img 
                src={article.featuredImage} 
                alt={article.title}
                className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 lg:p-12">
            {/* Excerpt */}
            <div className="text-xl text-slate-600 leading-relaxed mb-8 pb-8 border-b border-slate-200">
              {article.excerpt}
            </div>

            {/* Content Blocks */}
            <div className="prose prose-lg max-w-none">
              {article.blocks && article.blocks.map((block, index) => renderBlock(block, index))}
            </div>
          </div>
        </div>
      </section>

      {/* Article Actions */}
      <section className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-slate-500 hover:text-red-600 transition-colors">
                <Heart className="h-5 w-5 mr-2" />
                <span>{article.likes} J'aime</span>
              </button>
              <button className="flex items-center text-slate-500 hover:text-blue-600 transition-colors">
                <Share2 className="h-5 w-5 mr-2" />
                <span>Partager</span>
              </button>
            </div>
            
            <Link 
              href="/ressources/articles"
              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Retour aux articles
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">E-ARONCY</span>
              </div>
              <p className="text-slate-400">
                Plateforme collaborative pour la cybersécurité en Afrique de l'Ouest
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/ressources/guides-pratiques" className="hover:text-white transition-colors">Guides pratiques</Link></li>
                <li><Link href="/ressources/infographies" className="hover:text-white transition-colors">Infographies</Link></li>
                <li><Link href="/ressources/articles" className="hover:text-white transition-colors">Articles</Link></li>
                <li><Link href="/ressources/boite-outils" className="hover:text-white transition-colors">Boîte à outils</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Formation</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/knowledge-base" className="hover:text-white transition-colors">Modules de formation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Certifications</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Webinaires</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 E-ARONCY. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
