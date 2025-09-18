"use client";

import React, { useEffect, useMemo } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, User, Building, MapPin, Phone, Loader } from "lucide-react";
import { useSession } from '../../components/SessionProvider';

export default function Register() {
  // Liste ISO des pays et noms localisés en FR
  const countries = useMemo(() => {
    const codes = [
      'AF','AX','AL','DZ','AS','AD','AO','AI','AQ','AG','AR','AM','AW','AU','AT','AZ','BS','BH','BD','BB','BY','BE','BZ','BJ','BM','BT','BO','BQ','BA','BW','BV','BR','IO','BN','BG','BF','BI','CV','KH','CM','CA','KY','CF','TD','CL','CN','CX','CC','CO','KM','CG','CD','CK','CR','CI','HR','CU','CW','CY','CZ','DK','DJ','DM','DO','EC','EG','SV','GQ','ER','EE','SZ','ET','FK','FO','FJ','FI','FR','GF','PF','TF','GA','GM','GE','DE','GH','GI','GR','GL','GD','GP','GU','GT','GG','GN','GW','GY','HT','HM','VA','HN','HK','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','JM','JP','JE','JO','KZ','KE','KI','KP','KR','KW','KG','LA','LV','LB','LS','LR','LY','LI','LT','LU','MO','MG','MW','MY','MV','ML','MT','MH','MQ','MR','MU','YT','MX','FM','MD','MC','MN','ME','MS','MA','MZ','MM','NA','NR','NP','NL','NC','NZ','NI','NE','NG','NU','NF','MK','MP','NO','OM','PK','PW','PS','PA','PG','PY','PE','PH','PN','PL','PT','PR','QA','RE','RO','RU','RW','BL','SH','KN','LC','MF','PM','VC','WS','SM','ST','SA','SN','RS','SC','SL','SG','SX','SK','SI','SB','SO','ZA','GS','SS','ES','LK','SD','SR','SJ','SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TK','TO','TT','TN','TR','TM','TC','TV','UG','UA','AE','GB','US','UM','UY','UZ','VU','VE','VN','VG','VI','WF','EH','YE','ZM','ZW'
    ];
    let rn: any = null;
    try {
      // @ts-ignore
      rn = typeof Intl !== 'undefined' && (Intl as any).DisplayNames ? new (Intl as any).DisplayNames(['fr'], { type: 'region' }) : null;
    } catch {}
    const list = codes.map(code => ({ code, name: rn ? rn.of(code) as string : code }))
      .filter(c => !!c.name)
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    return list;
  }, []);
  const router = useRouter();
  const { isAuthenticated, isLoading: sessionLoading, user } = useSession();

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

  // Ne pas afficher la page d'inscription si l'utilisateur est connecté
  if (isAuthenticated) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              E-ARONCY
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Créer votre compte
          </h2>
          <p className="text-slate-600">
            Rejoignez la communauté E-ARONCY et renforcez votre cybersécurité
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <form className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Informations personnelles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                    Prénom *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                    Nom *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Adresse email *
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
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+225 XX XX XX XX"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Informations sur l'organisation</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-slate-700 mb-2">
                    Nom de l'organisation *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Nom de votre ONG/Institution"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="orgType" className="block text-sm font-medium text-slate-700 mb-2">
                      Type d'organisation *
                    </label>
                    <select
                      id="orgType"
                      name="orgType"
                      required
                      className="block w-full py-3 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="ong">ONG</option>
                      <option value="association">Association</option>
                      <option value="fondation">Fondation</option>
                      <option value="institution">Institution publique</option>
                      <option value="entreprise">Entreprise sociale</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-2">
                      Pays *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-slate-400" />
                      </div>
                      <select
                        id="country"
                        name="country"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Sélectionner un pays</option>
                        {countries.map(c => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-2">
                    Fonction/Poste *
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    required
                    className="block w-full py-3 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Directeur, Responsable IT, Coordinateur..."
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Sécurité</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-2">Le mot de passe doit contenir :</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Au moins 8 caractères</li>
                  <li>• Une lettre majuscule et une minuscule</li>
                  <li>• Un chiffre</li>
                  <li>• Un caractère spécial</li>
                </ul>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mt-1"
                />
                <label htmlFor="terms" className="ml-3 block text-sm text-slate-700">
                  J'accepte les{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="newsletter"
                  name="newsletter"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mt-1"
                />
                <label htmlFor="newsletter" className="ml-3 block text-sm text-slate-700">
                  Je souhaite recevoir les actualités et formations E-ARONCY par email
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Créer mon compte
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Ou s'inscrire avec</span>
              </div>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
              <span className="sr-only">S'inscrire avec Google</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            <button className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
              <span className="sr-only">S'inscrire avec Microsoft</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
              </svg>
            </button>

            <button className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
              <span className="sr-only">S'inscrire avec LinkedIn</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-slate-600">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
