"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { useRequireRole } from "../../../../components/SessionProvider";
import { 
  ArrowLeft,
  User,
  Mail,
  Building,
  Calendar,
  Shield,
  Clock,
  Activity,
  Edit,
  Trash2,
  Loader,
  AlertCircle,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  RotateCcw,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  Globe,
  Save,
  X
} from "lucide-react";

interface UserDetails {
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
  updatedAt: string;
  failedLoginAttempts: number;
  lockUntil: string | null;
  sessions: Array<{
    id: string;
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    lastActivity: string;
    createdAt: string;
  }>;
  activities: Array<{
    id: string;
    action: string;
    details: string | null;
    timestamp: string;
    success: boolean;
    ipAddress: string | null;
  }>;
}

interface UserStats {
  totalSessions: number;
  activeSessions: number;
  totalActivities: number;
  accountAge: number;
  lastActivityDays: number | null;
}

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { hasRole } = useRequireRole(['ADMIN'], '/dashboard');
  
  const [user, setUser] = useState<UserDetails | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSessions, setShowSessions] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    role: 'STUDENT',
    status: 'ACTIVE',
    emailVerified: false,
    twoFactorEnabled: false,
    unlockAccount: false,
  });
  const [pwdResetLoading, setPwdResetLoading] = useState(false);
  const [pwdSet, setPwdSet] = useState({ newPassword: '', confirm: '', notify: false });

  const userId = params.id as string;

  // Charger les détails de l'utilisateur
  const loadUserDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/admin/users/${userId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Utilisateur non trouvé');
        }
        throw new Error('Erreur lors du chargement des détails');
      }

      const data = await response.json();
      setUser(data.user);
      setStats(data.stats);

    } catch (error: any) {
      console.error('Erreur chargement détails utilisateur:', error);
      setError(error.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasRole && userId) {
      loadUserDetails();
    }
  }, [hasRole, userId]);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        organization: user.organization || '',
        role: user.role || 'STUDENT',
        status: user.status || 'ACTIVE',
        emailVerified: !!user.emailVerified,
        twoFactorEnabled: !!user.twoFactorEnabled,
        unlockAccount: false,
      });
    }
  }, [user]);

  if (!hasRole) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 lg:flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center pt-20 lg:pt-0">
          <div className="text-center">
            <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Chargement des détails utilisateur...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 lg:flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center pt-20 lg:pt-0">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadUserDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
            >
              Réessayer
            </button>
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !stats) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
          <CheckCircle className="h-4 w-4 mr-1" />Actif
        </span>;
      case 'inactive':
        return <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
          <XCircle className="h-4 w-4 mr-1" />Inactif
        </span>;
      case 'pending':
        return <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
          <Clock className="h-4 w-4 mr-1" />En attente
        </span>;
      case 'suspended':
        return <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
          <Lock className="h-4 w-4 mr-1" />Suspendu
        </span>;
      default:
        return <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
          <Shield className="h-4 w-4 mr-1" />Administrateur
        </span>;
      case 'INSTRUCTOR':
        return <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
          <User className="h-4 w-4 mr-1" />Instructeur
        </span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
          <User className="h-4 w-4 mr-1" />Étudiant
        </span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return 'Jamais connecté';
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'À l\'instant';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return formatDate(lastLogin);
  };

  const parseUserAgent = (userAgent: string) => {
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return { type: 'mobile', icon: Smartphone };
    }
    return { type: 'desktop', icon: Monitor };
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin/users"
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-600 mt-1">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Modifier</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={async () => {
                          try {
                            setSaving(true);
                            setError('');
                            const res = await fetch(`/api/admin/users/${userId}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({
                                ...form,
                                ...(pwdSet.newPassword && pwdSet.newPassword === pwdSet.confirm
                                  ? { resetPassword: { newPassword: pwdSet.newPassword, notify: pwdSet.notify } }
                                  : {}),
                              }),
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.error || 'Échec de la mise à jour');
                            await loadUserDetails();
                            setEditing(false);
                            setPwdSet({ newPassword: '', confirm: '', notify: false });
                          } catch (e: any) {
                            setError(e.message || 'Erreur lors de la mise à jour');
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4" />
                        <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
                      </button>
                      <button
                        onClick={() => { setEditing(false); setForm({
                          firstName: user.firstName || '',
                          lastName: user.lastName || '',
                          organization: user.organization || '',
                          role: user.role || 'STUDENT',
                          status: user.status || 'ACTIVE',
                          emailVerified: !!user.emailVerified,
                          twoFactorEnabled: !!user.twoFactorEnabled,
                          unlockAccount: false,
                        }); }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Annuler</span>
                      </button>
                    </div>
                  )}
                  <button
                    onClick={async () => {
                      const ok = confirm(`Supprimer l'utilisateur ${user.email} ? Cette action est irréversible.`);
                      if (!ok) return;
                      try {
                        const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE', credentials: 'include' });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || 'Échec de la suppression');
                        router.replace('/admin/users');
                      } catch (e: any) {
                        alert(e.message || 'Erreur lors de la suppression');
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* User Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Profile Card */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Informations personnelles</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Prénom</label>
                        <input
                          disabled={!editing}
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg ${editing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Nom</label>
                        <input
                          disabled={!editing}
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg ${editing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Organisation</label>
                        <input
                          disabled={!editing}
                          value={form.organization}
                          onChange={(e) => setForm({ ...form, organization: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg ${editing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900">{user.email}</p>
                          <label className="text-xs text-gray-500 flex items-center space-x-2">
                            <input
                              type="checkbox"
                              disabled={!editing}
                              checked={form.emailVerified}
                              onChange={(e) => setForm({ ...form, emailVerified: e.target.checked })}
                            />
                            <span>{form.emailVerified ? 'Email vérifié' : 'Email non vérifié'}</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                          <p className="text-xs text-gray-500">Membre depuis {stats.accountAge} jours</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Sécurité</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Rôle</label>
                        <select
                          disabled={!editing}
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg ${editing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="INSTRUCTOR">Instructeur</option>
                          <option value="STUDENT">Étudiant</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Statut</label>
                        <select
                          disabled={!editing}
                          value={form.status}
                          onChange={(e) => setForm({ ...form, status: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg ${editing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <option value="ACTIVE">Actif</option>
                          <option value="PENDING">En attente</option>
                          <option value="SUSPENDED">Suspendu</option>
                          <option value="INACTIVE">Inactif</option>
                        </select>
                      </div>
                      {/* Reset password controls */}
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Réinitialiser le mot de passe</h4>
                        <div className="flex items-center gap-2 mb-3">
                          <button
                            disabled={pwdResetLoading}
                            onClick={async () => {
                              if (!confirm("Envoyer un lien sécurisé de réinitialisation au propriétaire du compte ?")) return;
                              try {
                                setPwdResetLoading(true);
                                const res = await fetch(`/api/admin/users/${userId}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  credentials: 'include',
                                  body: JSON.stringify({ resetPassword: { generateLink: true } }),
                                });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error || 'Échec de l\'envoi');
                                alert('Lien de réinitialisation envoyé par email.');
                              } catch (e: any) {
                                alert(e.message || 'Erreur lors de l\'envoi du lien');
                              } finally {
                                setPwdResetLoading(false);
                              }
                            }}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {pwdResetLoading ? 'Envoi...' : 'Envoyer un lien de réinitialisation'}
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Nouveau mot de passe</label>
                            <input
                              type="password"
                              disabled={!editing}
                              value={pwdSet.newPassword}
                              onChange={(e) => setPwdSet({ ...pwdSet, newPassword: e.target.value })}
                              className={`w-full px-3 py-2 border rounded-lg ${editing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                              placeholder="Saisir un nouveau mot de passe"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Confirmer</label>
                            <input
                              type="password"
                              disabled={!editing}
                              value={pwdSet.confirm}
                              onChange={(e) => setPwdSet({ ...pwdSet, confirm: e.target.value })}
                              className={`w-full px-3 py-2 border rounded-lg ${editing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                              placeholder="Confirmer le mot de passe"
                            />
                          </div>
                        </div>
                        <label className="mt-2 inline-flex items-center gap-2 text-xs text-gray-700">
                          <input
                            type="checkbox"
                            disabled={!editing}
                            checked={pwdSet.notify}
                            onChange={(e) => setPwdSet({ ...pwdSet, notify: e.target.checked })}
                          />
                          Envoyer le nouveau mot de passe par email
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <label className="text-sm text-gray-900 flex items-center space-x-2">
                          <input
                            type="checkbox"
                            disabled={!editing}
                            checked={form.twoFactorEnabled}
                            onChange={(e) => setForm({ ...form, twoFactorEnabled: e.target.checked })}
                          />
                          <span>2FA activée</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Lock className="h-4 w-4 text-gray-400" />
                        <label className="text-sm text-gray-900 flex items-center space-x-2">
                          <input
                            type="checkbox"
                            disabled={!editing}
                            checked={form.unlockAccount}
                            onChange={(e) => setForm({ ...form, unlockAccount: e.target.checked })}
                          />
                          <span>Déverrouiller le compte</span>
                        </label>
                        <span className="text-xs text-gray-500">({user.failedLoginAttempts} tentatives, {user.lockUntil && new Date(user.lockUntil) > new Date() ? 'verrouillé' : 'déverrouillé'})</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Activity className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900">{formatLastLogin(user.lastLogin)}</p>
                          <p className="text-xs text-gray-500">Dernière connexion</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sessions totales</span>
                    <span className="text-sm font-medium text-gray-900">{stats.totalSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sessions actives</span>
                    <span className="text-sm font-medium text-blue-600">{stats.activeSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Activités totales</span>
                    <span className="text-sm font-medium text-gray-900">{stats.totalActivities}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Âge du compte</span>
                    <span className="text-sm font-medium text-gray-900">{stats.accountAge} jours</span>
                  </div>
                  {stats.lastActivityDays !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Dernière activité</span>
                      <span className="text-sm font-medium text-gray-900">
                        {stats.lastActivityDays === 0 ? 'Aujourd\'hui' : `Il y a ${stats.lastActivityDays} jour${stats.lastActivityDays > 1 ? 's' : ''}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sessions and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Sessions */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sessions actives ({user.sessions.length})
                    </h3>
                    <button
                      onClick={() => setShowSessions(!showSessions)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {showSessions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {showSessions && (
                  <div className="p-6">
                    {user.sessions.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Aucune session active</p>
                    ) : (
                      <div className="space-y-3">
                        {user.sessions.map((session) => {
                          const deviceInfo = parseUserAgent(session.userAgent);
                          return (
                            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <deviceInfo.icon className="h-4 w-4 text-gray-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{session.ipAddress}</p>
                                  <p className="text-xs text-gray-500">
                                    Dernière activité: {formatDate(session.lastActivity)}
                                  </p>
                                </div>
                              </div>
                              <button className="text-red-600 hover:text-red-800 text-xs">
                                Révoquer
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Activités récentes ({user.activities.length})
                    </h3>
                    <button
                      onClick={() => setShowActivities(!showActivities)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {showActivities ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {showActivities && (
                  <div className="p-6">
                    {user.activities.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
                    ) : (
                      <div className="space-y-3">
                        {user.activities.slice(0, 10).map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`p-1 rounded-full ${activity.success ? 'bg-green-100' : 'bg-red-100'}`}>
                              <div className={`w-2 h-2 rounded-full ${activity.success ? 'bg-green-600' : 'bg-red-600'}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                              <p className="text-xs text-gray-500">
                                {formatDate(activity.timestamp)}
                                {activity.ipAddress && ` • ${activity.ipAddress}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
