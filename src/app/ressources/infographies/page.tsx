import Link from "next/link";
import { Shield, Download, Eye, Share2, ChevronRight, Image, TrendingUp, Users, Lock, Wifi, AlertTriangle } from "lucide-react";

export default function Infographies() {
  const infographies = [
    {
      id: 1,
      title: "Les 10 règles d'or de la cybersécurité",
      description: "Une infographie complète présentant les bonnes pratiques essentielles pour protéger votre organisation.",
      category: "Bonnes pratiques",
      views: 2450,
      downloads: 890,
      shares: 156,
      format: "PNG",
      size: "2.1 MB",
      dimensions: "1080x1920",
      color: "blue",
      icon: <Lock className="h-6 w-6" />,
      tags: ["Sécurité", "Bonnes pratiques", "Formation"]
    },
    {
      id: 2,
      title: "Anatomie d'une attaque de phishing",
      description: "Décryptage visuel des techniques utilisées par les cybercriminels dans les attaques de phishing.",
      category: "Sensibilisation",
      views: 1890,
      downloads: 654,
      shares: 203,
      format: "PNG",
      size: "1.8 MB",
      dimensions: "1080x1350",
      color: "red",
      icon: <AlertTriangle className="h-6 w-6" />,
      tags: ["Phishing", "Email", "Sensibilisation"]
    },
    {
      id: 3,
      title: "Sécurisation du télétravail",
      description: "Guide visuel pour maintenir la sécurité lors du travail à distance.",
      category: "Télétravail",
      views: 3200,
      downloads: 1120,
      shares: 287,
      format: "PNG",
      size: "2.5 MB",
      dimensions: "1080x1920",
      color: "green",
      icon: <Wifi className="h-6 w-6" />,
      tags: ["Télétravail", "VPN", "Sécurité"]
    },
    {
      id: 4,
      title: "Statistiques cybersécurité 2024",
      description: "Les chiffres clés de la cybersécurité en Afrique de l'Ouest pour l'année 2024.",
      category: "Statistiques",
      views: 1650,
      downloads: 445,
      shares: 98,
      format: "PNG",
      size: "1.9 MB",
      dimensions: "1080x1350",
      color: "purple",
      icon: <TrendingUp className="h-6 w-6" />,
      tags: ["Statistiques", "Afrique", "Tendances"]
    },
    {
      id: 5,
      title: "Formation cybersécurité pour les équipes",
      description: "Programme de sensibilisation visuel pour former vos collaborateurs.",
      category: "Formation",
      views: 2100,
      downloads: 723,
      shares: 134,
      format: "PNG",
      size: "2.3 MB",
      dimensions: "1080x1920",
      color: "indigo",
      icon: <Users className="h-6 w-6" />,
      tags: ["Formation", "Équipes", "Sensibilisation"]
    },
    {
      id: 6,
      title: "Checklist sécurité pour ONG",
      description: "Liste de vérification visuelle spécialement conçue pour les organisations non gouvernementales.",
      category: "Checklist",
      views: 1780,
      downloads: 612,
      shares: 89,
      format: "PNG",
      size: "2.0 MB",
      dimensions: "1080x1350",
      color: "orange",
      icon: <Shield className="h-6 w-6" />,
      tags: ["ONG", "Checklist", "Audit"]
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

  const getBgColorClasses = (color: string) => {
    const colors = {
      blue: "bg-gradient-to-br from-blue-500 to-blue-600",
      green: "bg-gradient-to-br from-green-500 to-green-600",
      purple: "bg-gradient-to-br from-purple-500 to-purple-600",
      orange: "bg-gradient-to-br from-orange-500 to-orange-600",
      indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      red: "bg-gradient-to-br from-red-500 to-red-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
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
            <span className="text-slate-900 font-medium">Infographies</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Image className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Infographies
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Des visuels percutants pour communiquer efficacement sur la cybersécurité. 
              Parfaits pour sensibiliser vos équipes et partager les bonnes pratiques.
            </p>
          </div>
        </div>
      </section>

      {/* Infographies Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {infographies.map((infographie) => (
              <div key={infographie.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                {/* Preview Image */}
                <div className={`h-48 ${getBgColorClasses(infographie.color)} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/80">
                      {infographie.icon}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                      {infographie.format}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all">
                        <Eye className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClasses(infographie.color)}`}>
                      {infographie.category}
                    </span>
                    <div className="text-xs text-slate-500">
                      {infographie.dimensions}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {infographie.title}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {infographie.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {infographie.tags.map((tag, index) => (
                      <span key={index} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {infographie.views}
                      </div>
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {infographie.downloads}
                      </div>
                      <div className="flex items-center">
                        <Share2 className="h-4 w-4 mr-1" />
                        {infographie.shares}
                      </div>
                    </div>
                    <span className="text-xs">
                      {infographie.size}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </button>
                    <button className="bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Impact de nos infographies
            </h2>
            <p className="text-xl text-slate-600">
              Des visuels qui font la différence dans la sensibilisation
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">15K+</div>
              <div className="text-slate-600">Téléchargements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-pink-600 mb-2">25K+</div>
              <div className="text-slate-600">Vues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">2K+</div>
              <div className="text-slate-600">Partages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-slate-600">Infographies</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Besoin d'infographies personnalisées ?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Notre équipe de designers peut créer des infographies sur mesure pour votre organisation.
          </p>
          <Link href="/contact" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-all inline-flex items-center">
            Demander un devis
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
