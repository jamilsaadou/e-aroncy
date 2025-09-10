'use client';

import React from 'react';
import { useSession } from './SessionProvider';
import { 
  BookOpen, 
  Shield, 
  Users, 
  Award, 
  FileText,
  GraduationCap,
  BarChart3,
  UserCheck,
  Settings,
  Plus,
  Home,
  Bell
} from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  roles: string[];
}

const navigationItems: NavigationItem[] = [
  // Navigation pour tous
  {
    label: 'Accueil',
    href: '/dashboard',
    icon: <Home className="h-5 w-5" />,
    description: 'Tableau de bord principal',
    roles: ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR', 'STUDENT']
  },
  {
    label: 'Mes Formations',
    href: '/formations',
    icon: <BookOpen className="h-5 w-5" />,
    description: 'Formations suivies et disponibles',
    roles: ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR', 'STUDENT']
  },
  {
    label: 'Mes Certificats',
    href: '/certificates',
    icon: <Award className="h-5 w-5" />,
    description: 'Certificats obtenus',
    roles: ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR', 'STUDENT']
  },

  // Navigation pour administrateurs et instructeurs
  {
    label: 'Créer une Actualité',
    href: '/admin/articles/new',
    icon: <Plus className="h-5 w-5" />,
    description: 'Publier une nouvelle actualité',
    roles: ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR']
  },
  {
    label: 'Créer une Formation',
    href: '/admin/formations/new',
    icon: <GraduationCap className="h-5 w-5" />,
    description: 'Créer un nouveau cours',
    roles: ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR']
  },
  {
    label: 'Gérer les Articles',
    href: '/admin/articles',
    icon: <FileText className="h-5 w-5" />,
    description: 'Gérer toutes les actualités',
    roles: ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR']
  },
  {
    label: 'Gérer les Formations',
    href: '/admin/formations',
    icon: <BookOpen className="h-5 w-5" />,
    description: 'Gérer tous les cours',
    roles: ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR']
  },

  // Navigation pour administrateurs uniquement
  {
    label: 'Gérer les Utilisateurs',
    href: '/admin/users',
    icon: <UserCheck className="h-5 w-5" />,
    description: 'Administration des comptes',
    roles: ['ADMIN', 'SUPER_ADMIN']
  },
  {
    label: 'Statistiques',
    href: '/admin/statistiques',
    icon: <BarChart3 className="h-5 w-5" />,
    description: 'Analyses et rapports',
    roles: ['ADMIN', 'SUPER_ADMIN']
  },
  {
    label: 'Paramètres Système',
    href: '/admin/parametres',
    icon: <Settings className="h-5 w-5" />,
    description: 'Configuration de la plateforme',
    roles: ['ADMIN', 'SUPER_ADMIN']
  }
];

interface RoleBasedNavigationProps {
  className?: string;
  variant?: 'sidebar' | 'grid' | 'horizontal';
}

export const RoleBasedNavigation: React.FC<RoleBasedNavigationProps> = ({ 
  className = '', 
  variant = 'grid' 
}) => {
  const { user, isAuthenticated } = useSession();

  if (!isAuthenticated || !user) {
    return null;
  }

  // Filtrer les éléments de navigation selon le rôle
  const allowedItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  if (variant === 'sidebar') {
    return (
      <nav className={`space-y-2 ${className}`}>
        {allowedItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors group"
          >
            <div className="text-gray-400 group-hover:text-gray-600">
              {item.icon}
            </div>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    );
  }

  if (variant === 'horizontal') {
    return (
      <nav className={`flex space-x-4 overflow-x-auto ${className}`}>
        {allowedItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap"
          >
            <div className="text-gray-400">
              {item.icon}
            </div>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    );
  }

  // Variant 'grid' par défaut
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {allowedItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
              <div className="text-blue-600">
                {item.icon}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {item.label}
              </h3>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

// Composant pour afficher les actions rapides selon le rôle
export const QuickActions: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { user, isAuthenticated } = useSession();

  if (!isAuthenticated || !user) {
    return null;
  }

  const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
  const isInstructor = user.role === 'INSTRUCTOR';
  const hasAdminAccess = isAdmin || isInstructor;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Actions rapides</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {/* Actions pour les apprenants */}
          {!hasAdminAccess && (
            <>
              <button 
                onClick={() => window.location.href = '/formations'}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Mes Formations
              </button>
              <button 
                onClick={() => window.location.href = '/certificates'}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Award className="h-4 w-4 mr-2" />
                Mes Certificats
              </button>
            </>
          )}

          {/* Actions pour les administrateurs et instructeurs */}
          {hasAdminAccess && (
            <>
              <button 
                onClick={() => window.location.href = '/admin/articles/new'}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer une actualité
              </button>
              <button 
                onClick={() => window.location.href = '/admin/formations/new'}
                className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Créer une formation
              </button>
              {isAdmin && (
                <>
                  <button 
                    onClick={() => window.location.href = '/admin/users'}
                    className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Gérer les utilisateurs
                  </button>
                  <button 
                    onClick={() => window.location.href = '/admin/statistiques'}
                    className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Statistiques
                  </button>
                </>
              )}
            </>
          )}

          {/* Actions communes */}
          <button 
            onClick={() => window.location.href = '/settings'}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedNavigation;
