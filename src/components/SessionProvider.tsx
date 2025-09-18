'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import sessionManager, { SessionUser, SessionData } from '../lib/sessionManager';

interface SessionContextType {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, totpCode?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<SessionData | null>;
  extendSession: () => Promise<boolean>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Toujours initialiser la session pour connaître l'état d'authentification
    initializeSession();
    
    // Ne démarrer le monitoring que si on n'est pas sur une page d'auth
    const isAuthPage = typeof window !== 'undefined' && 
      (window.location.pathname === '/login' || 
       window.location.pathname === '/register' ||
       window.location.pathname.startsWith('/forgot-password'));

    if (!isAuthPage) {
      // Démarrer le monitoring de session seulement sur les autres pages
      sessionManager.startSessionMonitoring();
    }
    
    // Configurer l'auto-save des formulaires
    sessionManager.setupFormAutoSave();

    // Nettoyage au démontage
    return () => {
      sessionManager.stopSessionMonitoring();
    };
  }, []);

  const initializeSession = async () => {
    try {
      // Vérifier s'il y a des données utilisateur en local
      const localUser = sessionManager.getUserData();
      if (localUser) {
        setUser(localUser);
        
        // Vérifier la session côté serveur
        const sessionData = await sessionManager.checkSessionStatus();
        if (sessionData && sessionData.authenticated) {
          setUser(sessionData.user);
        } else {
          setUser(null);
          // Arrêter le monitoring si la session n'est pas valide
          sessionManager.stopSessionMonitoring();
        }
      } else {
        // Pas de données utilisateur locales, vérifier quand même la session
        const sessionData = await sessionManager.checkSessionStatus();
        if (sessionData && sessionData.authenticated) {
          setUser(sessionData.user);
        } else {
          setUser(null);
          // Arrêter le monitoring si aucune session valide
          sessionManager.stopSessionMonitoring();
        }
      }
    } catch (error) {
      console.error('Erreur initialisation session:', error);
      setUser(null);
      // Arrêter le monitoring en cas d'erreur
      sessionManager.stopSessionMonitoring();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, totpCode?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, totpCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        sessionManager.startSessionMonitoring();
        return true;
      } else if (data.requires2FA || data.requiresEmailOTP) {
        // Retourner false mais avec un indicateur spécial pour 2FA
        return false;
      } else {
        console.error('Erreur de connexion:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await sessionManager.logout();
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSession = async (): Promise<SessionData | null> => {
    try {
      const sessionData = await sessionManager.checkSessionStatus();
      if (sessionData && sessionData.authenticated) {
        setUser(sessionData.user);
      } else {
        setUser(null);
      }
      return sessionData;
    } catch (error) {
      console.error('Erreur vérification session:', error);
      setUser(null);
      return null;
    }
  };

  const extendSession = async (): Promise<boolean> => {
    try {
      const success = await sessionManager.extendSession();
      if (success) {
        // Rafraîchir les données de session
        await checkSession();
      }
      return success;
    } catch (error) {
      console.error('Erreur prolongation session:', error);
      return false;
    }
  };

  const contextValue: SessionContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkSession,
    extendSession,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook pour protéger les routes
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useSession();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};

// Hook pour les rôles
export const useRequireRole = (allowedRoles: string[], redirectTo: string = '/') => {
  const { user, isAuthenticated, isLoading } = useSession();
  
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || !allowedRoles.includes(user.role))) {
      window.location.href = redirectTo;
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, redirectTo]);

  return { user, isAuthenticated, isLoading, hasRole: user && allowedRoles.includes(user.role) };
};

export default SessionProvider;
