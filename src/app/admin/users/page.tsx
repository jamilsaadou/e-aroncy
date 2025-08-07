"use client";

import { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Users, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  MapPin,
  Building,
  ChevronDown,
  MoreHorizontal,
  Globe,
  Heart,
  Briefcase,
  GraduationCap,
  UserCheck
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  country: string;
  organization: string;
  organizationType: 'ong' | 'entreprise' | 'gouvernement' | 'education' | 'individuel';
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  progress: number;
  joinDate: string;
  avatar?: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedOrgType, setSelectedOrgType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [addUserDropdownOpen, setAddUserDropdownOpen] = useState(false);

  // Données d'exemple
  const users: UserData[] = [
    {
      id: '1',
      name: 'Marie Dubois',
      email: 'marie.dubois@ong-securite.org',
      country: 'Sénégal',
      organization: 'ONG Sécurité Numérique',
      organizationType: 'ong',
      role: 'Coordinatrice Sécurité',
      status: 'active',
      lastLogin: 'Il y a 2 heures',
      progress: 75,
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jean Martin',
      email: 'j.martin@gouv-niger.ne',
      country: 'Niger',
      organization: 'Ministère du Numérique',
      organizationType: 'gouvernement',
      role: 'Directeur IT',
      status: 'active',
      lastLogin: 'Il y a 1 jour',
      progress: 60,
      joinDate: '2024-01-10'
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      email: 'sophie.laurent@techcorp.ci',
      country: 'Côte d\'Ivoire',
      organization: 'TechCorp Solutions',
      organizationType: 'entreprise',
      role: 'Responsable Sécurité',
      status: 'active',
      lastLogin: 'Il y a 3 heures',
      progress: 90,
      joinDate: '2024-01-08'
    },
    {
      id: '4',
      name: 'Pierre Durand',
      email: 'p.durand@univ-dakar.sn',
      country: 'Sénégal',
      organization: 'Université de Dakar',
      organizationType: 'education',
      role: 'Professeur',
      status: 'pending',
      lastLogin: 'Jamais',
      progress: 0,
      joinDate: '2024-01-20'
    },
    {
      id: '5',
      name: 'Anne Moreau',
      email: 'anne.moreau@gmail.com',
      country: 'Mali',
      organization: 'Freelance',
      organizationType: 'individuel',
      role: 'Consultante',
      status: 'inactive',
      lastLogin: 'Il y a 2 semaines',
      progress: 45,
      joinDate: '2023-12-20'
    },
    {
      id: '6',
      name: 'Amadou Diallo',
      email: 'a.diallo@actionaid-bf.org',
      country: 'Burkina Faso',
      organization: 'ActionAid Burkina',
      organizationType: 'ong',
      role: 'Chef de Projet',
      status: 'active',
      lastLogin: 'Il y a 5 heures',
      progress: 85,
      joinDate: '2024-01-12'
    }
  ];

  const countries = ['Sénégal', 'Niger', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso', 'Ghana', 'Togo', 'Bénin'];
  
  const organizationTypes = [
    { value: 'ong', label: 'ONG', icon: Heart, color: 'text-red-600' },
    { value: 'entreprise', label: 'Entreprise', icon: Briefcase, color: 'text-blue-600' },
    { value: 'gouvernement', label: 'Gouvernement', icon: Building, color: 'text-green-600' },
    { value: 'education', label: 'Éducation', icon: GraduationCap, color: 'text-purple-600' },
    { value: 'individuel', label: 'Individuel', icon: User, color: 'text-gray-600' }
  ];

  const getOrgTypeInfo = (type: string) => {
    return organizationTypes.find(org => org.value === type) || organizationTypes[4];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Actif</span>;
      case 'inactive':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactif</span>;
      case 'pending':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || user.country === selectedCountry;
    const matchesOrgType = selectedOrgType === 'all' || user.organizationType === selectedOrgType;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesCountry && matchesOrgType && matchesStatus;
  });

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Sénégal': '🇸🇳',
      'Niger': '🇳🇪',
      'Côte d\'Ivoire': '🇨🇮',
      'Mali': '🇲🇱',
      'Burkina Faso': '🇧🇫',
      'Ghana': '🇬🇭',
      'Togo': '🇹🇬',
      'Bénin': '🇧🇯'
    };
    return flags[country] || '🌍';
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
                
                {/* Add User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setAddUserDropdownOpen(!addUserDropdownOpen)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Nouvel Utilisateur</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {addUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-2">
                        <Link
                          href="/admin/users/new?type=individual"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="h-4 w-4 text-gray-600" />
                          <span>Utilisateur individuel</span>
                        </Link>
                        <Link
                          href="/admin/users/new?type=ong"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Heart className="h-4 w-4 text-red-600" />
                          <span>Membre d'ONG</span>
                        </Link>
                        <Link
                          href="/admin/users/new?type=company"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <span>Employé d'entreprise</span>
                        </Link>
                        <Link
                          href="/admin/users/new?type=government"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Building className="h-4 w-4 text-green-600" />
                          <span>Agent gouvernemental</span>
                        </Link>
                        <Link
                          href="/admin/users/new?type=education"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <GraduationCap className="h-4 w-4 text-purple-600" />
                          <span>Personnel éducatif</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les pays</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={selectedOrgType}
                  onChange={(e) => setSelectedOrgType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les types</option>
                  {organizationTypes.map(org => (
                    <option key={org.value} value={org.value}>{org.label}</option>
                  ))}
                </select>
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
                </select>
              </div>
            </div>
          </div>

          {/* Users Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            {organizationTypes.map(org => (
              <div key={org.value} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{org.label}</p>
                    <p className={`text-2xl font-bold ${org.color}`}>
                      {users.filter(u => u.organizationType === org.value).length}
                    </p>
                  </div>
                  <org.icon className={`h-8 w-8 ${org.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Users List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Utilisateurs ({filteredUsers.length})
              </h3>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Utilisateur</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connexion</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prog.</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => {
                      const orgInfo = getOrgTypeInfo(user.organizationType);
                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-blue-600">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="ml-3 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                                <div className="text-sm text-gray-500 truncate">{user.email}</div>
                                <div className="text-xs text-gray-400 truncate">{user.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">{getCountryFlag(user.country)}</span>
                              <span className="text-sm text-gray-900 truncate">{user.country}</span>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 truncate max-w-32">{user.organization}</div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <orgInfo.icon className={`h-4 w-4 ${orgInfo.color} flex-shrink-0`} />
                              <span className="text-sm text-gray-900 truncate">{orgInfo.label}</span>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 truncate">
                              {user.lastLogin.replace('Il y a ', '')}
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${user.progress}%` }}
                                ></div>
                              </div>
                              <span className="ml-1 text-xs text-gray-500">{user.progress}%</span>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const orgInfo = getOrgTypeInfo(user.organizationType);
                  return (
                    <div key={user.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-blue-600">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {user.name}
                              </h4>
                              <p className="text-sm text-gray-500 truncate">{user.email}</p>
                              <p className="text-xs text-gray-400">{user.role}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">{getCountryFlag(user.country)}</span>
                              <span className="text-sm text-gray-600">{user.country}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <orgInfo.icon className={`h-4 w-4 ${orgInfo.color}`} />
                              <span className="text-sm text-gray-600">{orgInfo.label}</span>
                            </div>
                            {getStatusBadge(user.status)}
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-3 truncate">
                            <Building className="h-4 w-4 inline mr-1" />
                            {user.organization}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{user.lastLogin}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span>Progression:</span>
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${user.progress}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-xs">{user.progress}%</span>
                              </div>
                            </div>
                          </div>
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
                  );
                })}
              </div>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedCountry !== 'all' || selectedOrgType !== 'all' || selectedStatus !== 'all'
                    ? 'Aucun utilisateur ne correspond à vos critères de recherche.'
                    : 'Commencez par créer votre premier utilisateur.'}
                </p>
                <div className="relative inline-block">
                  <button
                    onClick={() => setAddUserDropdownOpen(!addUserDropdownOpen)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un utilisateur
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
