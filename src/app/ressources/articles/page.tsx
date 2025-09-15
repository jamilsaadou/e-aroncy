'use client';

import Link from "next/link";
import Header from '@/components/Header';
import { Shield, Calendar, User, Clock, ChevronRight, FileText, TrendingUp, AlertCircle, Zap, Globe, Users } from "lucide-react";
import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  publishDate: string;
  readTime: string;
  featured: boolean;
  color: string;
  views: number;
  likes: number;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles/public?limit=20');
      const data = await response.json();

      if (data.success) {
        setArticles(data.articles);
      } else {
        setError('Erreur lors du chargement des articles');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

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

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'analyse': <AlertCircle className="h-6 w-6" />,
      'actualites': <FileText className="h-6 w-6" />,
      'guides-pratiques': <Shield className="h-6 w-6" />,
      'formation': <Users className="h-6 w-6" />,
      'boite-outils': <Zap className="h-6 w-6" />,
      'juridique': <Globe className="h-6 w-6" />,
      'innovation': <Zap className="h-6 w-6" />,
      'cas-etude': <TrendingUp className="h-6 w-6" />
    };
    return iconMap[category] || <FileText className="h-6 w-6" />;
  };

  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-blue-600">Accueil</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <Link href="/ressources" className="text-slate-500 hover:text-blue-600">Ressources</Link>
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

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800">{error}</p>
              </div>
              <button 
                onClick={fetchArticles}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-20">
              <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun article disponible</h3>
              <p className="text-slate-600">Les articles seront bientôt disponibles.</p>
            </div>
          )}

          {!loading && !error && featuredArticles.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getColorClasses(article.color)}`}>
                      {getCategoryIcon(article.category)}
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
          )}

          {/* Regular Articles */}
          {!loading && !error && regularArticles.length > 0 && (
            <>
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
                      {getCategoryIcon(article.category)}
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
            </>
          )}
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
