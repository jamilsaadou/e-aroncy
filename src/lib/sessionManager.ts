'use client';

export interface SessionUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  organization: string;
  twoFactorEnabled: boolean;
}

export interface SessionData {
  authenticated: boolean;
  user: SessionUser | null;
  sessionExpiry: string | null;
  timestamp: string;
}

class SessionManager {
  private checkInterval: NodeJS.Timeout | null = null;
  private warningShown: boolean = false;
  private readonly CHECK_INTERVAL = 60000; // 1 minute
  private readonly WARNING_TIME = 5 * 60 * 1000; // 5 minutes avant expiration

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeEventListeners();
    }
  }

  // Initialiser les écouteurs d'événements
  private initializeEventListeners(): void {
    // Écouter les changements de visibilité de la page
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkSessionStatus();
      }
    });

    // Écouter les événements de focus
    window.addEventListener('focus', () => {
      this.checkSessionStatus();
    });

    // Écouter les événements de stockage (pour la synchronisation entre onglets)
    window.addEventListener('storage', (e) => {
      if (e.key === 'session_expired') {
        this.handleSessionExpired();
      }
    });
  }

  // Démarrer le monitoring de session
  startSessionMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkSessionStatus();
    }, this.CHECK_INTERVAL);

    // Vérification initiale
    this.checkSessionStatus();
  }

  // Arrêter le monitoring de session
  stopSessionMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.warningShown = false;
  }

  // Vérifier le statut de la session
  async checkSessionStatus(): Promise<SessionData | null> {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: SessionData = await response.json();

      if (!data.authenticated) {
        // Arrêter le monitoring si la session n'est pas authentifiée
        this.stopSessionMonitoring();
        this.clearUserData();
        return null;
      }

      // Vérifier si on doit afficher l'avertissement d'expiration
      if (data.sessionExpiry) {
        const expiryTime = new Date(data.sessionExpiry).getTime();
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        if (timeUntilExpiry <= this.WARNING_TIME && !this.warningShown) {
          this.showExpiryWarning(Math.floor(timeUntilExpiry / 60000)); // minutes restantes
        }
      }

      // Mettre à jour les données utilisateur dans le localStorage
      this.updateUserData(data);

      return data;

    } catch (error) {
      console.error('Erreur vérification session:', error);
      // Arrêter le monitoring en cas d'erreur
      this.stopSessionMonitoring();
      this.clearUserData();
      return null;
    }
  }

  // Afficher l'avertissement d'expiration
  private showExpiryWarning(minutesLeft: number): void {
    this.warningShown = true;

    // Créer la modal d'avertissement
    const modal = document.createElement('div');
    modal.id = 'session-warning-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div class="flex items-center mb-4">
          <div class="bg-yellow-100 rounded-full p-2 mr-3">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Session bientôt expirée</h3>
        </div>
        <p class="text-gray-600 mb-6">
          Votre session va expirer dans ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}. 
          Souhaitez-vous prolonger votre session ?
        </p>
        <div class="flex space-x-3">
          <button id="extend-session" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Prolonger la session
          </button>
          <button id="logout-now" class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
            Se déconnecter
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Gestionnaires d'événements pour les boutons
    const extendButton = document.getElementById('extend-session');
    const logoutButton = document.getElementById('logout-now');

    extendButton?.addEventListener('click', () => {
      this.extendSession();
      document.body.removeChild(modal);
    });

    logoutButton?.addEventListener('click', () => {
      this.logout();
    });

    // Fermer la modal en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        this.warningShown = false;
      }
    });
  }

  // Prolonger la session
  async extendSession(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        this.warningShown = false;
        console.log('Session prolongée avec succès');
        return true;
      } else {
        console.error('Erreur lors de la prolongation de session');
        return false;
      }
    } catch (error) {
      console.error('Erreur prolongation session:', error);
      return false;
    }
  }

  // Gérer l'expiration de session
  private handleSessionExpired(): void {
    this.stopSessionMonitoring();
    
    // Nettoyer les données locales
    this.clearUserData();
    
    // Notifier les autres onglets
    if (typeof window !== 'undefined') {
      localStorage.setItem('session_expired', Date.now().toString());
      localStorage.removeItem('session_expired');
    }
    
    // Rediriger vers la page de connexion
    window.location.href = '/login?expired=true';
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Erreur logout:', error);
    } finally {
      this.handleSessionExpired();
    }
  }

  // Mettre à jour les données utilisateur
  private updateUserData(sessionData: SessionData): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(sessionData.user));
      localStorage.setItem('sessionExpiry', sessionData.sessionExpiry || '');
    }
  }

  // Nettoyer les données utilisateur
  private clearUserData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('sessionExpiry');
      localStorage.removeItem('auth-token');
    }
  }

  // Obtenir les données utilisateur depuis le localStorage
  getUserData(): SessionUser | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erreur lecture données utilisateur:', error);
      return null;
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return this.getUserData() !== null;
  }

  // Auto-save des données de formulaire
  setupFormAutoSave(): void {
    if (typeof window === 'undefined') return;

    const forms = document.querySelectorAll('form[data-autosave]');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        input.addEventListener('input', this.debounce(() => {
          this.saveFormData(form.id, (input as HTMLInputElement).name, (input as HTMLInputElement).value);
        }, 1000) as EventListener);
      });
    });
  }

  // Sauvegarder les données de formulaire
  private saveFormData(formId: string, fieldName: string, value: string): void {
    if (typeof window === 'undefined') return;
    
    const key = `autosave_${formId}_${fieldName}`;
    localStorage.setItem(key, value);
  }

  // Restaurer les données de formulaire
  restoreFormData(formId: string): void {
    if (typeof window === 'undefined') return;

    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const fieldName = (input as HTMLInputElement).name;
      if (fieldName) {
        const key = `autosave_${formId}_${fieldName}`;
        const savedValue = localStorage.getItem(key);
        if (savedValue) {
          (input as HTMLInputElement).value = savedValue;
        }
      }
    });
  }

  // Utilitaire debounce
  private debounce(func: Function, wait: number): Function {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Instance singleton
const sessionManager = new SessionManager();

export default sessionManager;
