'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search, Shield, Users, BookOpen, Globe, ChevronRight, Star, Award, Zap, GraduationCap, Lock, Heart, Wrench, Play, CheckCircle, Menu, X, Image as ImageIcon, ChevronDown, FileText } from "lucide-react";
import InteractiveAfricaMap from "@/components/InteractiveAfricaMap";
import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";

export default function Home() {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section - e-ARONCY Presentation */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                  Bienvenue sur le portail 
                  <span className="text-blue-600"> e-ARONCY</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  La cybersécurité peut parfois sembler compliquée ou réservée aux spécialistes. 
                  Nous rendons la cybersécurité accessible à toutes les ONG, même celles qui n'ont pas d'experts informatiques.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => openAuthModal('register')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all text-center"
                >
                  Commencer gratuitement
                </button>
                <Link 
                  href="/ressources" 
                  className="border-2 border-slate-900 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-slate-900 hover:text-white transition-all text-center"
                >
                  Découvrir les ressources
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/images/slider1.jpg"
                  alt="Formation cybersécurité pour ONG"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                {/* Overlay elements for visual appeal */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Cybersécurité ONG</span>
                  </div>
                </div>
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">500+ ONG protégées</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Mission Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Notre Mission
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Nous nous engageons à démocratiser la cybersécurité pour toutes les organisations non gouvernementales
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 group">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Rendre la cybersécurité accessible à toutes les ONG
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Nous simplifions les concepts complexes de cybersécurité pour les rendre compréhensibles et applicables par tous, 
                même sans expertise technique préalable.
              </p>
            </div>

            {/* Mission 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 group">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Proposer des outils et bonnes pratiques faciles à appliquer
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Nous développons et recommandons des solutions pratiques, testées et adaptées aux contraintes budgétaires 
                et techniques des ONG africaines.
              </p>
            </div>

            {/* Mission 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 group">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Accompagner les ONG africaines pas à pas
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Nous offrons un accompagnement personnalisé et progressif, en tenant compte du contexte spécifique 
                et des défis uniques des organisations en Afrique.
              </p>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-16 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-blue-200 shadow-lg">
              <blockquote className="text-2xl lg:text-3xl font-medium text-slate-800 italic mb-6">
                "L'idée n'est pas de vous faire peur, mais de vous donner confiance : 
                avec de petits gestes et de bonnes habitudes, vous pouvez déjà améliorer considérablement votre sécurité numérique."
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900">Équipe E-ARONCY</div>
                  <div className="text-slate-600 text-sm">Alliance Régionale pour la Cybersécurité des ONG</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why e-ARONCY Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Pourquoi e-ARONCY ?
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              En Afrique comme ailleurs, les ONG utilisent de plus en plus le numérique. 
              Cela fait aussi des ONG des cibles de choix pour les cyberattaques.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Problem */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl border border-red-200">
              <div className="bg-red-600 p-3 rounded-lg w-fit mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Les défis</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-sm">Vols de données sensibles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-sm">Escroqueries en ligne</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-sm">Hameçonnage et piratages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-sm">Perte de confiance des partenaires</span>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200">
              <div className="bg-blue-600 p-3 rounded-lg w-fit mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Notre approche</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm">Explications claires et accessibles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm">Guides pratiques adaptés</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm">Formations courtes et efficaces</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm">Retours d'expérience d'autres ONG</span>
                </li>
              </ul>
            </div>

            {/* Result */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200 md:col-span-2 lg:col-span-1">
              <div className="bg-green-600 p-3 rounded-lg w-fit mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Le résultat</h3>
              <p className="text-slate-700 text-sm mb-4">
                Un espace pédagogique, collaboratif et tourné vers l'action, pour que chaque ONG puisse avancer sereinement dans le monde numérique.
              </p>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-xs text-slate-600 italic">
                  "L'idée n'est pas de vous faire peur, mais de vous donner confiance : 
                  avec de petits gestes et de bonnes habitudes, vous pouvez déjà améliorer considérablement votre sécurité numérique."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section - "Toutes les compétences dont vous avez besoin" */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Toutes les compétences dont vous avez besoin au même endroit
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              Des compétences essentielles aux sujets techniques. E-ARONCY contribue à votre développement professionnel avec des cours adaptés aux réalités des ONG africaines.
            </p>
          </div>

          {/* Skills Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200 hover:shadow-lg transition-all group-hover:-translate-y-1">
                <div className="bg-blue-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Cybersécurité</h3>
                <p className="text-slate-600 mb-4">Protection des données, sécurité des systèmes, gestion des incidents</p>
                <div className="text-sm text-blue-600 font-medium">12 cours disponibles</div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200 hover:shadow-lg transition-all group-hover:-translate-y-1">
                <div className="bg-green-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Gestion d'équipe</h3>
                <p className="text-slate-600 mb-4">Leadership, communication, gestion de projet</p>
                <div className="text-sm text-green-600 font-medium">8 cours disponibles</div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border border-purple-200 hover:shadow-lg transition-all group-hover:-translate-y-1">
                <div className="bg-purple-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Conformité</h3>
                <p className="text-slate-600 mb-4">Réglementation, audit, mise en conformité</p>
                <div className="text-sm text-purple-600 font-medium">6 cours disponibles</div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border border-orange-200 hover:shadow-lg transition-all group-hover:-translate-y-1">
                <div className="bg-orange-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Outils numériques</h3>
                <p className="text-slate-600 mb-4">Logiciels sécurisés, applications, plateformes</p>
                <div className="text-sm text-orange-600 font-medium">15 cours disponibles</div>
              </div>
            </div>
          </div>

          {/* Featured Learning Paths */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8 text-center">
              Parcours de formation recommandés
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Débutant</h4>
                    <p className="text-sm text-slate-600">Bases de la cybersécurité</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Introduction à la cybersécurité
                  </li>
                  <li className="flex items-center text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Mots de passe sécurisés
                  </li>
                  <li className="flex items-center text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Phishing et arnaques
                  </li>
                </ul>
                <Link href="/knowledge-base" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  Commencer le parcours →
                </Link>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Intermédiaire</h4>
                    <p className="text-sm text-slate-600">Gestion des risques</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Audit de sécurité
                  </li>
                  <li className="flex items-center text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Plan de continuité
                  </li>
                  <li className="flex items-center text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Formation des équipes
                  </li>
                </ul>
                <Link href="/knowledge-base" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                  Commencer le parcours →
                </Link>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Avancé</h4>
                    <p className="text-sm text-slate-600">Expert en sécurité</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Réponse aux incidents
                  </li>
                  <li className="flex items-center text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Conformité réglementaire
                  </li>
                  <li className="flex items-center text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Certification expert
                  </li>
                </ul>
                <Link href="/knowledge-base" className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
                  Commencer le parcours →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Ressources pour votre cybersécurité
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Découvrez nos outils, guides et ressources pratiques pour renforcer la sécurité de votre organisation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Guides pratiques */}
            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200 hover:shadow-lg transition-all group-hover:-translate-y-1">
                <div className="bg-blue-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <Link href="/ressources/guides-pratiques" className="block">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors">Guides pratiques</h3>
                </Link>
                <p className="text-slate-600 mb-4">Plans d'action et guides étape par étape</p>
                <div className="space-y-2">
                  <Link href="/ressources/guides-pratiques/plan-action-cybersecurite-ong" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    • Plan d'Action Cybersécurité
                  </Link>
                  <Link href="/ressources/guides-pratiques/checklist-cybersecurite-ong" className="block text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    • Checklist Cybersécurité
                  </Link>
                </div>
              </div>
            </div>

            {/* Infographies */}
            <div className="group">
              <Link href="/ressources/infographies" className="block bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200 hover:shadow-lg transition-all group-hover:-translate-y-1">
                <div className="bg-green-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Infographies</h3>
                <p className="text-slate-600 mb-4">Visuels percutants et éducatifs</p>
                <div className="text-sm text-green-600 font-medium">Découvrir les infographies →</div>
              </Link>
            </div>

            {/* Articles */}
            <div className="group">
              <Link href="/ressources/articles" className="block bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border border-purple-200 hover:shadow-lg transition-all group-hover:-translate-y-1">
                <div className="bg-purple-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Articles</h3>
                <p className="text-slate-600 mb-4">Analyses d'experts et actualités</p>
                <div className="text-sm text-purple-600 font-medium">Lire les articles →</div>
              </Link>
            </div>

            {/* Boîte à outils */}
            <div className="group">
              <Link href="/ressources/boite-outils" className="block bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border border-orange-200 hover:shadow-lg transition-all group-hover:-translate-y-1">
                <div className="bg-orange-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Boîte à Outils</h3>
                <p className="text-slate-600 mb-4">Outils recommandés et testés</p>
                <div className="text-sm text-orange-600 font-medium">Explorer les outils →</div>
              </Link>
            </div>
          </div>

          {/* Featured Resources */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8 text-center">
              Ressources les plus consultées
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Plan d'Action Cybersécurité</h4>
                    <p className="text-sm text-slate-600">Guide complet pour ONG</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 mb-4">
                  Un plan structuré basé sur le framework NIST pour renforcer la cybersécurité de votre organisation.
                </p>
                <Link href="/ressources/guides-pratiques/plan-action-cybersecurite-ong" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  Consulter le plan →
                </Link>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Checklist Cybersécurité</h4>
                    <p className="text-sm text-slate-600">Outil d'évaluation pratique</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 mb-4">
                  22 mesures organisées pour évaluer et améliorer votre niveau de cybersécurité.
                </p>
                <Link href="/ressources/guides-pratiques/checklist-cybersecurite-ong" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                  Utiliser la checklist →
                </Link>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Wrench className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Boîte à Outils</h4>
                    <p className="text-sm text-slate-600">Logiciels recommandés</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 mb-4">
                  Une sélection d'outils gratuits et payants pour sécuriser votre infrastructure.
                </p>
                <Link href="/ressources/boite-outils" className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
                  Découvrir les outils →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Africa Map Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Réglementation en 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Afrique</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explorez les lois et réglementations en cybersécurité dans les pays africains. 
              Cliquez sur un pays pour découvrir son cadre juridique.
            </p>
          </div>

          <InteractiveAfricaMap />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Ce que disent nos apprenants
            </h2>
            <p className="text-xl text-slate-600">
              Plus de 500 ONG nous font confiance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Aminata Diallo",
                role: "Directrice ONG",
                country: "Sénégal",
                rating: 5,
                comment: "E-ARONCY nous a permis de considérablement améliorer notre posture de sécurité. Les formations sont excellentes et adaptées à nos besoins."
              },
              {
                name: "Kofi Asante",
                role: "Responsable IT",
                country: "Ghana",
                rating: 5,
                comment: "Une plateforme exceptionnelle avec des contenus de qualité. J'ai pu former toute mon équipe grâce aux modules interactifs."
              },
              {
                name: "Fatou Kone",
                role: "Coordinatrice",
                country: "Mali",
                rating: 5,
                comment: "Les outils pratiques et les guides sont parfaitement adaptés à notre contexte. Une ressource indispensable pour toute ONG."
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-xl border border-slate-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-slate-600 text-sm">{testimonial.role} • {testimonial.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Prêt à transformer votre organisation ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des centaines d'ONG qui font confiance à E-ARONCY pour leur cybersécurité
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => openAuthModal('register')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center justify-center"
            >
              Commencer gratuitement
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
            <Link href="/diagnostic" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center">
              Faire un diagnostic
              <Play className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/assets/logos/logoblanchdaroncy.png"
                  alt="E-ARONCY Logo"
                  width={100}
                  height={32}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-slate-400">
                Alliance Régionale pour la Cybersécurité des ONG en Afrique de l'Ouest
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/knowledge-base" className="hover:text-white transition-colors">Base de connaissances</Link></li>
                <li><Link href="/ressources/guides-pratiques" className="hover:text-white transition-colors">Guides pratiques</Link></li>
                <li><Link href="/ressources/boite-outils" className="hover:text-white transition-colors">Boîte à outils</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Formation</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/knowledge-base" className="hover:text-white transition-colors">Modules de formation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Certifications</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Webinaires</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 E-ARONCY. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </div>
  );
}
