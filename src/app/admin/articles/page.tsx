"use client";

import { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  FileText, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Tag,
  ChevronDown,
  MoreHorizontal
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: 'actualites' | 'guides-pratiques' | 'boite-outils';
  author: string;
  publishDate: string;
  status: 'published' | 'draft' | 'review';
  views: number;
  comments: number;
  featured: boolean;
  excerpt: string;
  tags: string[];
}

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Données d'exemple
  const articles: Article[] = [
    {
      id: '1',
      title: 'Les nouvelles menaces de cybersécurité en 2024',
      category: 'actualites',
      author: 'Marie Dubois',
      publishDate: '2024-01-15',
      status: 'published',
      views: 1250,
      comments: 8,
      featured: true,
      excerpt: 'Découvrez les principales menaces cybersécuritaires qui émergent cette année et comment s\'en protéger.',
      tags: ['cybersécurité', 'menaces', '2024']
    },
    {
      id: '2',
      title: 'Guide complet : Sécuriser son réseau Wi-Fi',
      category: 'guides-pratiques',
      author: 'Jean Martin',
      publishDate: '2024-01-12',
      status: 'published',
      views: 890,
      comments: 12,
      featured: false,
      excerpt: 'Un guide étape par étape pour sécuriser efficacement votre réseau Wi-Fi domestique ou professionnel.',
      tags: ['wifi', 'réseau', 'sécurité']
    },
    {
      id: '3',
      title: 'Outils gratuits pour tester la sécurité de votre site web',
      category: 'boite-outils',
      author: 'Sophie Laurent',
      publishDate: '2024-01-10',
      status: 'published',
      views: 654,
      comments: 5,
      featured: false,
      excerpt: 'Une sélection d\'outils gratuits et efficaces pour évaluer la sécurité de votre site web.',
      tags: ['outils', 'test', 'sécurité web']
    },
    {
      id: '4',
      title: 'Comment détecter et éviter les attaques de phishing',
      category: 'guides-pratiques',
      author: 'Pierre Durand',
      publishDate: '2024-01-08',
      status: 'review',
      views: 0,
      comments: 0,
      featured: false,
      excerpt: 'Apprenez à identifier les signes d\'une tentative de phishing et les bonnes pratiques pour vous protéger.',
      tags: ['phishing', 'email', 'sécurité']
    },
    {
      id: '5',
      title: 'Nouvelle réglementation RGPD : ce qui change en 2024',
      category: 'actualites',
      author: 'Anne Moreau',
      publishDate: '2024-01-05',
      status: 'draft',
      views: 0,
      comments: 0,
      featured: false,
      excerpt: 'Les dernières mises à jour du RGPD et leur impact sur les entreprises.',
      tags: ['RGPD', 'réglementation', 'conformité']
    }
  ];

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'actualites': return 'Actualités';
      case 'guides-pratiques': return 'Guides Pratiques';
      case 'boite-outils': return 'Boîte à Outils';
      default: return category;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Publié</span>;
      case 'draft':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Brouillon</span>;
      case 'review':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">En révision</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 pt-20 lg:pt-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 lg:px-6">
            <div className="pl-16 lg:pl-0">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Articles</h1>
                  <p className="text-gray-600 mt-1">Gérer tous les articles de la plateforme</p>
                </div>
                
                <Link
                  href="/admin/articles/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nouvel Article</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un article..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="actualites">Actualités</option>
                  <option value="guides-pratiques">Guides Pratiques</option>
                  <option value="boite-outils">Boîte à Outils</option>
                </select>
              </div>
              
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                  <option value="review">En révision</option>
                </select>
              </div>
            </div>
          </div>

          {/* Articles Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Publiés</p>
                  <p className="text-2xl font-bold text-green-600">{articles.filter(a => a.status === 'published').length}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En révision</p>
                  <p className="text-2xl font-bold text-yellow-600">{articles.filter(a => a.status === 'review').length}</p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Brouillons</p>
                  <p className="text-2xl font-bold text-gray-600">{articles.filter(a => a.status === 'draft').length}</p>
                </div>
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Articles ({filteredArticles.length})
              </h3>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Article</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vues</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-start space-x-3">
                            {article.featured && (
                              <div className="flex-shrink-0">
                                <div className="h-2 w-2 bg-yellow-400 rounded-full mt-2"></div>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {article.title}
                              </p>
                              <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                {article.excerpt}
                              </p>
                              {article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {article.tags.slice(0, 2).map((tag, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {article.tags.length > 2 && (
                                    <span className="text-xs text-gray-500">+{article.tags.length - 2}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {getCategoryLabel(article.category)}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="ml-2 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{article.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {new Date(article.publishDate).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {getStatusBadge(article.status)}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="space-y-1">
                            <div>{article.views} vues</div>
                            <div>{article.comments} comm.</div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-1">
                            <button className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <div key={article.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {article.featured && (
                            <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                          )}
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {article.title}
                          </h4>
                        </div>
                        
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {getCategoryLabel(article.category)}
                          </span>
                          {getStatusBadge(article.status)}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {article.author}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(article.publishDate).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="text-right">
                            <div>{article.views} vues</div>
                            <div>{article.comments} comm.</div>
                          </div>
                        </div>
                        
                        {article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {article.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                            {article.tags.length > 3 && (
                              <span className="text-xs text-gray-500">+{article.tags.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-4">
                        <button className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                    ? 'Aucun article ne correspond à vos critères de recherche.'
                    : 'Commencez par créer votre premier article.'}
                </p>
                <Link
                  href="/admin/articles/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un article
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
