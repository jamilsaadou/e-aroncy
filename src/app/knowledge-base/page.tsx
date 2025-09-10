import Link from "next/link";
import Image from "next/image";
import { Shield, BookOpen, FileText, Download, Search, Filter, Clock, Eye, Star, ChevronRight, Play, Users, Award } from "lucide-react";
import Header from "@/components/Header";

export default function KnowledgeBase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4 mr-2" />
              Base de connaissances E-ARONCY
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Formations & Ressources en 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> cybersécurité</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Accédez à nos formations interactives et à une collection complète d'articles, guides pratiques, outils et infographies 
              pour renforcer la sécurité de votre organisation.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Rechercher des formations, ressources, guides, outils..."
              />
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Rechercher
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Programme de Formation Structuré */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-aroncy-blue bg-opacity-10 text-aroncy-blue px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="h-4 w-4 mr-2" />
              Programme de Formation E-ARONCY
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-4">
              Formation en Cybersécurité
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
              <strong>Objectif :</strong> Renforcer les compétences pratiques et théoriques en cybersécurité
            </p>
            <div className="bg-aroncy-light-gray rounded-xl p-6 max-w-4xl mx-auto">
              <h3 className="font-display font-semibold text-slate-900 mb-3">Contenu pédagogique (modules) :</h3>
              <p className="text-slate-700">
                Programme complet en 5 modules progressifs couvrant les aspects essentiels de la cybersécurité 
                pour les organisations de la société civile en Afrique de l'Ouest.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Module 1 */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/assets/images/africa-map.jpg"
                  alt="Introduction à la cybersécurité pour les ONG en Afrique"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-aroncy-gradient opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mx-auto mb-3 w-fit">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-display font-bold mb-1">Module 1</h3>
                    <h4 className="text-sm font-semibold">Introduction à la cybersécurité pour les ONG</h4>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Définitions clés, enjeux spécifiques pour les ONG, menaces courantes en Afrique.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-slate-600">
                    <Clock className="h-3 w-3 mr-2 text-aroncy-blue" />
                    2h 30min
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Users className="h-3 w-3 mr-2 text-aroncy-blue" />
                    Niveau débutant
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Award className="h-3 w-3 mr-2 text-aroncy-blue" />
                    Certificat inclus
                  </div>
                </div>
               
                <Link href="/knowledge-base/module-1" className="w-full bg-aroncy-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-aroncy-orange transition-colors text-center text-sm block">
                  Commencer le module
                </Link>
              </div>
            </div>

            {/* Module 2 */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/assets/images/compte-protection.jpeg"
                  alt="Sécurité des données personnelles"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-aroncy-green opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mx-auto mb-3 w-fit">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-display font-bold mb-1">Module 2</h3>
                    <h4 className="text-sm font-semibold">Sécurité des données personnelles</h4>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Principes de la protection des données, obligations légales, bonnes pratiques.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-slate-600">
                    <Clock className="h-3 w-3 mr-2 text-aroncy-green" />
                    3h 15min
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Users className="h-3 w-3 mr-2 text-aroncy-green" />
                    Niveau intermédiaire
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Award className="h-3 w-3 mr-2 text-aroncy-green" />
                    Certificat RGPD
                  </div>
                </div>
                
                <Link href="#" className="w-full bg-aroncy-green text-white py-2 px-4 rounded-lg font-medium hover:bg-aroncy-orange transition-colors text-center text-sm block">
                  Commencer le module
                </Link>
              </div>
            </div>

            {/* Module 3 */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/assets/images/phishing-formation.jpg"
                  alt="Phishing, ransomware et menaces fréquentes"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-red-600 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mx-auto mb-3 w-fit">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-display font-bold mb-1">Module 3</h3>
                    <h4 className="text-sm font-semibold">Phishing, ransomware et menaces fréquentes</h4>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Études de cas réels, quiz de détection d'attaques, simulations interactives.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-slate-600">
                    <Clock className="h-3 w-3 mr-2 text-red-600" />
                    2h 45min
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Users className="h-3 w-3 mr-2 text-red-600" />
                    Tous niveaux
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Award className="h-3 w-3 mr-2 text-red-600" />
                    Simulation pratique
                  </div>
                </div>
               
                <Link href="#" className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-aroncy-orange transition-colors text-center text-sm block">
                  Commencer le module
                </Link>
              </div>
            </div>

            {/* Module 4 */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/assets/images/vps-formation.jpeg"
                  alt="Sécurisation des équipements et du réseau"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-purple-600 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mx-auto mb-3 w-fit">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-display font-bold mb-1">Module 4</h3>
                    <h4 className="text-sm font-semibold">Sécurisation des équipements et du réseau</h4>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Checklists de configuration sécurisée, gestion des connexions et mots de passe.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-slate-600">
                    <Clock className="h-3 w-3 mr-2 text-purple-600" />
                    4h 00min
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Users className="h-3 w-3 mr-2 text-purple-600" />
                    Niveau avancé
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Award className="h-3 w-3 mr-2 text-purple-600" />
                    Certification technique
                  </div>
                </div>
               
                <Link href="#" className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-aroncy-orange transition-colors text-center text-sm block">
                  Commencer le module
                </Link>
              </div>
            </div>

            {/* Module 5 */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/assets/images/team-apropos.jpeg"
                  alt="Cyber-urgence : comment réagir ?"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-aroncy-orange opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mx-auto mb-3 w-fit">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-display font-bold mb-1">Module 5</h3>
                    <h4 className="text-sm font-semibold">Cyber-urgence : comment réagir ?</h4>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Procédures d'intervention en cas d'incident, plan de continuité d'activité rapide.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-slate-600">
                    <Clock className="h-3 w-3 mr-2 text-aroncy-orange" />
                    1h 30min
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Users className="h-3 w-3 mr-2 text-aroncy-orange" />
                    Tous niveaux
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Award className="h-3 w-3 mr-2 text-aroncy-orange" />
                    Plan d'action
                  </div>
                </div>
                
                <Link href="#" className="w-full bg-aroncy-orange text-white py-2 px-4 rounded-lg font-medium hover:bg-aroncy-blue transition-colors text-center text-sm block">
                  Commencer le module
                </Link>
              </div>
            </div>

            {/* Module Bonus - Certification Complète */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-aroncy-blue overflow-hidden hover:shadow-xl transition-all duration-300 group md:col-span-2 lg:col-span-1">
              <div className="bg-aroncy-gradient p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-display font-bold">Certification</h3>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                </div>
                <h4 className="text-sm font-semibold">Programme complet E-ARONCY</h4>
              </div>
              <div className="p-6">
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Complétez tous les modules pour obtenir votre certification officielle E-ARONCY.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-slate-600">
                    <Clock className="h-3 w-3 mr-2 text-aroncy-blue" />
                    14h 00min total
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Users className="h-3 w-3 mr-2 text-aroncy-blue" />
                    Progression complète
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Award className="h-3 w-3 mr-2 text-aroncy-blue" />
                    Certificat officiel
                  </div>
                </div>
                <div className="mb-4">
                  <div className="bg-aroncy-light-gray rounded-lg p-3">
                    <div className="text-xs text-slate-600 mb-1">Progression</div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-aroncy-gradient h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">0/5 modules complétés</div>
                  </div>
                </div>
                <Link href="#" className="w-full bg-aroncy-gradient text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-all text-center text-sm block">
                  Voir la progression
                </Link>
              </div>
            </div>
          </div>

          {/* Progression et Certification */}
          <div className="mt-12 bg-aroncy-light-gray rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">
                Progression et Certification
              </h3>
              <p className="text-slate-600 mb-6 max-w-3xl mx-auto">
                Complétez les 5 modules pour obtenir votre certification E-ARONCY en cybersécurité pour les ONG. 
                Chaque module inclut des évaluations pratiques et des études de cas réels.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="#" className="bg-aroncy-gradient text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all inline-flex items-center justify-center">
                  <Play className="h-5 w-5 mr-2" />
                  Commencer la formation complète
                </Link>
                <Link href="/diagnostic" className="border-2 border-aroncy-blue text-aroncy-blue px-8 py-3 rounded-lg font-semibold hover:bg-aroncy-blue hover:text-white transition-all text-center">
                  Évaluer mon niveau
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-900">Filtrer par :</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Tous
                </button>
                <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  Articles
                </button>
                <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  Guides pratiques
                </button>
                <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  Outils
                </button>
                <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  Infographies
                </button>
                <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  Templates
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                <h3 className="font-semibold text-slate-900 mb-4">Catégories</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#" className="flex items-center justify-between text-slate-700 hover:text-blue-600 transition-colors">
                      <span>Menaces courantes</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">24</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="flex items-center justify-between text-slate-700 hover:text-blue-600 transition-colors">
                      <span>Bonnes pratiques</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">18</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="flex items-center justify-between text-slate-700 hover:text-blue-600 transition-colors">
                      <span>Configuration sécurisée</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">15</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="flex items-center justify-between text-slate-700 hover:text-blue-600 transition-colors">
                      <span>Gestion des incidents</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">12</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="flex items-center justify-between text-slate-700 hover:text-blue-600 transition-colors">
                      <span>Protection des données</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">20</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="flex items-center justify-between text-slate-700 hover:text-blue-600 transition-colors">
                      <span>Gouvernance</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">8</span>
                    </Link>
                  </li>
                </ul>

                <div className="mt-8">
                  <h3 className="font-semibold text-slate-900 mb-4">Ressources populaires</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600">4.9/5</span>
                    </div>
                    <Link href="#" className="block text-sm text-blue-600 hover:text-blue-700">
                      Guide de réponse aux incidents
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Article Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                        Menaces
                      </span>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        5 min
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Comprendre et prévenir les attaques de phishing
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Guide complet pour identifier, prévenir et réagir aux tentatives de phishing 
                      ciblant votre organisation.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-500 text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        1,234 vues
                      </div>
                      <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                        Lire l'article
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Guide Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        Guide pratique
                      </span>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Template stratégie cybersécurité ONG
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Modèle complet pour élaborer votre stratégie de cybersécurité adaptée 
                      aux spécificités des ONG.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-500 text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        856 téléchargements
                      </div>
                      <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                        Télécharger
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Tool Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Outil
                      </span>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        Interactif
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Évaluateur de mots de passe
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Outil en ligne pour tester la robustesse de vos mots de passe et 
                      recevoir des recommandations d'amélioration.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-500 text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        2,145 utilisations
                      </div>
                      <Link href="#" className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
                        Utiliser l'outil
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Infographic Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-r from-purple-500 to-violet-500 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                        Infographie
                      </span>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Download className="h-4 w-4 mr-1" />
                        PNG/PDF
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Cybersécurité en entreprise et ONG
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Infographie visuelle présentant les principales mesures de sécurité 
                      à mettre en place dans votre organisation.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-500 text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        1,789 vues
                      </div>
                      <Link href="#" className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center">
                        Voir l'infographie
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* BCM Template Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                        Template
                      </span>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Download className="h-4 w-4 mr-1" />
                        DOCX
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Modèle BCM et Plan de Reprise d'Activité
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Template complet pour élaborer votre Business Continuity Management 
                      et votre Disaster Recovery Plan.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-500 text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        642 téléchargements
                      </div>
                      <Link href="#" className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center">
                        Télécharger
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Data Governance Guide */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium">
                        Guide
                      </span>
                      <div className="flex items-center text-slate-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        15 min
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Gouvernance des données en milieu ONG
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      Guide pratique pour mettre en place une gouvernance efficace 
                      des données dans votre organisation.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-500 text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        923 vues
                      </div>
                      <Link href="#" className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center">
                        Lire le guide
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all">
                  Charger plus de ressources
                </button>
              </div>
            </div>
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
                  src="/assets/logos/logohdaroncy.png"
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
                <li><Link href="#" className="hover:text-white transition-colors">Base de connaissances</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Guides pratiques</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Boîte à outils</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Formation</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Modules de formation</Link></li>
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
    </div>
  );
}
