import React, { useState, useEffect, useContext, createContext } from 'react';
import { 
  Eye, EyeOff, Lock, Mail, User, Building, Shield, 
  Smartphone, Key, QrCode, Copy, Check, AlertCircle,
  Loader2, LogIn, UserPlus, Settings, LogOut
} from 'lucide-react';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
  organization?: string;
  twoFactorEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, totpCode?: string) => Promise<{ requireTwoFactor?: boolean }>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  setup2FA: () => Promise<{ secret: string; qrCode: string; manualEntryKey: string }>;
  verify2FA: (token: string) => Promise<void>;
  disable2FA: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  organization?: string;
}

// Auth API Service
class AuthApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Une erreur est survenue');
    }

    return response.json();
  }

  async login(email: string, password: string, totpCode?: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, totpCode }),
    });
  }

  async register(userData: RegisterData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async setup2FA() {
    return this.request('/auth/setup-2fa', { method: 'POST' });
  }

  async verify2FA(token: string) {
    return this.request('/auth/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async disable2FA() {
    return this.request('/auth/disable-2fa', { method: 'POST' });
  }
}

const authApi = new AuthApiService();

// Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email: string, password: string, totpCode?: string) => {
    const response = await authApi.login(email, password, totpCode);
    
    if (response.requireTwoFactor) {
      return { requireTwoFactor: true };
    }

    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return {};
  };

  const register = async (userData: RegisterData) => {
    const response = await authApi.register(userData);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const setup2FA = async () => {
    return authApi.setup2FA();
  };

  const verify2FA = async (token: string) => {
    await authApi.verify2FA(token);
    if (user) {
      const updatedUser = { ...user, twoFactorEnabled: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const disable2FA = async () => {
    await authApi.disable2FA();
    if (user) {
      const updatedUser = { ...user, twoFactorEnabled: false };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      setup2FA,
      verify2FA,
      disable2FA
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Login Component
export function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    totpCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requireTwoFactor, setRequireTwoFactor] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password, formData.totpCode);
      
      if (result.requireTwoFactor) {
        setRequireTwoFactor(true);
      }
    } catch (error) {
      setErrors({ general: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
        <p className="text-gray-600 mt-2">
          {requireTwoFactor 
            ? 'Entrez votre code d\'authentification' 
            : 'Connectez-vous à votre compte E-ARONCY'}
        </p>
      </div>

      <div className="space-y-6">
        {!requireTwoFactor ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code d'authentification à 6 chiffres
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.totpCode}
                onChange={(e) => handleInputChange('totpCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Entrez le code affiché dans votre application d'authentification.
            </p>
          </div>
        )}

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Connexion...</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Se connecter</span>
            </>
          )}
        </button>

        {requireTwoFactor && (
          <button
            onClick={() => {
              setRequireTwoFactor(false);
              setFormData(prev => ({ ...prev, totpCode: '' }));
            }}
            className="w-full text-sm text-blue-600 hover:text-blue-700"
          >
            Retour à la connexion
          </button>
        )}
      </div>

      {!requireTwoFactor && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Créer un compte
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

// Register Component
export function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        organization: formData.organization || undefined
      });
    } catch (error) {
      setErrors({ general: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Créer un compte</h2>
        <p className="text-gray-600 mt-2">Rejoignez la plateforme E-ARONCY</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Votre nom complet"
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="votre@email.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organisation (optionnel)
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nom de votre organisation"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Mot de passe sécurisé"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le mot de passe *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirmer le mot de passe"
            />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Création du compte...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Créer mon compte</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Déjà un compte ?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}

// 2FA Setup Component
export function TwoFactorSetup({ onComplete }: { onComplete: () => void }) {
  const { setup2FA, verify2FA } = useAuth();
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [setupData, setSetupData] = useState<{
    secret: string;
    qrCode: string;
    manualEntryKey: string;
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSetup = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await setup2FA();
      setSetupData(data);
      setStep('verify');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setError('');

    try {
      await verify2FA(verificationCode);
      onComplete();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (setupData) {
      await navigator.clipboard.writeText(setupData.manualEntryKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Authentification à deux facteurs</h2>
        <p className="text-gray-600 mt-2">
          Renforcez la sécurité de votre compte
        </p>
      </div>

      {step === 'setup' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Pourquoi activer la 2FA ?</h3>
                <p className="text-sm text-blue-800 mt-1">
                  L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire 
                  en demandant un code généré par votre téléphone en plus de votre mot de passe.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Étapes à suivre :</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Téléchargez une app d'authentification (Google Authenticator, Authy, etc.)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Scannez le QR code qui va apparaître</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Entrez le code généré pour vérifier</span>
              </li>
            </ol>
          </div>

          <button
            onClick={handleSetup}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Configuration...</span>
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4" />
                <span>Configurer la 2FA</span>
              </>
            )}
          </button>
        </div>
      )}

      {step === 'verify' && setupData && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-4">Scannez ce QR code</h3>
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
              <img src={setupData.qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Ou saisissez manuellement :</h4>
            <div className="flex items-center space-x-2">
              <code className="bg-white px-3 py-2 rounded border text-sm font-mono flex-1">
                {setupData.manualEntryKey}
              </code>
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-600 hover:text-gray-800 border rounded"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code de vérification
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
            />
            <p className="text-sm text-gray-500 mt-2">
              Entrez le code à 6 chiffres affiché dans votre app d'authentification.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Vérification...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Activer la 2FA</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// User Profile with 2FA Management
export function UserProfile() {
  const { user, logout, disable2FA } = useAuth();
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleDisable2FA = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir désactiver l\'authentification à deux facteurs ?')) {
      setIsLoading(true);
      try {
        await disable2FA();
      } catch (error) {
        alert('Erreur lors de la désactivation : ' + (error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (showTwoFactorSetup) {
    return (
      <TwoFactorSetup
        onComplete={() => {
          setShowTwoFactorSetup(false);
          alert('Authentification à deux facteurs activée avec succès !');
        }}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        {user.organization && (
          <p className="text-sm text-gray-500">{user.organization}</p>
        )}
      </div>

      <div className="space-y-6">
        {/* Role */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Rôle</h3>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
            user.role === 'instructor' ? 'bg-green-100 text-green-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {user.role === 'admin' ? 'Administrateur' :
             user.role === 'instructor' ? 'Instructeur' : 'Étudiant'}
          </span>
        </div>

        {/* 2FA Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Authentification à deux facteurs</h3>
              <p className="text-sm text-gray-600">
                {user.twoFactorEnabled 
                  ? 'Votre compte est sécurisé avec la 2FA' 
                  : 'Renforcez la sécurité de votre compte'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${
                user.twoFactorEnabled ? 'bg-green-500' : 'bg-red-500'
              }`} />
              {user.twoFactorEnabled ? (
                <button
                  onClick={handleDisable2FA}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
                >
                  {isLoading ? 'Désactivation...' : 'Désactiver'}
                </button>
              ) : (
                <button
                  onClick={() => setShowTwoFactorSetup(true)}
                  className="px-3 py-1 text-sm text-green-600 border border-green-300 rounded hover:bg-green-50"
                >
                  Activer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Auth Component
export default function AuthSystem() {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  
  // Simulated user state for demo
  const [demoUser, setDemoUser] = useState<User | null>(null);

  // Demo functions
  const demoLogin = () => {
    setDemoUser({
      id: '1',
      email: 'demo@earoncy.org',
      name: 'Utilisateur Démo',
      role: 'student',
      organization: 'E-ARONCY',
      twoFactorEnabled: false
    });
  };

  if (demoUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{demoUser.name}</h2>
            <p className="text-gray-600">{demoUser.email}</p>
            {demoUser.organization && (
              <p className="text-sm text-gray-500">{demoUser.organization}</p>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Rôle</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Étudiant
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Authentification à deux facteurs</h3>
                  <p className="text-sm text-gray-600">
                    {demoUser.twoFactorEnabled 
                      ? 'Votre compte est sécurisé avec la 2FA' 
                      : 'Renforcez la sécurité de votre compte'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${
                    demoUser.twoFactorEnabled ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <button
                    onClick={() => setDemoUser(prev => prev ? {...prev, twoFactorEnabled: !prev.twoFactorEnabled} : null)}
                    className={`px-3 py-1 text-sm border rounded hover:bg-opacity-50 ${
                      demoUser.twoFactorEnabled 
                        ? 'text-red-600 border-red-300 hover:bg-red-50'
                        : 'text-green-600 border-green-300 hover:bg-green-50'
                    }`}
                  >
                    {demoUser.twoFactorEnabled ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={() => setDemoUser(null)}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {currentView === 'login' && (
        <div className="max-w-md mx-auto">
          <LoginForm onSwitchToRegister={() => setCurrentView('register')} />
          <div className="mt-6 text-center">
            <button
              onClick={demoLogin}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium border border-purple-300 px-4 py-2 rounded-lg hover:bg-purple-50"
            >
              Mode Démo (test rapide)
            </button>
          </div>
        </div>
      )}
      
      {currentView === 'register' && (
        <RegisterForm onSwitchToLogin={() => setCurrentView('login')} />
      )}
    </div>
  );
}
