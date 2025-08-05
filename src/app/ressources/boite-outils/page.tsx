import Link from "next/link";
import { Shield, Download, Star, ExternalLink, ChevronRight, Wrench, Lock, Scan, AlertTriangle, Database, Wifi, Smartphone } from "lucide-react";

export default function BoiteOutils() {
  const tools = [
    {
      id: 1,
      name: "Password Manager Pro",
      description: "Gestionnaire de mots de passe professionnel avec chiffrement AES-256 et authentification multi-facteurs.",
      category: "Authentification",
      type: "Logiciel",
      platform: "Windows, macOS, Linux",
      price: "Gratuit",
      rating: 4.8,
      downloads: 15420,
      features: ["Génération de mots de passe", "Synchronisation cloud", "Audit de sécurité", "Partage sécurisé"],
      color: "blue",
      icon: <Lock className="h-6 w-6" />,
      recommended: true
    },
    {
      id: 2,
      name: "Network Scanner Plus",
      description: "Outil de scan réseau pour identifier les vulnérabilités et surveiller les connexions suspectes.",
      category: "Réseau",
      type: "Outil",
      platform: "Web, Windows",
      price: "Freemium",
      rating: 4.6,
      downloads: 8930,
      features: ["Scan de ports", "Détection d'intrusion", "Cartographie réseau", "Alertes temps réel"],
      color: "green",
      icon: <Scan className="h-6 w-6" />,
      recommended: true
    },
    {
      id: 3,
      name: "Phishing Detector",
      description: "Extension de navigateur pour détecter et bloquer les tentatives de phishing en temps réel.",
      category: "Email",
      type: "Extension",
      platform: "Chrome, Firefox, Safari",
      price: "Gratuit",
      rating: 4.7,
      downloads: 12650,
      features: ["Détection en temps réel", "Base de données mise à jour", "Rapports détaillés", "Formation intégrée"],
      color: "red",
      icon: <AlertTriangle className="h-6 w-6" />,
      recommended: false
    },
    {
      id: 4,
      name: "Data Backup Wizard",
      description: "Solution de sauvegarde automatisée avec chiffrement et stockage cloud sécurisé.",
      category: "Sauvegarde",
      type: "Service",
      platform: "Multi-plateforme",
      price: "29€/mois",
      rating: 4.9,
      downloads: 5670,
      features: ["Sauvegarde automatique", "Chiffrement bout en bout", "Versioning", "Restauration rapide"],
      color: "purple",
      icon: <Database className="h-6 w-6" />,
      recommended: true
    },
    {
      id: 5,
      name: "WiFi Security Analyzer",
      description: "Analyseur de sécurité Wi-Fi pour auditer et sécuriser vos réseaux sans fil.",
      category: "Réseau",
      type: "Outil",
      platform: "Windows, Android",
      price: "Gratuit",
      rating: 4.4,
      downloads: 7890,
      features: ["Analyse WPA/WEP", "Détection de points d'accès", "Test de pénétration", "Rapports détaillés"],
      color: "orange",
      icon: <Wifi className="h-6 w-6" />,
      recommended: false
    },
    {
      id: 6,
      name: "Mobile Device Manager",
      description: "Gestion centralisée des appareils mobiles avec politiques de sécurité avancées.",
      category: "Mobile",
      type: "Plateforme",
      platform: "iOS, Android",
      price: "15€/appareil/mois",
      rating: 4.5,
      downloads: 3420,
      features: ["Gestion à distance", "Effacement sécurisé", "Politiques de conformité", "Géolocalisation"],
      color: "indigo",
      icon: <Smartphone className="h-6 w-6" />,
      recommended: false
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-800",
      green: "bg-green-50 border-green-200 text-green-800",
      purple: "bg-purple-50 border-purple-200 text-purple-800",
      orange: "bg-orange-50 border-orange-200 text-orange-800",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-800",
      red: "bg-red-50 border-red-200 text-red-800"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getPriceColor = (price: string) => {
    if (price === "Gratuit") return "text-green-600 font-semibold";
    if (price === "Freemium") return "text-blue-600 font-semibold";
    return "text-slate-900 font-semibold";
  };

  const recommendedTools = tools.filter(tool => tool.recommended);
  const allTools = tools;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  E-ARONCY
                </span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-slate-700 hover:text-blue-600 transition-colors">Accueil</Link>
              <Link href="/knowledge-base" className="text-slate-700 hover:text-blue-600 transition-colors">Formation</Link>
              <Link href="#" className="text-blue-600 font-medium">Ressources</Link>
              <Link href="#" className="text-slate-700 hover:text-blue-600 transition-colors">Communauté</Link>
              <Link href="#" className="text-slate-700 hover:text-blue-600 transition-colors">Contact</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-slate-700 hover:text-blue-600 transition-colors">
                Connexion
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-blue-600">Accueil</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <Link href="#" className="text-slate-500 hover:text-blue-600">Ressources</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-medium">Boîte à Outils Cybersécurité</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Wrench className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Boîte à Outils Cybersécurité
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Une sélection d'outils testés et approuvés par nos experts pour renforcer 
              la sécurité de votre organisation. Gratuits et payants.
            </p>
          </div>
        </div>
      </section>

      {/* Recommended Tools */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Outils recommandés</h2>
            <p className="text-xl text-slate-600">Nos coups de cœur pour débuter en cybersécurité</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {recommendedTools.map((tool) => (
              <div key={tool.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getColorClasses(tool.color)}`}>
                      {tool.icon}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Recommandé
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-600 ml-1">{tool.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {tool.name}
                    </h3>
                    <span className={`text-lg ${getPriceColor(tool.price)}`}>
                      {tool.price}
                    </span>
                  </div>
                  
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${getColorClasses(tool.color)}`}>
                    {tool.category}
                  </span>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Fonctionnalités principales :</h4>
                    <ul className="grid grid-cols-2 gap-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                    <div className="flex items-center space-x-4">
                      <span>{tool.platform}</span>
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {tool.downloads}
                      </div>
                    </div>
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                      {tool.type}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </button>
                    <button className="bg-slate-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Tools */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Tous les outils</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTools.map((tool) => (
              <div key={tool.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg ${getColorClasses(tool.color)}`}>
                      {tool.icon}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center mb-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-slate-600 ml-1">{tool.rating}</span>
                      </div>
                      <span className={`text-sm ${getPriceColor(tool.price)}`}>
                        {tool.price}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getColorClasses(tool.color)}`}>
                    {tool.category}
                  </span>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Features (limited) */}
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {tool.features.slice(0, 2).map((feature, index) => (
                        <li key={index} className="text-xs text-slate-600 flex items-center">
                          <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Meta */}
                  <div className="text-xs text-slate-500 mb-4">
                    <div className="flex items-center justify-between">
                      <span>{tool.type}</span>
                      <div className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {tool.downloads}
                      </div>
                    </div>
                    <div className="mt-1">{tool.platform}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-slate-100 text-slate-700 py-2 px-3 rounded-lg font-medium hover:bg-slate-200 transition-all flex items-center justify-center text-sm">
                      <Download className="h-3 w-3 mr-1" />
                      Obtenir
                    </button>
                    <button className="bg-slate-100 text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center">
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Catégories d'outils
            </h2>
            <p className="text-xl text-slate-600">
              Trouvez les outils adaptés à vos besoins spécifiques
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Authentification", count: 8, icon: <Lock className="h-6 w-6" />, color: "blue" },
              { name: "Réseau", count: 12, icon: <Wifi className="h-6 w-6" />, color: "green" },
              { name: "Email", count: 6, icon: <AlertTriangle className="h-6 w-6" />, color: "red" },
              { name: "Sauvegarde", count: 5, icon: <Database className="h-6 w-6" />, color: "purple" },
              { name: "Mobile", count: 7, icon: <Smartphone className="h-6 w-6" />, color: "indigo" },
              { name: "Audit", count: 9, icon: <Scan className="h-6 w-6" />, color: "orange" }
            ].map((category, index) => (
              <div key={index} className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer ${getColorClasses(category.color)}`}>
                <div className="flex items-center mb-3">
                  {category.icon}
                  <h3 className="font-semibold ml-3">{category.name}</h3>
                </div>
                <p className="text-sm opacity-80">{category.count} outils disponibles</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Besoin d'aide pour choisir ?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Nos experts peuvent vous conseiller sur les meilleurs outils pour votre organisation.
          </p>
          <Link href="/contact" className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-all inline-flex items-center">
            Demander conseil
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">E-ARONCY</span>
              </div>
              <p className="text-slate-400">
                Plateforme collaborative pour la cybersécurité en Afrique de l'Ouest
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/ressources/guides-pratiques" className="hover:text-white transition-colors">Guides pratiques</Link></li>
                <li><Link href="/ressources/infographies" className="hover:text-white transition-colors">Infographies</Link></li>
                <li><Link href="/ressources/articles" className="hover:text-white transition-colors">Articles</Link></li>
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
    </div>
  );
}
