"use client";

import { useState, useEffect } from "react";
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
  Minus,
  MapPin,
  Smartphone,
  Monitor,
  Tablet
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
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

interface StatisticsData {
  mainStats: StatCard[];
  userGrowthData: any[];
  diagnosticsData: any[];
  countryData: any[];
  deviceData: any[];
  hourlyActivityData: any[];
  formationCompletionData: any[];
  summary: any;
}

export default function StatistiquesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les statistiques
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`/api/admin/statistics?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      const data = await response.json();
      setStatisticsData(data);
      setError(null);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant et quand la période change
  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  // Données par défaut en cas de chargement ou d'erreur
  const defaultData = {
    mainStats: [
      {
        title: "Inscriptions ce mois",
        value: "0",
        change: "0%",
        changeType: 'neutral' as const,
        icon: <UserCheck className="h-6 w-6" />,
        description: "Nouveaux utilisateurs"
      },
      {
        title: "Diagnostics effectués",
        value: "0",
        change: "0%",
        changeType: 'neutral' as const,
        icon: <Activity className="h-6 w-6" />,
        description: "Ce mois"
      },
      {
        title: "Utilisateurs Actifs",
        value: "0",
        change: "0%",
        changeType: 'neutral' as const,
        icon: <Users className="h-6 w-6" />,
        description: "Actifs ce mois"
      },
      {
        title: "Taux de Complétion",
        value: "0%",
        change: "0%",
        changeType: 'neutral' as const,
        icon: <Target className="h-6 w-6" />,
        description: "Diagnostics terminés"
      }
    ],
    userGrowthData: [],
    diagnosticsData: [],
    countryData: [],
    deviceData: [
      { name: 'Mobile', value: 60, color: '#3B82F6', icon: <Smartphone className="h-4 w-4" /> },
      { name: 'Desktop', value: 35, color: '#10B981', icon: <Monitor className="h-4 w-4" /> },
      { name: 'Tablette', value: 5, color: '#F59E0B', icon: <Tablet className="h-4 w-4" /> }
    ],
    hourlyActivityData: [],
    formationCompletionData: []
  };

  // Utiliser les données réelles ou les données par défaut
  const data = statisticsData || defaultData;
  const mainStats = data.mainStats.map((stat, index) => ({
    ...stat,
    icon: [
      <UserCheck className="h-6 w-6" key="usercheck" />,
      <Activity className="h-6 w-6" key="activity" />,
      <Users className="h-6 w-6" key="users" />,
      <Target className="h-6 w-6" key="target" />
    ][index]
  }));

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
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Statistiques</h1>
                <p className="text-gray-600 mt-1">Analyse complète des performances de la plateforme e-Aroncy</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7d">7 derniers jours</option>
                  <option value="30d">30 derniers jours</option>
                  <option value="90d">3 derniers mois</option>
                  <option value="1y">Dernière année</option>
                </select>

                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Exporter</span>
                </button>
                
                <button 
                  onClick={fetchStatistics}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Message d'erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Indicateur de chargement */}
          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
                <p className="text-blue-700">Chargement des statistiques...</p>
              </div>
            </div>
          )}
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mainStats.map((stat, index) => (
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
                  <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
                </div>
              </div>
            ))}
          </div>

          {/* Graphiques principaux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Croissance des utilisateurs */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Évolution des Utilisateurs</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>+23.4% ce mois</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.userGrowthData}>
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
                    name="Total utilisateurs"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="actifs" 
                    stackId="2"
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                    name="Utilisateurs actifs"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Diagnostics effectués */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Diagnostics de Sécurité</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span>2,020 ce mois</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.diagnosticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="completes" fill="#10B981" name="Complétés" />
                  <Bar dataKey="abandons" fill="#EF4444" name="Abandonnés" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Répartition géographique et appareils */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Répartition par pays */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition des Inscriptions par Pays</h3>
              <div className="flex flex-col lg:flex-row items-center">
                <div className="w-full lg:w-1/2">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={data.countryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      >
                        {data.countryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full lg:w-1/2 space-y-3">
                  {data.countryData.map((country, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{country.flag}</span>
                        <span className="font-medium text-gray-700">{country.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{country.value.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">utilisateurs</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activité par heure */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité par Heure</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.hourlyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="activite" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="Utilisateurs actifs"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Pic d'activité: 14h-16h (280 utilisateurs)
                </p>
              </div>
            </div>
          </div>

          {/* Répartition par appareil et formations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Répartition par appareil */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par Appareil</h3>
              <div className="space-y-4">
                {data.deviceData.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg">
                        {device.icon}
                      </div>
                      <span className="font-medium text-gray-700">{device.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${device.value}%`,
                            backgroundColor: device.color 
                          }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-900 w-12 text-right">{device.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    60% des utilisateurs accèdent via mobile
                  </span>
                </div>
              </div>
            </div>

            {/* Top formations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Formations les Plus Populaires</h3>
              <div className="space-y-4">
                {data.formationCompletionData.map((formation, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{formation.name}</h4>
                      <span className="text-sm font-bold text-green-600">{formation.taux}%</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{formation.completions.toLocaleString()} complétions</span>
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">Populaire</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${formation.taux}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Métriques détaillées */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Métriques d'engagement */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Engagement Utilisateurs</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Temps moyen/session</span>
                  </div>
                  <span className="font-bold text-gray-900">24m 32s</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Pages vues/session</span>
                  </div>
                  <span className="font-bold text-gray-900">8.4</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Taux de rebond</span>
                  </div>
                  <span className="font-bold text-green-600">23.7%</span>
                </div>
              </div>
            </div>

            {/* Métriques de sécurité */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Sécurité</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Comptes sécurisés</span>
                  </div>
                  <span className="font-bold text-green-600">98.7%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Incidents bloqués</span>
                  </div>
                  <span className="font-bold text-yellow-600">23</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Alertes actives</span>
                  </div>
                  <span className="font-bold text-blue-600">7</span>
                </div>
              </div>
            </div>

            {/* Activités récentes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Activités Récentes</h3>
              <div className="space-y-3">
                {[
                  { type: 'success', message: '420 nouveaux utilisateurs ce mois', time: 'Aujourd\'hui' },
                  { type: 'info', message: 'Module "Sécurité Avancée" publié', time: 'Il y a 2h' },
                  { type: 'warning', message: '23 tentatives bloquées', time: 'Il y a 4h' },
                  { type: 'success', message: '2000e diagnostic complété', time: 'Hier' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {activity.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      {activity.type === 'info' && <Activity className="h-4 w-4 text-blue-500" />}
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
