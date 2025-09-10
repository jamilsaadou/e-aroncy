'use client';

import React, { useState } from 'react';
import { useSession } from './SessionProvider';
import { User, LogOut, Settings, Shield, ChevronDown } from 'lucide-react';

interface UserProfileProps {
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ className = '' }) => {
  const { user, logout, isAuthenticated, isLoading } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getUserInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeColor = () => {
    switch (user.role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800';
      case 'INSTRUCTOR':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
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

  return (
    <div className={`relative ${className}`}>
      {/* User Info Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {getUserInitials()}
          </div>
        </div>

        {/* User Details */}
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-xs text-gray-500">
            {user.organization}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {getUserInitials()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {user.email}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {user.organization}
                  </div>
                </div>
              </div>
              
              {/* Role Badge */}
              <div className="mt-3 flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {getRoleLabel()}
                </span>
                {user.twoFactorEnabled && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    2FA Activé
                  </span>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  window.location.href = '/profile';
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User className="h-4 w-4 mr-3" />
                Mon Profil
              </button>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  window.location.href = '/settings';
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-4 w-4 mr-3" />
                Paramètres
              </button>

              {/* Menu administrateur/instructeur */}
              {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'INSTRUCTOR') && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="px-4 py-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Administration
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      window.location.href = '/admin';
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Shield className="h-4 w-4 mr-3" />
                    Panel Admin
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      window.location.href = '/admin/articles/new';
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Créer une actualité
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      window.location.href = '/admin/formations/new';
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Créer une formation
                  </button>

                  {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        window.location.href = '/admin/users';
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Gérer les utilisateurs
                    </button>
                  )}
                </>
              )}

              <div className="border-t border-gray-200 my-2"></div>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogout();
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Se déconnecter
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Composant simple pour afficher juste le nom
export const UserName: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { user, isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <span className={className}>
      {user.firstName} {user.lastName}
    </span>
  );
};

// Composant pour afficher les informations de base
export const UserInfo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { user, isAuthenticated, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 w-32 bg-gray-300 rounded mb-1"></div>
        <div className="h-3 w-24 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className={className}>
      <div className="text-sm font-medium text-gray-900">
        {user.firstName} {user.lastName}
      </div>
      <div className="text-xs text-gray-500">
        {user.organization}
      </div>
    </div>
  );
};

export default UserProfile;
