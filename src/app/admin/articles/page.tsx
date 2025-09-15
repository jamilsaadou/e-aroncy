"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { useRequireRole } from "@/components/SessionProvider";
import { 
  FileText, 
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Tag,
  Globe,
  Clock,
  Star,
  MessageCircle,
  TrendingUp,
  Filter,
  Loader,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface ArticleData {
  id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  authorId: string;
  publishDate: string;
  publishTime: string;
  status: string;
  featured: boolean;
  allowComments: boolean;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface ArticlesResponse {
  success: boolean;
  articles: ArticleData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function ArticlesPage() {
  // Protection de la route
  const { hasRole } = useRequireRole(['ADMIN'], '/dashboard');
  
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const categories = [
    { value: 'actualites', label: 'Actualités' },
    { value: 'guides-pratiques', label: 'Guides Pratiques' },
    { value: 'boite-outils', label: 'Boîte à Outils' },
    { value: 'analyse', label: 'Analyse' },
    { value: 'formation', label: 'Formation' }
  ];

  // Charger les articles
  const loadArticles = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const response = await fetch(`/api/articles?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des articles');
      }

      const data: ArticlesResponse = await response.json();
      
      setArticles(data.articles);
      setPagination(data.pagination);

    } catch (error: any) {
      console.error('Erreur chargement articles:', error);
      setError(error.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Charger les articles au montage et lors des changements de filtres
  useEffect(() => {
    if (hasRole) {
      loadArticles();
    }
  }, [hasRole, pagination.page]);

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        loadArticles();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedStatus]);

  if (!hasRole) {
    return null; // Redirection gérée par useRequireRole
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />Publié
        </span>;
      case 'draft':
        return <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
          <Edit className="h-3 w-3 mr-1" />Brouillon
        </span>;
      case 'scheduled':
        return <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          <Clock className="h-3 w-3 mr-1" />Planifié
        </span>;
      case 'archived':
        return <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />Archivé
        </span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryInfo = categories.find(cat => cat.value === category);
    return categoryInfo ? categoryInfo.label : category;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Gestion des Articles</h1>
                <p className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base">Créer et gérer le contenu de la plateforme</p>
              </div>
              
              {/* Add Article Button */}
              <div className="flex-shrink-0">
                <Link
                  href="/admin/articles/new"
                  className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Nouvel Article</span>
                  <span className="sm:hidden">Nouveau</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un article..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="draft">Brouillon</option>
                  <option value="scheduled">Planifié</option>
                  <option value="published">Publié</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Articles Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Articles</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Publiés</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                    {articles.filter(a => a.status === 'PUBLISHED').length}
                  </p>
                </div>
                <Globe className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-600 flex-shrink-0" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Brouillons</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600">
                    {articles.filter(a => a.status === 'DRAFT').length}
                  </p>
                </div>
                <Edit className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-gray-600 flex-shrink-0" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">À la une</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">
                    {articles.filter(a => a.featured).length}
                  </p>
                </div>
                <Star className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-yellow-600 flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Articles ({pagination.total})
              </h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-500">Chargement des articles...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={loadArticles}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Réessayer
                </button>
              </div>
            ) : articles.length === 0 ? (
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
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden xl:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Article</th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Catégorie</th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Statut</th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Auteur</th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Stats</th>
                          <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {articles.map((article) => (
                          <tr key={article.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="flex items-start space-x-3">
                                {article.featuredImage ? (
                                  <img 
                                    src={article.featuredImage} 
                                    alt={article.title}
                                    className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                      {article.title}
                                    </h4>
                                    {article.featured && (
                                      <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 truncate mt-1 max-w-xs">
                                    {article.excerpt}
                                  </p>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {formatDate(article.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 truncate max-w-24">
                                {getCategoryBadge(article.category)}
                              </span>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap">
                              {getStatusBadge(article.status)}
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-1">
                                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <User className="h-3 w-3 text-blue-600" />
                                </div>
                                <span className="text-xs text-gray-900 truncate max-w-20">{article.author}</span>
                              </div>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{article.views}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>{article.likes}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-1">
                                <Link
                                  href={`/admin/articles/${article.id}`}
                                  className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                  title="Voir"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                                <Link
                                  href={`/admin/articles/${article.id}/edit`}
                                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                                  title="Modifier"
                                >
                                  <Edit className="h-4 w-4" />
                                </Link>
                                <button 
                                  className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                  title="Supprimer"
                                >
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

                {/* Tablet Table View */}
                <div className="hidden lg:block xl:hidden">
                  <div className="divide-y divide-gray-200">
                    {articles.map((article) => (
                      <div key={article.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {article.featuredImage ? (
                              <img 
                                src={article.featuredImage} 
                                alt={article.title}
                                className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {article.title}
                                </h4>
                                {article.featured && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                {article.excerpt}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {getStatusBadge(article.status)}
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                  {getCategoryBadge(article.category)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <User className="h-4 w-4" />
                                  <span>{article.author}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{article.views}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>{article.likes}</span>
                                  </div>
                                  <span className="text-xs">{formatDate(article.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-4">
                            <Link
                              href={`/admin/articles/${article.id}`}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/admin/articles/${article.id}/edit`}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden">
                  <div className="divide-y divide-gray-200">
                    {articles.map((article) => (
                      <div key={article.id} className="p-3 sm:p-4 hover:bg-gray-50">
                        <div className="space-y-3">
                          {/* Header with image and title */}
                          <div className="flex items-start space-x-3">
                            {article.featuredImage ? (
                              <img 
                                src={article.featuredImage} 
                                alt={article.title}
                                className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                      {article.title}
                                    </h4>
                                    {article.featured && (
                                      <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
                                    {article.excerpt}
                                  </p>
                                </div>
                                {/* Actions - Mobile */}
                                <div className="flex items-center space-x-1 ml-2 sm:hidden">
                                  <Link
                                    href={`/admin/articles/${article.id}`}
                                    className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                  <Link
                                    href={`/admin/articles/${article.id}/edit`}
                                    className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Status and Category badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(article.status)}
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              {getCategoryBadge(article.category)}
                            </span>
                          </div>
                          
                          {/* Tags */}
                          {article.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {article.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                                  {tag}
                                </span>
                              ))}
                              {article.tags.length > 2 && (
                                <span className="text-xs text-gray-500">+{article.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                          
                          {/* Bottom info and actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="truncate max-w-20 sm:max-w-none">{article.author}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span>{article.views}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span>{article.likes}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Actions - Tablet */}
                            <div className="hidden sm:flex lg:hidden items-center space-x-1">
                              <Link
                                href={`/admin/articles/${article.id}`}
                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`/admin/articles/${article.id}/edit`}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <button className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                      <span className="hidden sm:inline">
                        Affichage de {((pagination.page - 1) * pagination.limit) + 1} à {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total} articles
                      </span>
                      <span className="sm:hidden">
                        {pagination.total} articles
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page <= 1}
                        className="px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <span className="hidden sm:inline">Précédent</span>
                        <span className="sm:hidden">‹</span>
                      </button>
                      <span className="text-xs sm:text-sm text-gray-700 px-2">
                        {pagination.page}/{pagination.pages}
                      </span>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page >= pagination.pages}
                        className="px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <span className="hidden sm:inline">Suivant</span>
                        <span className="sm:hidden">›</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
