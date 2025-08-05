import Link from "next/link";
import { Shield, Download, Clock, Users, ChevronRight, BookOpen, Lock, Wifi, Smartphone, Server } from "lucide-react";

export default function GuidesPratiques() {
  const guides = [
    {
      id: 1,
      title: "Guide de sécurisation des mots de passe",
      description: "Apprenez à créer et gérer des mots de passe sécurisés pour votre organisation.",
      category: "Authentification",
      duration: "15 min",
      difficulty: "Débutant",
      downloads: 1250,
      icon: <Lock className="h-6 w-6" />,
      color: "blue",
      topics: ["Création de mots de passe forts", "Gestionnaires de mots de passe", "Authentification à deux facteurs"]
    },
    {
      id: 2,
      title: "Sécurisation du réseau Wi-Fi",
      description: "Protégez votre réseau sans fil contre les intrusions et les attaques.",
      category: "Réseau",
      duration: "20 min",
      difficulty: "Intermédiaire",
      downloads: 980,
      icon: <Wifi className="h-6 w-6" />,
      color: "green",
      topics: ["Configuration WPA3", "Réseaux invités", "Surveillance du trafic"]
    },
    {
      id: 3,
      title: "Sécurité des appareils mobiles",
      description: "Bonnes pratiques pour sécuriser smartphones et tablettes en entreprise.",
      category: "Mobile",
      duration: "25 min",
      difficulty: "Intermédiaire",
      downloads: 756,
      icon: <Smartphone className="h-6 w-6" />,
      color: "purple",
      topics: ["MDM", "Applications sécurisées", "Chiffrement des données"]
    },
    {
      id: 4,
      title: "Sauvegarde et récupération des données",
      description: "Stratégies de sauvegarde pour protéger vos données critiques.",
      category: "Données",
      duration: "30 min",
      difficulty: "Avancé",
      downloads: 642,
      icon: <Server className="h-6 w-6" />,
      color: "orange",
      topics: ["Règle 3-2-1", "Sauvegarde cloud", "Tests de récupération"]
    },
    {
      id: 5,
      title: "Formation du personnel à la cybersécurité",
      description: "Comment sensibiliser et former vos équipes aux risques cyber.",
      category: "Formation",
      duration: "35 min",
      difficulty: "Intermédiaire",
      downloads: 1100,
      icon: <Users className="h-6 w-6" />,
      color: "indigo",
      topics: ["Phishing", "Ingénierie sociale", "Bonnes pratiques"]
    },
    {
      id: 6,
      title: "Plan de réponse aux incidents",
      description: "Élaborez un plan d'action en cas de cyberattaque ou de violation de données.",
      category: "Gestion de crise",
      duration: "40 min",
      difficulty: "Avancé",
      downloads: 523,
      icon: <Shield className="h-6 w-6" />,
      color: "red",
      topics: ["Détection d'incidents", "Procédures d'urgence", "Communication de crise"]
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Débutant": return "bg-green-100 text-green-800";
      case "Intermédiaire": return "bg-yellow-100 text-yellow-800";
      case "Avancé": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
            <span className="text-slate-900 font-medium">Guides pratiques</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Guides pratiques
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Des guides étape par étape pour renforcer la cybersécurité de votre organisation. 
              Chaque guide contient des instructions détaillées et des exemples concrets.
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getColorClasses(guide.color)}`}>
                      {guide.icon}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {guide.description}
                  </p>

                  {/* Topics */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Points clés :</h4>
                    <ul className="space-y-1">
                      {guide.topics.map((topic, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {guide.duration}
                      </div>
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {guide.downloads}
                      </div>
                    </div>
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                      {guide.category}
                    </span>
                  </div>

                  {/* Action */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le guide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Besoin d'un guide personnalisé ?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Notre équipe d'experts peut créer des guides adaptés aux besoins spécifiques de votre organisation.
          </p>
          <Link href="/contact" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center">
            Nous contacter
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
