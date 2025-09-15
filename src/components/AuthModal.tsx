"use client";

import React, { useState, useEffect } from 'react';
import { X, Shield, Mail, Lock, Eye, EyeOff, User, Building, MapPin, Phone, Loader, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const router = useRouter();

  // Formulaire de connexion
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Formulaire d'inscription
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    orgType: '',
    country: '',
    position: '',
    password: '',
    confirmPassword: '',
    terms: false,
    newsletter: false
  });

  // Réinitialiser le mode quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setRequires2FA(false);
      setTotpCode('');
    }
  }, [isOpen, initialMode]);

  // Fermer la modal avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!loginData.email || !loginData.password) {
        throw new Error('Veuillez remplir tous les champs');
      }

      if (!isValidEmail(loginData.email)) {
        throw new Error('Adresse email invalide');
      }

      const loginPayload = {
        email: loginData.email,
        password: loginData.password,
        rememberMe: loginData.rememberMe,
        ...(requires2FA && totpCode && { totpCode })
      };

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      if (data.requires2FA && !requires2FA) {
        setRequires2FA(true);
        setLoading(false);
        return;
      }

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        onClose();
        if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }

    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError(error.message || 'Erreur de connexion');
      setRequires2FA(false);
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totpCode) {
      setError('Veuillez saisir le code 2FA');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const loginPayload = {
        email: loginData.email,
        password: loginData.password,
        rememberMe: loginData.rememberMe,
        totpCode: totpCode
      };

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Code 2FA invalide');
      }

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        onClose();
        if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }

    } catch (error: any) {
      console.error('Erreur 2FA:', error);
      setError(error.message || 'Code 2FA invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation côté client
      if (!registerData.firstName || !registerData.lastName || !registerData.email || 
          !registerData.country || !registerData.password || !registerData.confirmPassword) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      if (!isValidEmail(registerData.email)) {
        throw new Error('Adresse email invalide');
      }

      if (registerData.password !== registerData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (registerData.password.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }

      if (!registerData.terms) {
        throw new Error('Vous devez accepter les conditions d\'utilisation');
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      if (data.success) {
        // Inscription réussie, basculer vers la connexion
        setMode('login');
        setError('');
        setLoginData(prev => ({ ...prev, email: registerData.email }));
        // Optionnel: afficher un message de succès
      }

    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      setError(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop avec flou gaussien */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Image
                  src="/assets/logos/logohdaroncy.png"
                  alt="E-ARONCY Logo"
                  width={80}
                  height={26}
                  className="h-8 w-auto"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {mode === 'login' 
                    ? (requires2FA ? 'Authentification 2FA' : 'Connexion') 
                    : 'Inscription'
                  }
                </h2>
                <p className="text-sm text-slate-600">
                  {mode === 'login' 
                    ? (requires2FA ? 'Saisissez votre code 2FA' : 'Accédez à votre compte') 
                    : 'Rejoignez E-ARONCY'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {mode === 'login' ? (
              // Formulaire de connexion
              !requires2FA ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={loginData.email}
                        onChange={handleLoginInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="votre@email.com"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginData.password}
                        onChange={handleLoginInputChange}
                        className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        name="rememberMe"
                        type="checkbox"
                        checked={loginData.rememberMe}
                        onChange={handleLoginInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        disabled={loading}
                      />
                      <span className="ml-2 text-sm text-slate-700">Se souvenir</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </button>
                </form>
              ) : (
                // Formulaire 2FA
                <form onSubmit={handle2FASubmit} className="space-y-4">
                  <div>
                    <label htmlFor="totpCode" className="block text-sm font-medium text-slate-700 mb-1">
                      Code d'authentification
                    </label>
                    <input
                      id="totpCode"
                      name="totpCode"
                      type="text"
                      required
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      disabled={loading}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Code à 6 chiffres de votre app d'authentification
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setRequires2FA(false);
                        setTotpCode('');
                        setError('');
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                      disabled={loading}
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !totpCode}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Vérification...
                        </>
                      ) : (
                        'Vérifier'
                      )}
                    </button>
                  </div>
                </form>
              )
            ) : (
              // Formulaire d'inscription
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                      Prénom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={registerData.firstName}
                        onChange={handleRegisterInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Prénom"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                      Nom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={registerData.lastName}
                        onChange={handleRegisterInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nom"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={registerData.email}
                      onChange={handleRegisterInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="votre@email.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-slate-700 mb-1">
                    Organisation
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      value={registerData.organization}
                      onChange={handleRegisterInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom de votre ONG (optionnel)"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="orgType" className="block text-sm font-medium text-slate-700 mb-1">
                      Type
                    </label>
                    <select
                      id="orgType"
                      name="orgType"
                      value={registerData.orgType}
                      onChange={handleRegisterInputChange}
                      className="w-full py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    >
                      <option value="">Type (optionnel)</option>
                      <option value="ong">ONG</option>
                      <option value="association">Association</option>
                      <option value="fondation">Fondation</option>
                      <option value="institution">Institution</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">
                      Pays *
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={registerData.country}
                      onChange={handleRegisterInputChange}
                      className="w-full py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    >
                      <option value="">Pays</option>
                      <option value="ci">Côte d'Ivoire</option>
                      <option value="bf">Burkina Faso</option>
                      <option value="ne">Niger</option>
                      <option value="ml">Mali</option>
                      <option value="sn">Sénégal</option>
                      <option value="gn">Guinée</option>
                      <option value="gh">Ghana</option>
                      <option value="tg">Togo</option>
                      <option value="bj">Bénin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-1">
                    Fonction
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    value={registerData.position}
                    onChange={handleRegisterInputChange}
                    className="w-full py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Votre fonction (optionnel)"
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={registerData.password}
                        onChange={handleRegisterInputChange}
                        className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                      Confirmer *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={registerData.confirmPassword}
                        onChange={handleRegisterInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-start">
                    <input
                      name="terms"
                      type="checkbox"
                      checked={registerData.terms}
                      onChange={handleRegisterInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mt-0.5"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-slate-700">
                      J'accepte les{' '}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                        conditions d'utilisation
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      name="newsletter"
                      type="checkbox"
                      checked={registerData.newsletter}
                      onChange={handleRegisterInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mt-0.5"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-slate-700">
                      Recevoir les actualités E-ARONCY
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Inscription...
                    </>
                  ) : (
                    'Créer mon compte'
                  )}
                </button>
              </form>
            )}

            {/* Switch between login/register */}
            {!requires2FA && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  {mode === 'login' ? (
                    <>
                      Pas encore de compte ?{' '}
                      <button
                        onClick={() => setMode('register')}
                        className="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        S'inscrire
                      </button>
                    </>
                  ) : (
                    <>
                      Déjà un compte ?{' '}
                      <button
                        onClick={() => setMode('login')}
                        className="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        Se connecter
                      </button>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
