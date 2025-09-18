"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, Eye, EyeOff, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useSession } from '../../components/SessionProvider';
import Header from '@/components/Header';

export default function SecureLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const router = useRouter();
  const [infoMsg, setInfoMsg] = useState('');
  const { isAuthenticated, isLoading: sessionLoading, user } = useSession();

  // Lire le paramètre d'activation depuis l'URL côté client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('activated') === '1') {
        setInfoMsg('Votre compte est activé. Vous pouvez vous connecter.');
      }
    }
  }, []);

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (!sessionLoading && isAuthenticated && user) {
      // Rediriger vers la page appropriée selon le rôle
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, sessionLoading, user, router]);

  // Afficher un loader pendant la vérification de session
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  // Ne pas afficher la page de connexion si l'utilisateur est connecté
  if (isAuthenticated) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Effacer l'erreur lors de la saisie
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation côté client
      if (!formData.email || !formData.password) {
        throw new Error('Veuillez remplir tous les champs');
      }

      if (!isValidEmail(formData.email)) {
        throw new Error('Adresse email invalide');
      }

      // Préparer les données de connexion
      const loginData = {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        ...(requires2FA && totpCode && { totpCode })
      };

      // Envoi de la requête POST sécurisée
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      // Gestion de la vérification par email
      if ((data.requires2FA || data.requiresEmailOTP) && !requires2FA) {
        setRequires2FA(true);
        setLoading(false);
        return;
      }

      // Connexion réussie
      if (data.success) {
        // Stocker le token JWT
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Rediriger vers le dashboard
        if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }

    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError(error.message || 'Erreur de connexion');
      setRequires2FA(false); // Reset 2FA si erreur
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totpCode) {
      setError('Veuillez saisir le code 2FA');
      return;
    }
    
    // Réutiliser la fonction handleSubmit avec le code 2FA
    setLoading(true);
    setError('');

    try {
      const verifyData = {
        email: formData.email,
        code: totpCode,
        rememberMe: formData.rememberMe,
      };

      const response = await fetch('/api/auth/login/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Code invalide');
      }

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
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

  const handleResend = async () => {
    try {
      setResendLoading(true);
      setResendMsg('');
      const res = await fetch('/api/auth/login/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429 && data.retryAfter) {
          setResendMsg(`Veuillez patienter ${data.retryAfter}s avant un nouvel envoi.`);
        } else {
          setResendMsg(data.error || 'Échec de renvoi du code');
        }
        return;
      }
      setResendMsg('Nouveau code envoyé. Vérifiez votre email.');
    } catch (err) {
      setResendMsg('Erreur réseau lors de l\'envoi du code');
    } finally {
      setResendLoading(false);
    }
  };

  // Fonction OAuth (à implémenter)
  async function handleOAuthLogin(provider: string) {
    try {
      setLoading(true);
      window.location.href = `/api/auth/oauth/${provider}`;
    } catch (error) {
      console.error(`Erreur OAuth ${provider}:`, error);
      setError(`Erreur de connexion ${provider}`);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero-like section aligned with home */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content: consistent with homepage tone */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  E-ARONCY
                </span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900">
                {requires2FA ? 'Vérification par email' : 'Connexion à votre compte'}
              </h1>
              <p className="text-slate-600 text-lg">
                {requires2FA
                  ? "Saisissez le code reçu par email"
                  : "Accédez à votre espace de formation en cybersécurité"}
              </p>
              {!requires2FA && (
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">Cours et ressources adaptés aux ONG</span>
                  </li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">Suivi de progression et certifications</span>
                  </li>
                  <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">Sécurité renforcée avec 2FA</span>
                  </li>
                </ul>
              )}
              <div className="text-slate-600 text-sm">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">Créer un compte</Link>
              </div>
            </div>

            {/* Right column: Login card */}
            <div className="max-w-md w-full mx-auto lg:mx-0">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          {infoMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-green-700 text-sm">{infoMsg}</span>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {!requires2FA ? (
            // Formulaire de connexion principal
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="votre@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    disabled={loading}
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-700">
                    Se souvenir de moi
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>
          ) : (
            // Formulaire code email
            <form onSubmit={handle2FASubmit} className="space-y-6">
              <div>
                <label htmlFor="totpCode" className="block text-sm font-medium text-slate-700 mb-2">
                  Code de vérification
                </label>
                <input
                  id="totpCode"
                  name="totpCode"
                  type="text"
                  required
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  autoComplete="one-time-code"
                  disabled={loading}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-500">Saisissez le code à 6 chiffres reçu par email</p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    {resendLoading ? 'Envoi...' : 'Renvoyer le code'}
                  </button>
                </div>
                {resendMsg && <p className="text-xs mt-1 text-slate-600">{resendMsg}</p>}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setRequires2FA(false);
                    setTotpCode('');
                    setError('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  disabled={loading}
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading || !totpCode}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
          )}

          {/* 2FA Notice */}
          {!requires2FA && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  Authentification à deux facteurs activée pour votre sécurité
                </p>
              </div>
            </div>
          )}

          {/* Divider */}
          {!requires2FA && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Ou continuer avec</span>
                  </div>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center px-4 py-3 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  onClick={() => handleOAuthLogin('google')}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center px-4 py-3 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  onClick={() => handleOAuthLogin('microsoft')}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#f25022" d="M1 1h10v10H1z"/>
                    <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                    <path fill="#7fba00" d="M1 13h10v10H1z"/>
                    <path fill="#ffb900" d="M13 13h10v10H13z"/>
                  </svg>
                  Microsoft
                </button>
              </div>
            </>
          )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
