'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Globe, ChevronDown, BookOpen, Image as ImageIcon, FileText, Wrench } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { UserProfile } from "@/components/UserProfile";
import { useSession } from "@/components/SessionProvider";

export default function Header() {
  const { isAuthenticated, isLoading } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const resourcesItems = [
    {
      title: "Guides pratiques",
      description: "Guides étape par étape",
      href: "/ressources/guides-pratiques",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: "Infographies",
      description: "Visuels percutants",
      href: "/ressources/infographies",
      icon: <ImageIcon className="h-5 w-5" />
    },
    {
      title: "Articles",
      description: "Analyses d'experts",
      href: "/ressources/articles",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Boîte à Outils",
      description: "Outils recommandés",
      href: "/ressources/boite-outils",
      icon: <Wrench className="h-5 w-5" />
    }
  ];

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/assets/logos/logohdaroncy.png"
                  alt="E-ARONCY Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8 font-medium text-sm">
              <Link href="/" className="text-slate-700 hover:text-blue-600 transition-colors">
                Accueil
              </Link>
              <Link href="/knowledge-base" className="text-slate-700 hover:text-blue-600 transition-colors">
                Formation
              </Link>
              <Link href="/diagnostic" className="text-slate-700 hover:text-blue-600 transition-colors">
                Diagnostic
              </Link>
              
              {/* Resources Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsResourcesOpen(true)}
                onMouseLeave={() => setIsResourcesOpen(false)}
              >
                <button className="flex items-center text-slate-700 hover:text-blue-600 transition-colors">
                  Ressources
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-slate-200 py-4 transition-all duration-200 ${
                  isResourcesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                }`}>
                  <div className="px-4 pb-3 border-b border-slate-100">
                    <Link href="/ressources" className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors">
                      Toutes les ressources
                    </Link>
                  </div>
                  <div className="py-2">
                    {resourcesItems.map((item, index) => (
                      <div key={index}>
                        <Link
                          href={item.href}
                          className="flex items-start px-4 py-3 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex-shrink-0 p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <div className="text-slate-600 group-hover:text-blue-600 transition-colors">
                              {item.icon}
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Link href="/a-propos" className="text-slate-700 hover:text-blue-600 transition-colors">
                À propos
              </Link>
            </nav>

            {/* Desktop Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/adhesion" className="text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium">
                Adhésion
              </Link>
              
              {/* Affichage conditionnel selon l'état de connexion */}
              {isLoading ? (
                // État de chargement
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              ) : isAuthenticated ? (
                // Utilisateur connecté - Afficher le profil
                <UserProfile />
              ) : (
                // Utilisateur non connecté - Afficher les boutons de connexion
                <>
                  <button 
                    onClick={() => openAuthModal('login')}
                    className="text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium border border-slate-900 px-4 py-2 rounded"
                  >
                    Se connecter
                  </button>
                  <button 
                    onClick={() => openAuthModal('register')}
                    className="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors text-sm font-medium"
                  >
                    S'inscrire
                  </button>
                </>
              )}
              
              <button className="p-2 hover:bg-slate-100 rounded">
                <Globe className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                <span className="sr-only">Ouvrir le menu principal</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-slate-200">
                <Link
                  href="/"
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  href="/knowledge-base"
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Formation
                </Link>
                <Link
                  href="/diagnostic"
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Diagnostic
                </Link>
                <Link
                  href="/ressources"
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ressources
                </Link>
                <Link
                  href="/a-propos"
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  À propos
                </Link>
                <Link
                  href="/adhesion"
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Adhésion
                </Link>
                <div className="pt-4 pb-3 border-t border-slate-200">
                  <div className="flex flex-col space-y-3 px-3">
                    {/* Affichage conditionnel pour mobile */}
                    {isLoading ? (
                      // État de chargement
                      <div className="flex flex-col space-y-2">
                        <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
                        <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
                      </div>
                    ) : isAuthenticated ? (
                      // Utilisateur connecté - Afficher le profil mobile
                      <div className="py-2">
                        <UserProfile className="w-full" />
                      </div>
                    ) : (
                      // Utilisateur non connecté - Afficher les boutons de connexion
                      <>
                        <button
                          onClick={() => {
                            openAuthModal('login');
                            setIsMobileMenuOpen(false);
                          }}
                          className="text-center text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium border border-slate-900 px-4 py-2 rounded"
                        >
                          Se connecter
                        </button>
                        <button
                          onClick={() => {
                            openAuthModal('register');
                            setIsMobileMenuOpen(false);
                          }}
                          className="text-center bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors text-sm font-medium"
                        >
                          S'inscrire
                        </button>
                      </>
                    )}
                    
                    <button className="flex items-center justify-center p-2 hover:bg-slate-100 rounded">
                      <Globe className="h-5 w-5 text-slate-600 mr-2" />
                      <span className="text-sm text-slate-600">Langue</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </>
  );
}
