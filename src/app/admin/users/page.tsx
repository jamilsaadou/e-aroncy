"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { useRequireRole } from "../../../components/SessionProvider";
import { 
  Users, 
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Building,
  ChevronDown,
  Heart,
  Briefcase,
  GraduationCap,
  Loader,
  AlertCircle,
  Shield,
  Clock
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  role: string;
  status: string;
  lastLogin: string | null;
  lastActivity: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  failedLoginAttempts: number;
  lockUntil: string | null;
  _count: {
    sessions: number;
  };
}

interface UsersResponse {
  success: boolean;
  users: UserData[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: Array<{
    status: string;
    role: string;
    _count: { id: number };
  }>;
}

export default function UsersPage() {
  // Protection de la route
  const { hasRole } = useRequireRole(['ADMIN'], '/dashboard');
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [addUserDropdownOpen, setAddUserDropdownOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Charger les utilisateurs
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }

      const data: UsersResponse = await response.json();
      
      setUsers(data.users);
      setPagination(data.pagination);

    } catch (error: any) {
      console.error('Erreur chargement utilisateurs:', error);
      setError(error.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // Charger les utilisateurs au montage et lors des changements de filtres
  useEffect(() => {
    if (hasRole) {
      loadUsers();
    }
  }, [hasRole, pagination.page]);

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        loadUsers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedStatus]);

  if (!hasRole) {
    return null; // Redirection gérée par useRequireRole
  }

  const getOrgTypeFromName = (orgName: string) => {
    const name = orgName.toLowerCase();
    if (name.includes('ong') || name.includes('association')) return { label: 'ONG', icon: Heart, color: 'text-red-600' };
    if (name.includes('entreprise') || name.includes('corp') || name.includes('sarl')) return { label: 'Entreprise', icon: Briefcase, color: 'text-blue-600' };
    if (name.includes('gouvernement') || name.includes('ministère') || name.includes('état')) return { label: 'Gouvernement', icon: Building, color: 'text-green-600' };
    if (name.includes('université') || name.includes('école') || name.includes('institut')) return { label: 'Éducation', icon: GraduationCap, color: 'text-purple-600' };
    return { label: 'Organisation', icon: Building, color: 'text-gray-600' };
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Actif</span>;
      case 'inactive':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactif</span>;
      case 'pending':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case 'suspended':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Suspendu</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          <Shield className="h-3 w-3 mr-1" />Admin
        </span>;
      case 'INSTRUCTOR':
        return <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          <GraduationCap className="h-3 w-3 mr-1" />Instructeur
        </span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          <User className="h-3 w-3 mr-1" />Étudiant
        </span>;
    }
  };

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return 'Jamais';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'À l\'instant';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR');
  };

  const getUserProgress = (user: UserData) => {
    let progress = 0;
    if (user.emailVerified) progress += 20;
    if (user.lastLogin) progress += 30;
    if (user._count.sessions > 0) progress += 25;
    if (user.twoFactorEnabled) progress += 25;
    return progress;
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
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                  <p className="text-gray-600 mt-1">Gérer tous les utilisateurs de la plateforme</p>
                </div>
                
                {/* Add User Button */}
                <Link
                  href="/admin/users/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nouvel Utilisateur</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="pending">En attente</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.totalCount}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                  <p className="text-2xl font-bold text-red-600">
                    {users.filter(u => u.role === 'ADMIN').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Instructeurs</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {users.filter(u => u.role === 'INSTRUCTOR').length}
                  </p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Étudiants</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.role === 'STUDENT').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Utilisateurs ({pagination.totalCount})
              </h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-500">Chargement des utilisateurs...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={loadUsers}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Réessayer
                </button>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedStatus !== 'all'
                    ? 'Aucun utilisateur ne correspond à vos critères de recherche.'
                    : 'Commencez par créer votre premier utilisateur.'}
                </p>
                <Link
                  href="/admin/users/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un utilisateur
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connexion</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => {
                          const orgInfo = getOrgTypeFromName(user.organization || '');
                          return (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-medium text-blue-600">
                                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="ml-3 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                      {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate">{user.email}</div>
                                    <div className="flex items-center space-x-2 mt-1">
                                      {getRoleBadge(user.role)}
                                      {user.twoFactorEnabled && (
                                        <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                                          <Shield className="h-2.5 w-2.5 mr-1" />2FA
                                        </span>
                                      )}
                                      {user.lockUntil && new Date(user.lockUntil) > new Date() && (
                                        <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded bg-red-100 text-red-800">
                                          Verrouillé
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <orgInfo.icon className={`h-4 w-4 ${orgInfo.color} flex-shrink-0`} />
                                  <div>
                                    <div className="text-sm text-gray-900 truncate max-w-32">
                                      {user.organization || 'Non spécifiée'}
                                    </div>
                                    <div className="text-xs text-gray-500">{orgInfo.label}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap">
                                <div className="flex flex-col space-y-1">
                                  {getStatusBadge(user.status)}
                                  {!user.emailVerified && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                                      Email non vérifié
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatLastLogin(user.lastLogin)}
                                </div>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap">
                                {user._count.sessions > 0 ? (
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {user._count.sessions} active{user._count.sessions > 1 ? 's' : ''}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-500">Aucune</span>
                                )}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-1">
                                  <Link
                                    href={`/admin/users/${user.id}`}
                                    className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                  <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden">
                  <div className="divide-y divide-gray-200">
                    {users.map((user) => {
                      const orgInfo = getOrgTypeFromName(user.organization || '');
                      return (
                        <div key={user.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <span className="text-sm font-medium text-blue-600">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {user.firstName} {user.lastName}
                                  </h4>
                                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    {getRoleBadge(user.role)}
                                    {user.twoFactorEnabled && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                                        2FA
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <div className="flex items-center space-x-1">
                                  <orgInfo.icon className={`h-4 w-4 ${orgInfo.color}`} />
                                  <span className="text-sm text-gray-600">{orgInfo.label}</span>
                                </div>
                                {getStatusBadge(user.status)}
                                {user._count.sessions > 0 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                                    <Clock className="h-2.5 w-2.5 mr-1" />
                                    {user._count.sessions} session{user._count.sessions > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                              
                              <div className="text-sm text-gray-600 mb-3 truncate">
                                <Building className="h-4 w-4 inline mr-1" />
                                {user.organization || 'Organisation non spécifiée'}
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Dernière connexion: {formatLastLogin(user.lastLogin)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-4">
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Affichage de {((pagination.page - 1) * pagination.limit) + 1} à {Math.min(pagination.page * pagination.limit, pagination.totalCount)} sur {pagination.totalCount} utilisateurs
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={!pagination.hasPrev}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Précédent
                      </button>
                      <span className="text-sm text-gray-700">
                        Page {pagination.page} sur {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={!pagination.hasNext}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Suivant
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
