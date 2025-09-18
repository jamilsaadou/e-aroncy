import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, Award, TrendingUp, CheckCircle, 
  AlertCircle, PlayCircle, Calendar, Users, Target,
  BarChart3, PieChart, Star, Download, Eye,
  ChevronRight, Zap, Trophy, Medal, Gift,
  Timer, Activity, BookMarked
} from 'lucide-react';

// Types
interface UserProgress {
  id: string;
  formationId: string;
  completedModules: number;
  progressPercentage: number;
  timeSpent: number; // en minutes
  startedAt: string;
  lastAccessedAt?: string;
  formation: {
    id: string;
    title: string;
    description: string;
    level: string;
    category: string;
    modules: Array<{
      id: string;
      title: string;
      duration: number;
    }>;
  };
  moduleProgress: Array<{
    moduleId: string;
    title: string;
    completed: boolean;
    score?: number;
    completedAt?: string;
  }>;
}

interface Certificate {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  formation: {
    title: string;
    instructor: {
      name: string;
    };
  };
}

interface Stats {
  totalFormations: number;
  completedFormations: number;
  totalCertificates: number;
  totalTimeSpent: number;
  averageScore: number;
  currentStreak: number;
}

// API Service
class ProgressApiService {
  private baseUrl = '/api';
  private token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Une erreur est survenue');
    }

    return response.json();
  }

  async getProgress(formationId: string): Promise<UserProgress> {
    return this.request(`/user/progress/${formationId}`);
  }

  async getAllProgress(): Promise<UserProgress[]> {
    return this.request('/user/progress');
  }

  async getCertificates(): Promise<Certificate[]> {
    try {
      return await this.request('/user/certificates');
    } catch {
      return [] as Certificate[];
    }
  }

  async getStats(): Promise<Stats> {
    return this.request('/user/stats');
  }

  async enrollInFormation(formationId: string) {
    return this.request(`/formations/${formationId}/enroll`, { method: 'POST' });
  }
}

const progressApi = new ProgressApiService();

// Progress Circle Component
function ProgressCircle({ percentage, size = 80, strokeWidth = 6, color = '#3B82F6' }: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-lg font-semibold text-gray-900">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

// Statistics Card Component
function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  color = 'blue',
  trend 
}: {
  icon: React.ComponentType<any>;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  trend?: number;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            <TrendingUp className="h-4 w-4" />
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Formation Progress Card
function FormationProgressCard({ progress }: { progress: UserProgress }) {
  const totalModules = progress.formation.modules.length;
  const completedCount = progress.moduleProgress.filter(m => m.completed).length;
  const averageScore = progress.moduleProgress
    .filter(m => m.score !== undefined)
    .reduce((acc, m) => acc + (m.score || 0), 0) / 
    progress.moduleProgress.filter(m => m.score !== undefined).length || 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'cybersecurite': 'bg-red-100 text-red-800',
      'sensibilisation': 'bg-blue-100 text-blue-800',
      'technique': 'bg-green-100 text-green-800',
      'management': 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'debutant': 'bg-green-100 text-green-800',
      'intermediaire': 'bg-yellow-100 text-yellow-800',
      'avance': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(progress.formation.category)}`}>
              {progress.formation.category}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(progress.formation.level)}`}>
              {progress.formation.level}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {progress.formation.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {progress.formation.description}
          </p>
        </div>
        <div className="ml-6">
          <ProgressCircle percentage={progress.progressPercentage} size={60} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {completedCount}/{totalModules}
          </div>
          <div className="text-xs text-gray-500">Modules complétés</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatTime(progress.timeSpent)}
          </div>
          <div className="text-xs text-gray-500">Temps passé</div>
        </div>
      </div>

      {averageScore > 0 && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Score moyen</span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= averageScore / 20 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(averageScore)}%
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {progress.moduleProgress.slice(0, 3).map((module) => (
          <div key={module.moduleId} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              {module.completed ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
              )}
              <span className={module.completed ? 'text-gray-900' : 'text-gray-600'}>
                {module.title}
              </span>
            </div>
            {module.score && (
              <span className="text-xs font-medium text-gray-500">
                {Math.round(module.score)}%
              </span>
            )}
          </div>
        ))}
        
        {progress.moduleProgress.length > 3 && (
          <div className="text-xs text-gray-500 text-center pt-2">
            +{progress.moduleProgress.length - 3} autres modules
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
          <PlayCircle className="h-4 w-4" />
          <span>Continuer la formation</span>
        </button>
      </div>
    </div>
  );
}

// Certificate Card
function CertificateCard({ certificate }: { certificate: Certificate }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDownload = async () => {
    // Simulation du téléchargement
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 800, 600);
      
      // Border
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, 720, 520);
      
      // Title
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICAT', 400, 140);
      
      // Subtitle
      ctx.fillStyle = '#6b7280';
      ctx.font = '24px Arial';
      ctx.fillText('de Réussite', 400, 180);
      
      // Formation title
      ctx.fillStyle = '#111827';
      ctx.font = '32px Arial';
      ctx.fillText(certificate.formation.title, 400, 280);
      
      // Details
      ctx.fillStyle = '#4b5563';
      ctx.font = '20px Arial';
      ctx.fillText(`Délivré le ${formatDate(certificate.issuedAt)}`, 400, 380);
      ctx.fillText(`Par ${certificate.formation.instructor.name}`, 400, 420);
      
      // Certificate number
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px Arial';
      ctx.fillText(`N° ${certificate.certificateNumber}`, 400, 500);
    }
    
    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificat-${certificate.certificateNumber}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-blue-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 rounded-full p-2">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Certificat de Réussite</h3>
            <p className="text-sm text-gray-600">E-ARONCY Platform</p>
          </div>
        </div>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
          Vérifié
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-1">
          {certificate.formation.title}
        </h4>
        <p className="text-sm text-gray-600">
          Délivré par {certificate.formation.instructor.name}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Le {formatDate(certificate.issuedAt)}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-blue-200">
        <span className="text-xs text-gray-500 font-mono">
          #{certificate.certificateNumber}
        </span>
        <div className="flex space-x-2">
          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function ProgressDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'certificates'>('overview');
  const [progressData, setProgressData] = useState<UserProgress[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Simulation des données pour la démo
      const mockProgress: UserProgress[] = [
        {
          id: '1',
          formationId: '1',
          completedModules: 3,
          progressPercentage: 75,
          timeSpent: 240,
          startedAt: '2024-01-15T10:00:00Z',
          lastAccessedAt: '2024-01-20T14:30:00Z',
          formation: {
            id: '1',
            title: 'Introduction à la Cybersécurité pour les ONG',
            description: 'Découvrez les fondamentaux de la cybersécurité adaptés aux organisations de la société civile.',
            level: 'debutant',
            category: 'cybersecurite',
            modules: [
              { id: '1', title: 'Concepts de base', duration: 45 },
              { id: '2', title: 'Menaces courantes', duration: 60 },
              { id: '3', title: 'Bonnes pratiques', duration: 75 },
              { id: '4', title: 'Outils de protection', duration: 90 }
            ]
          },
          moduleProgress: [
            { moduleId: '1', title: 'Concepts de base', completed: true, score: 85, completedAt: '2024-01-16T09:00:00Z' },
            { moduleId: '2', title: 'Menaces courantes', completed: true, score: 92, completedAt: '2024-01-17T11:00:00Z' },
            { moduleId: '3', title: 'Bonnes pratiques', completed: true, score: 78, completedAt: '2024-01-19T15:00:00Z' },
            { moduleId: '4', title: 'Outils de protection', completed: false }
          ]
        },
        {
          id: '2',
          formationId: '2',
          completedModules: 2,
          progressPercentage: 40,
          timeSpent: 120,
          startedAt: '2024-01-18T14:00:00Z',
          lastAccessedAt: '2024-01-19T10:00:00Z',
          formation: {
            id: '2',
            title: 'Sécurisation des Réseaux d\'Entreprise',
            description: 'Apprenez à sécuriser les infrastructures réseau en entreprise.',
            level: 'intermediaire',
            category: 'technique',
            modules: [
              { id: '5', title: 'Architecture réseau', duration: 60 },
              { id: '6', title: 'Pare-feu et VPN', duration: 90 },
              { id: '7', title: 'Monitoring', duration: 75 },
              { id: '8', title: 'Incident Response', duration: 85 },
              { id: '9', title: 'Audit de sécurité', duration: 70 }
            ]
          },
          moduleProgress: [
            { moduleId: '5', title: 'Architecture réseau', completed: true, score: 88, completedAt: '2024-01-18T16:00:00Z' },
            { moduleId: '6', title: 'Pare-feu et VPN', completed: true, score: 91, completedAt: '2024-01-19T12:00:00Z' },
            { moduleId: '7', title: 'Monitoring', completed: false },
            { moduleId: '8', title: 'Incident Response', completed: false },
            { moduleId: '9', title: 'Audit de sécurité', completed: false }
          ]
        }
      ];

      const mockCertificates: Certificate[] = [
        {
          id: '1',
          certificateNumber: 'EACP-2024-001-ABC123',
          issuedAt: '2024-01-10T12:00:00Z',
          formation: {
            title: 'Sensibilisation aux Menaces Numériques',
            instructor: { name: 'Dr. Marie Dubois' }
          }
        }
      ];

      const mockStats: Stats = {
        totalFormations: 5,
        completedFormations: 1,
        totalCertificates: 1,
        totalTimeSpent: 360,
        averageScore: 85.2,
        currentStreak: 7
      };

      setProgressData(mockProgress);
      setCertificates(mockCertificates);
      setStats(mockStats);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mon Tableau de Bord</h1>
                <p className="text-gray-600 mt-1">Suivez votre progression et gérez vos formations</p>
              </div>
              {stats && (
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span>{stats.currentStreak} jours de suite</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{Math.round(stats.totalTimeSpent / 60)}h d'apprentissage</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="mt-6">
              <nav className="flex space-x-8">
                {[
                  { key: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
                  { key: 'progress', label: 'Mes Formations', icon: BookOpen },
                  { key: 'certificates', label: 'Certificats', icon: Award }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={BookOpen}
                title="Formations inscrites"
                value={stats.totalFormations}
                subtitle="Formations actives"
                color="blue"
                trend={15}
              />
              <StatCard
                icon={Trophy}
                title="Formations complétées"
                value={stats.completedFormations}
                subtitle="Certifiées avec succès"
                color="green"
                trend={25}
              />
              <StatCard
                icon={Award}
                title="Certificats obtenus"
                value={stats.totalCertificates}
                subtitle="Validés et téléchargeables"
                color="purple"
              />
              <StatCard
                icon={Target}
                title="Score moyen"
                value={`${stats.averageScore.toFixed(1)}%`}
                subtitle="Sur tous les quiz"
                color="orange"
                trend={8}
              />
            </div>

            {/* Recent Activity & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Summary */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Formations en cours</h3>
                <div className="space-y-4">
                  {progressData.slice(0, 3).map((progress) => (
                    <div key={progress.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{progress.formation.title}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>{progress.completedModules}/{progress.formation.modules.length} modules</span>
                          <span>{Math.round(progress.timeSpent / 60)}h passées</span>
                        </div>
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <ProgressCircle percentage={progress.progressPercentage} size={50} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Parcourir les formations</span>
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>Mes certificats</span>
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>Voir mes statistiques</span>
                  </button>
                </div>

                {/* Achievement */}
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <Medal className="h-5 w-5" />
                    <span className="font-medium">Streak de {stats.currentStreak} jours !</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Continuez comme ça pour débloquer des récompenses !
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Mes Formations</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Explorer les formations</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {progressData.map((progress) => (
                <FormationProgressCard key={progress.id} progress={progress} />
              ))}
            </div>

            {progressData.length === 0 && (
              <div className="text-center py-12">
                <BookMarked className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune formation en cours
                </h3>
                <p className="text-gray-600 mb-4">
                  Commencez votre apprentissage dès maintenant !
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Parcourir les formations
                </button>
              </div>
            )}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Mes Certificats</h2>
              <div className="text-sm text-gray-600">
                {certificates.length} certificat{certificates.length > 1 ? 's' : ''} obtenu{certificates.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>

            {certificates.length === 0 && (
              <div className="text-center py-12">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun certificat encore
                </h3>
                <p className="text-gray-600 mb-4">
                  Complétez vos formations pour obtenir des certificats !
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Voir les formations disponibles
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
