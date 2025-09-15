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
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  Smartphone,
  Monitor,
  Award
} from "lucide-react";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description?: string;
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

  // Données pour les graphiques
  const userActivityData = [
    { name: 'Lun', utilisateurs: 2400, sessions: 1800, nouveaux: 120 },
    { name: 'Mar', utilisateurs: 2600, sessions: 2100, nouveaux: 150 },
    { name: 'Mer', utilisateurs: 2800, sessions: 2300, nouveaux: 180 },
    { name: 'Jeu', utilisateurs: 2950, sessions: 2500, nouveaux: 160 },
    { name: 'Ven', utilisateurs: 3100, sessions: 2800, nouveaux: 200 },
    { name: 'Sam', utilisateurs: 2800, sessions: 2200, nouveaux: 140 },
    { name: 'Dim', utilisateurs: 2600, sessions: 2000, nouveaux: 110 }
  ];

  const moduleCompletionData = [
    { name: 'Cybersécurité', completions: 1247, taux: 87 },
    { name: 'Phishing', completions: 892, taux: 92 },
    { name: 'Mots de passe', completions: 756, taux: 89 },
    { name: 'Mobile', completions: 634, taux: 85 },
    { name: 'Réseaux sociaux', completions: 523, taux: 83 }
  ];

  const deviceUsageData = [
    { name: 'Mobile', value: 60, color: '#3B82F6' },
    { name: 'Desktop', value: 35, color: '#10B981' },
    { name: 'Tablette', value: 5, color: '#F59E0B' }
  ];

  const stats: StatCard[] = [
    {
      title: "Utilisateurs Actifs",
      value: "3,100",
      change: "+12.5%",
      changeType: 'positive',
      icon: <Users className="h-6 w-6" />,
      description: "Ce mois"
    },
    {
      title: "Diagnostics Complétés",
      value: "2,020",
      change: "+15.8%",
      changeType: 'positive',
      icon: <Activity className="h-6 w-6" />,
      description: "Ce mois"
    },
    {
      title: "Nouveaux Inscrits",
      value: "420",
      change: "+23.4%",
      changeType: 'positive',
      icon: <UserCheck className="h-6 w-6" />,
      description: "Ce mois"
    },
    {
      title: "Incidents Sécurité",
      value: "23",
      change: "-15.3%",
      changeType: 'positive',
      icon: <Shield className="h-6 w-6" />,
      description: "Bloqués"
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'user',
      message: '420 nouveaux utilisateurs inscrits ce mois',
      timestamp: 'Aujourd\'hui',
      status: 'success'
    },
    {
      id: '2',
      type: 'content',
      message: 'Module "Sécurité Avancée" publié',
      timestamp: 'Il y a 2 heures',
      status: 'info'
    },
    {
      id: '3',
      type: 'security',
      message: '23 tentatives de connexion bloquées',
      timestamp: 'Il y a 4 heures',
      status: 'warning'
    },
    {
      id: '4',
      type: 'system',
      message: '2000e diagnostic complété',
      timestamp: 'Hier',
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

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Tableau de Bord</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Vue d'ensemble de la plateforme e-Aroncy</p>
              </div>
              
              <div className="flex items-center justify-end space-x-2 sm:space-x-4 flex-shrink-0">
                <Link 
                  href="/admin/statistiques"
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Statistiques Détaillées</span>
                  <span className="sm:hidden">Stats</span>
                </Link>
                <button className="relative p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="space-y-6 sm:space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-full">
                      {stat.icon}
                    </div>
                    {getChangeIcon(stat.changeType)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    {stat.description && (
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center">
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              {/* Activity Chart */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Activité des Utilisateurs (7 jours)</h3>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                    <span>+12.5% cette semaine</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="utilisateurs" 
                      stackId="1"
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.6}
                      name="Utilisateurs actifs"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sessions" 
                      stackId="2"
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.6}
                      name="Sessions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Activités Récentes</h3>
                  <Link href="/admin/statistiques" className="text-xs sm:text-sm text-blue-600 hover:text-blue-500 self-start sm:self-auto">
                    Voir tout
                  </Link>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-gray-900 leading-relaxed">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module Performance and Device Usage */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              {/* Module Performance */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Performance des Modules</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={moduleCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="taux" fill="#10B981" name="Taux de réussite (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Device Usage */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Utilisation par Appareil</h3>
                <div className="flex flex-col xl:flex-row items-center space-y-4 xl:space-y-0">
                  <div className="w-full xl:w-1/2">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={deviceUsageData}
                          cx="50%"
                          cy="50%"
                          outerRadius={50}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                        >
                          {deviceUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full xl:w-1/2 space-y-2 sm:space-y-3">
                    {deviceUsageData.map((device, index) => (
                      <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: device.color }}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">{device.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{device.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span className="text-xs sm:text-sm font-medium text-blue-800">
                      60% des utilisateurs accèdent via mobile
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats and Actions */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Métriques Rapides</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                      <span className="text-xs sm:text-sm font-medium">Temps moyen/session</span>
                    </div>
                    <span className="text-sm sm:text-base font-bold text-gray-900">24m 32s</span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Target className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      <span className="text-xs sm:text-sm font-medium">Taux de complétion</span>
                    </div>
                    <span className="text-sm sm:text-base font-bold text-green-600">90.1%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                      <span className="text-xs sm:text-sm font-medium">Comptes sécurisés</span>
                    </div>
                    <span className="text-sm sm:text-base font-bold text-purple-600">98.7%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                      <span className="text-xs sm:text-sm font-medium">Certificats délivrés</span>
                    </div>
                    <span className="text-sm sm:text-base font-bold text-yellow-600">1,247</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Actions Rapides</h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <Link href="/admin/users/new" className="flex items-center space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-900 block">Nouvel Utilisateur</span>
                      <p className="text-xs text-gray-500 truncate">Ajouter un utilisateur à la plateforme</p>
                    </div>
                  </Link>
                  
                  <Link href="/admin/formations/new" className="flex items-center space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-900 block">Nouvelle Formation</span>
                      <p className="text-xs text-gray-500 truncate">Créer un nouveau module de formation</p>
                    </div>
                  </Link>
                  
                  <Link href="/admin/statistiques" className="flex items-center space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-900 block">Statistiques Détaillées</span>
                      <p className="text-xs text-gray-500 truncate">Voir l'analyse complète des données</p>
                    </div>
                  </Link>
                  
                  <button className="flex items-center space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-900 block">Export Données</span>
                      <p className="text-xs text-gray-500 truncate">Télécharger les rapports</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">État du Système</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-3 sm:p-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full mb-2 sm:mb-3">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900">Serveurs</h4>
                  <p className="text-xs text-green-600">Opérationnels</p>
                </div>
                <div className="text-center p-3 sm:p-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full mb-2 sm:mb-3">
                    <Database className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900">Base de données</h4>
                  <p className="text-xs text-green-600">Connectée</p>
                </div>
                <div className="text-center p-3 sm:p-0">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full mb-2 sm:mb-3">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900">Sauvegarde</h4>
                  <p className="text-xs text-yellow-600">Il y a 2h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
