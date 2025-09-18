"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  GraduationCap, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Clock,
  Users,
  BookOpen,
  ChevronDown,
  MoreHorizontal,
  Star,
  Play,
  AlertCircle,
  Loader
} from "lucide-react";

interface Formation {
  id: string;
  title: string;
  category: 'cybersecurite' | 'sensibilisation' | 'technique' | 'management';
  instructor: string;
  duration: string; // en heures
  level: 'debutant' | 'intermediaire' | 'avance';
  status: 'published' | 'draft' | 'archived';
  enrollments: number;
  rating: number;
  createdDate: string;
  lastUpdated: string;
  description: string;
  modules: number;
  featured: boolean;
}

export default function FormationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formations, setFormations] = useState<Formation[]>([]);

  const mapCategory = (c: string): Formation['category'] => {
    switch (c) {
      case 'CYBERSECURITE': return 'cybersecurite';
      case 'SENSIBILISATION': return 'sensibilisation';
      case 'TECHNIQUE': return 'technique';
      case 'MANAGEMENT': return 'management';
      default: return 'cybersecurite';
    }
  };
  const mapLevel = (l: string): Formation['level'] => {
    switch (l) {
      case 'DEBUTANT': return 'debutant';
      case 'INTERMEDIAIRE': return 'intermediaire';
      case 'AVANCE': return 'avance';
      default: return 'debutant';
    }
  };
  const mapStatus = (s: string): Formation['status'] => {
    switch (s) {
      case 'PUBLISHED': return 'published';
      case 'DRAFT': return 'draft';
      case 'ARCHIVED': return 'archived';
      default: return 'draft';
    }
  };

  const loadFormations = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/formations?limit=100', { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur lors du chargement des formations');
      const data = await res.json();
      const items = (data.formations || []).map((f: any) => ({
        id: f.id,
        title: f.title,
        category: mapCategory(f.category),
        instructor: f.instructor,
        duration: f.duration,
        level: mapLevel(f.level),
        status: mapStatus(f.status),
        enrollments: f._count?.enrollments || 0,
        rating: 0,
        createdDate: f.createdAt || '',
        lastUpdated: f.updatedAt || '',
        description: f.shortDescription || f.description || '',
        modules: (f.modules || []).length,
        featured: !!f.featured
      })) as Formation[];
      setFormations(items);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFormations(); }, []);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cybersecurite': return 'Cybersécurité';
      case 'sensibilisation': return 'Sensibilisation';
      case 'technique': return 'Technique';
      case 'management': return 'Management';
      default: return category;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'debutant': return 'Débutant';
      case 'intermediaire': return 'Intermédiaire';
      case 'avance': return 'Avancé';
      default: return level;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Publié</span>;
      case 'draft':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Brouillon</span>;
      case 'archived':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Archivé</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'debutant':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Débutant</span>;
      case 'intermediaire':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Intermédiaire</span>;
      case 'avance':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Avancé</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{level}</span>;
    }
  };

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || formation.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || formation.level === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || formation.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

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
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Formations</h1>
                  <p className="text-gray-600 mt-1">Gérer toutes les formations de la plateforme</p>
                </div>
                
                <Link
                  href="/admin/formations/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nouvelle Formation</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {loading && (
            <div className="bg-white rounded-lg shadow p-12 text-center mb-6">
              <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-gray-500">Chargement des formations…</div>
            </div>
          )}
          {error && (
            <div className="bg-white rounded-lg shadow p-4 mb-6 text-red-600 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" /> {error}
            </div>
          )}
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une formation..."
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
                  <option value="cybersecurite">Cybersécurité</option>
                  <option value="sensibilisation">Sensibilisation</option>
                  <option value="technique">Technique</option>
                  <option value="management">Management</option>
                </select>
              </div>
              
              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les niveaux</option>
                  <option value="debutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="avance">Avancé</option>
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
                  <option value="archived">Archivé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Formations Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Formations</p>
                  <p className="text-2xl font-bold text-gray-900">{formations.length}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Publiées</p>
                  <p className="text-2xl font-bold text-green-600">{formations.filter(f => f.status === 'published').length}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inscriptions</p>
                  <p className="text-2xl font-bold text-blue-600">{formations.reduce((sum, f) => sum + f.enrollments, 0)}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {(formations.filter(f => f.rating > 0).reduce((sum, f) => sum + f.rating, 0) / formations.filter(f => f.rating > 0).length).toFixed(1)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Formations List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Formations ({filteredFormations.length})
              </h3>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Formation</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructeur</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscrits</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFormations.map((formation) => (
                      <tr key={formation.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-start space-x-3">
                            {formation.featured && (
                              <div className="flex-shrink-0">
                                <div className="h-2 w-2 bg-yellow-400 rounded-full mt-2"></div>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {formation.title}
                              </p>
                              <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                {formation.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formation.duration}h
                                </span>
                                <span className="flex items-center">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  {formation.modules} modules
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {getCategoryLabel(formation.category)}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="ml-2 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{formation.instructor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {getLevelBadge(formation.level)}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {getStatusBadge(formation.status)}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {formation.enrollments}
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {formation.rating > 0 ? (
                            <div className="flex items-center space-x-1">
                              <div className="flex">
                                {renderStars(formation.rating)}
                              </div>
                              <span className="text-sm text-gray-500">({formation.rating})</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Pas de note</span>
                          )}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              title="Consulter le cours"
                              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                              onClick={() => router.push(`/formations/${formation.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <Link
                              href={`/admin/formations/${formation.id}`}
                              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                              title="Éditer la formation"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded" title="Aperçu">
                              <Play className="h-4 w-4" />
                            </button>
                            <button
                              title="Supprimer"
                              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                              onClick={async () => {
                                if (!confirm('Supprimer cette formation ?')) return;
                                try {
                                  const res = await fetch(`/api/formations/${formation.id}`, { method: 'DELETE', credentials: 'include' });
                                  if (!res.ok) throw new Error('Suppression impossible');
                                  setFormations(prev => prev.filter(f => f.id !== formation.id));
                                } catch (e: any) {
                                  alert(e.message || 'Erreur lors de la suppression');
                                }
                              }}
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

            {/* Mobile Card View */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-200">
                {filteredFormations.map((formation) => (
                  <div key={formation.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {formation.featured && (
                            <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                          )}
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {formation.title}
                          </h4>
                        </div>
                        
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                          {formation.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {getCategoryLabel(formation.category)}
                          </span>
                          {getLevelBadge(formation.level)}
                          {getStatusBadge(formation.status)}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {formation.instructor}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formation.duration}h
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {formation.enrollments} inscrits
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{formation.modules} modules</span>
                          </div>
                          {formation.rating > 0 ? (
                            <div className="flex items-center space-x-1">
                              <div className="flex">
                                {renderStars(formation.rating)}
                              </div>
                              <span className="text-sm text-gray-500">({formation.rating})</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Pas de note</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-4">
                        <button
                          title="Consulter le cours"
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                          onClick={() => router.push(`/formations/${formation.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link href={`/admin/formations/${formation.id}`} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded" title="Éditer la formation">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded">
                          <Play className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                          onClick={async () => {
                            if (!confirm('Supprimer cette formation ?')) return;
                            try {
                              const res = await fetch(`/api/formations/${formation.id}`, { method: 'DELETE', credentials: 'include' });
                              if (!res.ok) throw new Error('Suppression impossible');
                              setFormations(prev => prev.filter(f => f.id !== formation.id));
                            } catch (e: any) {
                              alert(e.message || 'Erreur lors de la suppression');
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {filteredFormations.length === 0 && (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune formation trouvée</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all' || selectedStatus !== 'all'
                    ? 'Aucune formation ne correspond à vos critères de recherche.'
                    : 'Commencez par créer votre première formation.'}
                </p>
                <Link
                  href="/admin/formations/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une formation
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
