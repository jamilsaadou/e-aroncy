"use client";

import { useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Users, 
  BookOpen, 
  FileText, 
  BarChart3, 
  Bell, 
  Database,
  UserCheck,
  Globe,
  Lock,
  Activity,
  Calendar,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Settings,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'content' | 'security' | 'system';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [articlesDropdownOpen, setArticlesDropdownOpen] = useState(false);
  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false);

  const stats: StatCard[] = [
    {
      title: "Utilisateurs Actifs",
      value: "2,847",
      change: "+12.5%",
      changeType: 'positive',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Modules Complétés",
      value: "15,632",
      change: "+8.2%",
      changeType: 'positive',
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: "Ressources Publiées",
      value: "1,247",
      change: "+3.1%",
      changeType: 'positive',
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: "Incidents Sécurité",
      value: "23",
      change: "-15.3%",
      changeType: 'positive',
      icon: <Shield className="h-6 w-6" />
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'user',
      message: 'Nouvel utilisateur inscrit: marie.dubois@example.com',
      timestamp: 'Il y a 5 minutes',
      status: 'success'
    },
    {
      id: '2',
      type: 'content',
      message: 'Module "Phishing Avancé" mis à jour',
      timestamp: 'Il y a 15 minutes',
      status: 'info'
    },
    {
      id: '3',
      type: 'security',
      message: 'Tentative de connexion suspecte détectée',
      timestamp: 'Il y a 32 minutes',
      status: 'warning'
    },
    {
      id: '4',
      type: 'system',
      message: 'Sauvegarde automatique effectuée',
      timestamp: 'Il y a 1 heure',
      status: 'success'
    },
    {
      id: '5',
      type: 'user',
      message: 'Certificat généré pour jean.martin@company.com',
      timestamp: 'Il y a 2 heures',
      status: 'success'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'content':
        return <BookOpen className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'dashboard' && 'Tableau de Bord'}
                  {activeTab === 'users' && 'Gestion des Utilisateurs'}
                  {activeTab === 'content' && 'Gestion du Contenu'}
                  {activeTab === 'security' && 'Sécurité et Monitoring'}
                  {activeTab === 'settings' && 'Paramètres Système'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeTab === 'dashboard' && 'Vue d\'ensemble de la plateforme'}
                  {activeTab === 'users' && 'Gérer les utilisateurs de la plateforme'}
                  {activeTab === 'content' && 'Gérer le contenu éducatif'}
                  {activeTab === 'security' && 'Surveiller la sécurité de la plateforme'}
                  {activeTab === 'settings' && 'Configurer les paramètres système'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Activity Chart Placeholder */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité des Utilisateurs</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Graphique d'activité</p>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-500">Voir tout</button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusIcon(activity.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/users/new" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Nouvel Utilisateur</span>
                </Link>
                
                <Link href="/admin/content/new" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Nouveau Contenu</span>
                </Link>
                
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Export Données</span>
                </button>
                
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Activity className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Rapport Sécurité</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Nouvel Utilisateur</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un utilisateur..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  <span>Filtres</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière Connexion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Sample user rows */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">MD</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Marie Dubois</div>
                          <div className="text-sm text-gray-500">marie.dubois@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Actif
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Il y a 2 heures
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-500">75%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Management */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestion du Contenu</h2>
              <div className="flex space-x-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Importer</span>
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nouveau Module</span>
                </button>
              </div>
            </div>

            {/* Content Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Modules de Formation</h3>
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-500">modules actifs</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Ressources</h3>
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-500">documents disponibles</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Évaluations</h3>
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">48</p>
                <p className="text-sm text-gray-500">quiz et tests</p>
              </div>
            </div>

            {/* Content List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Contenu Récent</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { title: "Introduction à la Cybersécurité", type: "Module", status: "Publié", date: "2024-01-15" },
                  { title: "Guide Anti-Phishing", type: "Ressource", status: "Brouillon", date: "2024-01-14" },
                  { title: "Test de Sécurité Réseau", type: "Évaluation", status: "Publié", date: "2024-01-13" }
                ].map((item, index) => (
                  <div key={index} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.type} • {item.date}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Publié' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Management */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Sécurité et Monitoring</h2>

            {/* Security Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tentatives de Connexion</h3>
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-green-600">-5.2% vs hier</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Incidents Bloqués</h3>
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">23</p>
                <p className="text-sm text-red-600">+2 vs hier</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sessions Actives</h3>
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">342</p>
                <p className="text-sm text-blue-600">utilisateurs en ligne</p>
              </div>
            </div>

            {/* Security Alerts */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Alertes Sécurité</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { type: "warning", message: "Tentatives de connexion multiples depuis IP 192.168.1.100", time: "Il y a 5 min" },
                  { type: "error", message: "Échec d'authentification pour admin@example.com", time: "Il y a 15 min" },
                  { type: "info", message: "Mise à jour de sécurité appliquée", time: "Il y a 1h" }
                ].map((alert, index) => (
                  <div key={index} className="px-6 py-4 flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      {alert.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                      {alert.type === 'info' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Paramètres Système</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* General Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres Généraux</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la Plateforme</label>
                    <input
                      type="text"
                      defaultValue="E-ARONCY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contact</label>
                    <input
                      type="email"
                      defaultValue="admin@e-aroncy.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau Horaire</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>UTC+1 (Afrique/Niamey)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+2 (Afrique/Le Caire)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de Sécurité</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Authentification à deux facteurs</p>
                      <p className="text-xs text-gray-500">Obligatoire pour tous les utilisateurs</p>
                    </div>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Activé</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Durée de session</p>
                      <p className="text-xs text-gray-500">Déconnexion automatique</p>
                    </div>
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>30 minutes</option>
                      <option>1 heure</option>
                      <option>2 heures</option>
                      <option>4 heures</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tentatives de connexion max</p>
                      <p className="text-xs text-gray-500">Avant blocage temporaire</p>
                    </div>
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>3 tentatives</option>
                      <option>5 tentatives</option>
                      <option>10 tentatives</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Backup Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sauvegarde et Maintenance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Sauvegarde automatique</p>
                      <p className="text-xs text-gray-500">Dernière sauvegarde: Il y a 2 heures</p>
                    </div>
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Activé</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Fréquence de sauvegarde</p>
                      <p className="text-xs text-gray-500">Intervalle entre les sauvegardes</p>
                    </div>
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>Toutes les heures</option>
                      <option>Toutes les 6 heures</option>
                      <option>Quotidienne</option>
                      <option>Hebdomadaire</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Effectuer une sauvegarde maintenant
                    </button>
                  </div>
                </div>
              </div>

              {/* Email Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres Email</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Serveur SMTP</label>
                    <input
                      type="text"
                      defaultValue="smtp.e-aroncy.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                      <input
                        type="number"
                        defaultValue="587"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chiffrement</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>TLS</option>
                        <option>SSL</option>
                        <option>Aucun</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="email-notifications"
                      name="email-notifications"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                      Activer les notifications par email
                    </label>
                  </div>
                </div>
              </div>

              {/* System Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Système</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Version de la plateforme</span>
                    <span className="text-sm font-medium text-gray-900">v2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Base de données</span>
                    <span className="text-sm font-medium text-gray-900">PostgreSQL 14.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Serveur web</span>
                    <span className="text-sm font-medium text-gray-900">Nginx 1.20.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Espace disque utilisé</span>
                    <span className="text-sm font-medium text-gray-900">2.4 GB / 50 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dernière mise à jour</span>
                    <span className="text-sm font-medium text-gray-900">15 janvier 2024</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                    Vérifier les mises à jour
                  </button>
                </div>
              </div>
            </div>

            {/* Save Settings Button */}
            <div className="flex justify-end">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Enregistrer les paramètres
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
