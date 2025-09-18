'use client';

import React, { useEffect, useState } from 'react';
import { useRequireAuth, useSession } from '../../components/SessionProvider';
import { UserProfile, UserName } from '../../components/UserProfile';
import { RoleBasedNavigation, QuickActions } from '../../components/RoleBasedNavigation';
import { 
  BookOpen, 
  Shield, 
  Users, 
  Award, 
  TrendingUp, 
  Clock,
  Bell
} from 'lucide-react';

function Dashboard() {
  // Protéger la route - rediriger vers /login si non authentifié
  const { isAuthenticated, isLoading } = useRequireAuth('/login');
  const { user } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // La redirection est gérée par useRequireAuth
  }

  // Stats en direct
  const [stats, setStats] = useState<{
    totalEnrollments: number;
    completedFormations: number;
    certificatesEarned: number;
    totalTimeSpent: number; // minutes
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [enrollments, setEnrollments] = useState<Array<{ id: string; title: string; progress: number; formationId: string }>>([]);
  const [enrLoading, setEnrLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      try {
        setStatsLoading(true);
        setStatsError('');
        const res = await fetch('/api/user/stats', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur chargement statistiques');
        if (mounted) setStats(data);
      } catch (e: any) {
        if (mounted) setStatsError(e.message || 'Erreur chargement statistiques');
      } finally {
        if (mounted) setStatsLoading(false);
      }
    }
    if (isAuthenticated) loadStats();
    return () => { mounted = false; };
  }, [isAuthenticated]);

  useEffect(() => {
    let mounted = true;
    async function loadEnrollments() {
      try {
        setEnrLoading(true);
        const res = await fetch('/api/user/enrollments', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erreur chargement formations');
        if (mounted) setEnrollments(data.items || []);
      } catch (e) {
        // silencieux, section peut rester vide
      } finally {
        if (mounted) setEnrLoading(false);
      }
    }
    if (!hasAdminAccess && isAuthenticated) loadEnrollments();
    return () => { mounted = false; };
  }, [hasAdminAccess, isAuthenticated]);

  // Vérifier si l'utilisateur a des privilèges administratifs
  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
  const isInstructor = user.role === 'INSTRUCTOR';
  const hasAdminAccess = isAdmin || isInstructor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                E-ARONCY
              </span>
            </div>

            {/* User Profile */}
            <UserProfile />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, <UserName className="text-blue-600" />!
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de votre progression en cybersécurité.
          </p>
        </div>

        {/* Stats Cards (données réelles) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Formations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '—' : (stats?.totalEnrollments ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificats</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? '—' : (stats?.certificatesEarned ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progression</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading
                    ? '—'
                    : (() => {
                        const total = stats?.totalEnrollments ?? 0;
                        const done = stats?.completedFormations ?? 0;
                        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                        return `${pct}%`;
                      })()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Temps d'étude</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading
                    ? '—'
                    : (() => {
                        const mins = stats?.totalTimeSpent ?? 0;
                        const h = Math.floor(mins / 60);
                        const m = mins % 60;
                        return h > 0 ? `${h}h${m ? ' ' + m + 'm' : ''}` : `${m}m`;
                      })()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {statsError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {statsError}
          </div>
        )}

        {/* Navigation basée sur les rôles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {hasAdminAccess ? 'Outils d\'administration' : 'Mes formations et certificats'}
          </h2>
          <RoleBasedNavigation variant="grid" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formations en cours */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {hasAdminAccess ? 'Activité récente' : 'Formations en cours'}
                </h2>
              </div>
              <div className="p-6">
                {!hasAdminAccess ? (
                  // Contenu pour les apprenants
                  <div className="space-y-4">
                    {enrLoading && (
                      <div className="text-sm text-gray-500">Chargement des formations en cours...</div>
                    )}
                    {!enrLoading && enrollments.length === 0 && (
                      <div className="text-sm text-gray-500">Aucune formation en cours.</div>
                    )}
                    {enrollments.map((e) => (
                      <div key={e.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Shield className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{e.title}</h3>
                            <p className="text-xs text-gray-500">En cours</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">{e.progress}%</div>
                          <div className="w-28 bg-gray-200 rounded-full h-2 mt-1">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${e.progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Contenu pour les administrateurs/instructeurs
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Nouveaux utilisateurs inscrits</h3>
                          <p className="text-sm text-gray-600">5 nouvelles inscriptions aujourd'hui</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">5</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <BookOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Formations actives</h3>
                          <p className="text-sm text-gray-600">12 formations en cours</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">12</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Award className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Certificats délivrés</h3>
                          <p className="text-sm text-gray-600">28 certificats ce mois</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">28</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-1 rounded-full">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        {hasAdminAccess ? 'Nouvelle inscription en attente' : 'Nouveau module disponible'}
                      </p>
                      <p className="text-xs text-gray-500">Il y a 2 heures</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-1 rounded-full">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        {hasAdminAccess ? 'Formation publiée avec succès' : 'Certificat obtenu'}
                      </p>
                      <p className="text-xs text-gray-500">Hier</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides basées sur les rôles */}
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
