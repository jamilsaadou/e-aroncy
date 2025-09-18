'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '../../components/SessionProvider';
import { 
  User, 
  Mail, 
  Building, 
  Shield, 
  Calendar, 
  Activity, 
  Settings, 
  Save,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit3
} from 'lucide-react';

interface UserStats {
  totalEnrollments: number;
  completedFormations: number;
  certificatesEarned: number;
  totalTimeSpent: number;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange?: string;
  failedLoginAttempts: number;
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // États pour les formulaires
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        organization: user.organization || ''
      });
      
      // Charger les statistiques et paramètres de sécurité
      loadUserStats();
      loadSecuritySettings();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const loadSecuritySettings = async () => {
    try {
      const response = await fetch('/api/user/security', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const security = await response.json();
        setSecuritySettings(security);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres de sécurité:', error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
        setIsEditing(false);
        // Recharger la session pour mettre à jour les données utilisateur
        window.location.reload();
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
        setShowPasswordForm(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        loadSecuritySettings(); // Recharger les paramètres de sécurité
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la modification' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'INSTRUCTOR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur';
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'INSTRUCTOR':
        return 'Instructeur';
      default:
        return 'Étudiant';
    }
  };

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600 mb-8">Vous devez être connecté pour accéder à cette page.</p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 mt-1">{user.email}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(user.role)}`}>
                    <Shield className="h-4 w-4 mr-1" />
                    {getRoleLabel(user.role)}
                  </span>
                  {user.twoFactorEnabled && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      2FA Activé
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
              {message.type === 'error' && <XCircle className="h-5 w-5 mr-2" />}
              {message.type === 'info' && <AlertCircle className="h-5 w-5 mr-2" />}
              {message.text}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informations personnelles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informations personnelles
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  {isEditing ? 'Annuler' : 'Modifier'}
                </button>
              </div>
              
              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organisation
                      </label>
                      <input
                        type="text"
                        value={profileForm.organization}
                        onChange={(e) => setProfileForm({ ...profileForm, organization: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nom de votre organisation"
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Nom complet</p>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {user.organization && (
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Organisation</p>
                          <p className="font-medium">{user.organization}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Statut du compte</p>
                        <p className="font-medium">Actif</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sécurité */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Sécurité
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Mot de passe */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Mot de passe</h3>
                      <p className="text-sm text-gray-500">
                        {securitySettings?.lastPasswordChange 
                          ? `Dernière modification: ${new Date(securitySettings.lastPasswordChange).toLocaleDateString('fr-FR')}`
                          : 'Modifiez votre mot de passe régulièrement'
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {showPasswordForm ? 'Annuler' : 'Modifier'}
                    </button>
                  </div>
                  
                  {showPasswordForm && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de passe actuel
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nouveau mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmer le nouveau mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSaving ? 'Modification...' : 'Modifier le mot de passe'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Authentification à deux facteurs */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Authentification à deux facteurs</h3>
                      <p className="text-sm text-gray-500">
                        {user.twoFactorEnabled 
                          ? 'Votre compte est protégé par l\'authentification à deux facteurs'
                          : 'Ajoutez une couche de sécurité supplémentaire à votre compte'
                        }
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.twoFactorEnabled ? (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Activé
                        </span>
                      ) : (
                        <button
                          onClick={() => window.location.href = '/settings/2fa'}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Activer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-8">
            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Statistiques
                </h2>
              </div>
              
              <div className="p-6">
                {userStats ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{userStats.totalEnrollments}</div>
                      <div className="text-sm text-gray-500">Formations inscrites</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{userStats.completedFormations}</div>
                      <div className="text-sm text-gray-500">Formations terminées</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{userStats.certificatesEarned}</div>
                      <div className="text-sm text-gray-500">Certificats obtenus</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{formatTimeSpent(userStats.totalTimeSpent)}</div>
                      <div className="text-sm text-gray-500">Temps d'apprentissage</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chargement des statistiques...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Actions rapides
                </h2>
              </div>
              
              <div className="p-6 space-y-3">
                <a
                  href="/dashboard"
                  className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">Tableau de bord</div>
                  <div className="text-sm text-gray-500">Voir vos formations et progrès</div>
                </a>
                
                <a
                  href="/settings"
                  className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">Paramètres</div>
                  <div className="text-sm text-gray-500">Gérer vos préférences</div>
                </a>
                
                {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'INSTRUCTOR') && (
                  <a
                    href="/admin"
                    className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Administration</div>
                    <div className="text-sm text-gray-500">Accéder au panel admin</div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
