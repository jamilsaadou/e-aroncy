import Link from "next/link";
import { Shield, Calendar, User, Clock, ChevronRight, FileText, TrendingUp, AlertCircle, Zap, Globe, Users } from "lucide-react";

export default function Articles() {
  const articles = [
    {
      id: 1,
      title: "L'évolution des cybermenaces en Afrique de l'Ouest en 2024",
      excerpt: "Analyse approfondie des nouvelles tendances en matière de cybercriminalité et des défis spécifiques aux organisations de la région.",
      author: "Dr. Aminata Koné",
      authorRole: "Expert en cybersécurité",
      publishDate: "15 Janvier 2025",
      readTime: "8 min",
      category: "Analyse",
      tags: ["Cybermenaces", "Afrique", "Tendances"],
      featured: true,
      color: "red",
      icon: <AlertCircle className="h-6 w-6" />
    },
    {
      id: 2,
      title: "Comment les ONG peuvent-elles se protéger contre le ransomware ?",
      excerpt: "Guide complet pour comprendre, prévenir et réagir face aux attaques de ransomware ciblant les organisations humanitaires.",
      author: "Ibrahim Traoré",
      authorRole: "Consultant en sécurité",
      publishDate: "12 Janvier 2025",
      readTime: "12 min",
      category: "Prévention",
      tags: ["Ransomware", "ONG", "Protection"],
      featured: true,
      color: "orange",
      icon: <Shield className="h-6 w-6" />
    },
    {
      id: 3,
      title: "L'importance de la formation en cybersécurité pour les équipes",
      excerpt: "Pourquoi investir dans la formation de vos collaborateurs est le meilleur rempart contre les cyberattaques.",
      author: "Fatou Diallo",
      authorRole: "Formatrice certifiée",
      publishDate: "10 Janvier 2025",
      readTime: "6 min",
      category: "Formation",
      tags: ["Formation", "Équipes", "Sensibilisation"],
      featured: false,
      color: "blue",
      icon: <Users className="h-6 w-6" />
    },
    {
      id: 4,
      title: "Réglementation GDPR et protection des données en Afrique",
      excerpt: "Comment adapter les principes du RGPD au contexte africain et assurer la conformité de votre organisation.",
      author: "Maître Koffi Asante",
      authorRole: "Juriste spécialisé",
      publishDate: "8 Janvier 2025",
      readTime: "15 min",
      category: "Juridique",
      tags: ["RGPD", "Données", "Conformité"],
      featured: false,
      color: "purple",
      icon: <Globe className="h-6 w-6" />
    },
    {
      id: 5,
      title: "Technologies émergentes et nouveaux défis sécuritaires",
      excerpt: "Intelligence artificielle, IoT, blockchain : comment ces technologies transforment le paysage de la cybersécurité.",
      author: "Prof. Ousmane Ba",
      authorRole: "Chercheur en cybersécurité",
      publishDate: "5 Janvier 2025",
      readTime: "10 min",
      category: "Innovation",
      tags: ["IA", "IoT", "Blockchain"],
      featured: false,
      color: "green",
      icon: <Zap className="h-6 w-6" />
    },
    {
      id: 6,
      title: "Retour d'expérience : Incident de sécurité dans une ONG",
      excerpt: "Étude de cas détaillée d'un incident de sécurité et des leçons apprises pour améliorer la résilience organisationnelle.",
      author: "Marie Kouassi",
      authorRole: "RSSI",
      publishDate: "3 Janvier 2025",
      readTime: "14 min",
      category: "Cas d'étude",
      tags: ["Incident", "Retour d'expérience", "Résilience"],
      featured: false,
      color: "indigo",
      icon: <TrendingUp className="h-6 w-6" />
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

  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

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
            <span className="text-slate-900 font-medium">Articles</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Articles
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Analyses approfondies, retours d'expérience et insights d'experts pour rester à la pointe 
              de la cybersécurité en Afrique de l'Ouest.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Articles à la une</h2>
            <p className="text-xl text-slate-600">Les dernières analyses de nos experts</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getColorClasses(article.color)}`}>
                      {article.icon}
                    </div>
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                      À la une
                    </span>
                  </div>

                  {/* Content */}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${getColorClasses(article.color)}`}>
                    {article.category}
                  </span>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {article.publishDate}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Link href={`/ressources/articles/${article.id}`} className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                    Lire l'article
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Regular Articles */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Tous les articles</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg ${getColorClasses(article.color)}`}>
                      {article.icon}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClasses(article.color)}`}>
                      {article.category}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="text-xs text-slate-500 mb-4">
                    <div className="flex items-center justify-between">
                      <span>{article.author}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <div className="mt-1">{article.publishDate}</div>
                  </div>

                  {/* Action */}
                  <Link href={`/ressources/articles/${article.id}`} className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-lg font-medium hover:bg-slate-200 transition-all flex items-center justify-center text-sm">
                    Lire l'article
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Restez informé
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Recevez nos derniers articles et analyses directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500"
              />
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Explorez par catégorie
            </h2>
            <p className="text-xl text-slate-600">
              Trouvez les articles qui correspondent à vos besoins
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Analyse", count: 12, color: "red" },
              { name: "Prévention", count: 18, color: "orange" },
              { name: "Formation", count: 15, color: "blue" },
              { name: "Juridique", count: 8, color: "purple" },
              { name: "Innovation", count: 10, color: "green" },
              { name: "Cas d'étude", count: 14, color: "indigo" }
            ].map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer">
                <h3 className="font-semibold text-slate-900 mb-2">{category.name}</h3>
                <p className="text-slate-600 text-sm">{category.count} articles</p>
              </div>
            ))}
          </div>
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
