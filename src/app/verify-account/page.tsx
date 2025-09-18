"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Loader, CheckCircle } from 'lucide-react';

export default function VerifyAccountPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [activating, setActivating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) return;
    const activate = async () => {
      try {
        setActivating(true);
        const res = await fetch(`/api/auth/register/activate?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Lien invalide ou expiré');
        setMessage('Compte activé avec succès. Redirection vers la connexion...');
        setTimeout(() => router.push('/login?activated=1'), 1200);
      } catch (err: any) {
        setError(err.message || 'Erreur serveur');
      } finally {
        setActivating(false);
      }
    };
    activate();
  }, [router]);

  const handleResend = async () => {
    try {
      setResendLoading(true);
      setResendMsg('');
      const res = await fetch('/api/auth/register/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        setResendMsg(data.error || 'Échec de renvoi de l\'email');
        return;
      }
      setResendMsg('Email d\'activation renvoyé. Vérifiez votre boîte de réception.');
    } catch (err) {
      setResendMsg('Erreur réseau lors de l\'envoi de l\'email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              E-ARONCY
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Vérifier mon compte</h1>
          <p className="text-slate-600 mt-1">Entrez votre email et le code reçu</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          {activating && (
            <div className="mb-4 flex items-center text-blue-700 bg-blue-50 border border-blue-200 rounded-md p-3">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              <span>Activation du compte en cours...</span>
            </div>
          )}
          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
          {message && (
            <div className="mb-3 text-sm text-green-700 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>{message}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-sm text-slate-700">
              Nous envoyons désormais un email avec un lien sécurisé pour activer votre compte. Ouvrez ce lien depuis votre boîte de réception.
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="vous@exemple.com"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-slate-500">Besoin d'un nouvel email d'activation ?</p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading || !email}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {resendLoading ? 'Envoi...' : 'Renvoyer l\'email'}
                </button>
              </div>
              {resendMsg && <p className="text-xs mt-1 text-slate-600">{resendMsg}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
