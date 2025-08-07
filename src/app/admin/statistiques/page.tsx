"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Users, 
  BookOpen, 
  FileText, 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Shield,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Clock,
  Award,
  Target,
  Zap,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function StatistiquesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Statistiques principales
  const mainStats: StatCard[] = [
    {
      title: "Utilisateurs Totaux",
      value: "3,247",
      change: "+15.2%",
      changeType: 'positive',
      icon: <Users className="h-6 w-6" />,
      description: "Utilisateurs inscrits"
    },
    {
      title: "Utilisateurs Actifs",
      value: "2,847",
      change: "+12.5%",
      changeType: 'positive',
      icon: <Activity className="h-6 w-6" />,
      description: "Actifs ce mois"
    },
    {
      title: "Formations Complétées",
      value: "15,632",
      change: "+8.2%",
      changeType: 'positive',
      icon: <BookOpen className="h-6 w-6" />,
      description: "Modules terminés"
    },
    {
      title: "Taux de Réussite",
      value: "87.3%",
      change: "+2.1%",
      changeType: 'positive',
      icon: <Award className="h-6 w-6" />,
      description: "Moyenne générale"
    }
  ];

  // Statistiques détaillées par catégorie
  const detailedStats = {
    users: [
      { title: "Nouveaux utilisateurs (7j)", value: "156", change: "+23.4%", changeType: 'positive' as const },
      { title: "Utilisateurs actifs quotidiens", value: "892", change: "+5.7%", changeType: 'positive' as const },
      { title: "Taux de rétention", value: "73.2%", change: "-1.2%", changeType: 'negative' as const },
      { title: "Sessions moyennes/utilisateur", value: "4.7", change: "+0.3", changeType: 'positive' as const }
    ],
    content: [
      { title: "Articles publiés", value: "247", change: "+12", changeType: 'positive' as const },
      { title: "Modules de formation", value: "34", change: "+3", changeType: 'positive' as const },
      { title: "Ressources téléchargées", value: "8,934", change: "+18.5%", changeType: 'positive' as const },
      { title: "Évaluations créées", value: "89", change: "+7", changeType: 'positive' as const }
    ],
    engagement: [
      { title: "Temps moyen par session", value: "24m 32s", change: "+2m 15s", changeType: 'positive' as const },
      { title: "Pages vues par session", value: "8.4", change: "+1.2", changeType: 'positive' as const },
      { title: "Taux de rebond", value: "23.7%", change: "-3.2%", changeType: 'positive' as const },
      { title: "Interactions par utilisateur", value: "12.8", change: "+2.1", changeType: 'positive' as const }
    ],
    security: [
      { title: "Tentatives de connexion", value: "1,247", change: "-5.2%", changeType: 'positive' as const },
      { title: "Incidents bloqués", value: "23", change: "-15.3%", changeType: 'positive' as const },
      { title: "Comptes sécurisés", value: "98.7%", change: "+0.5%", changeType: 'positive' as const },
      { title: "Alertes de sécurité", value: "7", change: "-12", changeType: 'positive' as const }
    ]
  };

  // Données pour les graphiques
  const userGrowthData = [
    { name: 'Jan', value: 2400 },
    { name: 'Fév', value: 2600 },
    { name: 'Mar', value: 2800 },
    { name: 'Avr', value: 2950 },
    { name: 'Mai', value: 3100 },
    { name: 'Jun', value: 3247 }
  ];

  const trafficSourcesData: ChartData[] = [
    { name: 'Recherche organique', value: 45, color: '#3B82F6' },
    { name: 'Accès direct', value: 30, color: '#10B981' },
    { name: 'Réseaux sociaux', value: 15, color: '#F59E0B' },
    { name: 'Référencement', value: 10, color: '#EF4444' }
  ];

  const deviceData: ChartData[] = [
    { name: 'Desktop', value: 60, color: '#8B5CF6' },
    { name: 'Mobile', value: 35, color: '#06B6D4' },
    { name: 'Tablette', value: 5, color: '#84CC16' }
  ];

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

  const getCurrentStats = () => {
    switch (selectedCategory) {
      case 'users':
        return detailedStats.users;
      case 'content':
        return detailedStats.content;
      case 'engagement':
        return detailedStats.engagement;
      case 'security':
        return detailedStats.security;
      default:
        return mainStats.map(stat => ({
          title: stat.title,
          value: stat.value,
          change: stat.change,
          changeType: stat.changeType
        }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
                <p className="text-gray-600 mt-1">Analyse détaillée des performances de la plateforme</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Période */}
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="24h">Dernières 24h</option>
                  <option value="7d">7 derniers jours</option>
                  <option value="30d">30 derniers jours</option>
                  <option value="90d">3 derniers mois</option>
                  <option value="1y">Dernière année</option>
                </select>

                {/* Actions */}
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Exporter</span>
                </button>
                
                <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Filtres de catégories */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Vue d\'ensemble', icon: <BarChart3 className="h-4 w-4" /> },
                { key: 'users', label: 'Utilisateurs', icon: <Users className="h-4 w-4" /> },
                { key: 'content', label: 'Contenu', icon: <FileText className="h-4 w-4" /> },
                { key: 'engagement', label: 'Engagement', icon: <Activity className="h-4 w-4" /> },
                { key: 'security', label: 'Sécurité', icon: <Shield className="h-4 w-4" /> }
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.key
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {category.icon}
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {selectedCategory === 'all' ? mainStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
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
                  <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
                </div>
              </div>
            )) : getCurrentStats().map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  {getChangeIcon(stat.changeType)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="mt-4">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
                </div>
              </div>
            ))}
          </div>

          {/* Graphiques et analyses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Croissance des utilisateurs */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Croissance des Utilisateurs</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>+15.2% ce mois</span>
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Graphique de croissance</p>
                  <p className="text-xs text-gray-400 mt-1">Évolution sur 6 mois</p>
                </div>
              </div>
            </div>

            {/* Sources de trafic */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Sources de Trafic</h3>
              <div className="space-y-4">
                {trafficSourcesData.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: source.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{source.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${source.value}%`,
                            backgroundColor: source.color 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{source.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activité par heure */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité par Heure</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Graphique d'activité horaire</p>
                  <p className="text-xs text-gray-400 mt-1">Pic d'activité: 14h-16h</p>
                </div>
              </div>
            </div>

            {/* Répartition par appareil */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par Appareil</h3>
              <div className="space-y-4">
                {deviceData.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: device.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{device.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${device.value}%`,
                            backgroundColor: device.color 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{device.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tableaux de données détaillées */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Formations */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Formations les Plus Populaires</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { name: "Introduction à la Cybersécurité", completions: 1247, rating: 4.8 },
                  { name: "Protection contre le Phishing", completions: 892, rating: 4.7 },
                  { name: "Sécurité des Mots de Passe", completions: 756, rating: 4.6 },
                  { name: "Sécurité Mobile", completions: 634, rating: 4.5 },
                  { name: "Réseaux Sociaux Sécurisés", completions: 523, rating: 4.4 }
                ].map((formation, index) => (
                  <div key={index} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{formation.name}</h4>
                      <p className="text-sm text-gray-500">{formation.completions} complétions</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900 ml-1">{formation.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activités récentes */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {[
                  { type: 'user', message: '156 nouveaux utilisateurs inscrits', time: 'Aujourd\'hui', status: 'success' },
                  { type: 'content', message: 'Module "Sécurité Avancée" publié', time: 'Il y a 2h', status: 'info' },
                  { type: 'security', message: '23 tentatives de connexion bloquées', time: 'Il y a 4h', status: 'warning' },
                  { type: 'achievement', message: '1000e certificat délivré', time: 'Hier', status: 'success' },
                  { type: 'system', message: 'Maintenance programmée effectuée', time: 'Il y a 1j', status: 'info' }
                ].map((activity, index) => (
                  <div key={index} className="px-6 py-4 flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {activity.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {activity.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      {activity.status === 'info' && <Activity className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
