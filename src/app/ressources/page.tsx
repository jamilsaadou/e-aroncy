import Link from "next/link";
import { Shield, ChevronRight, BookOpen, Image, FileText, Wrench, ArrowRight } from "lucide-react";
import Header from "@/components/Header";

export default function Ressources() {
  const resourceCategories = [
    {
      title: "Guides pratiques",
      description: "Des guides étape par étape pour renforcer la cybersécurité de votre organisation.",
      icon: <BookOpen className="h-8 w-8" />,
      href: "/ressources/guides-pratiques",
      color: "blue",
      count: "6 guides",
      features: ["Instructions détaillées", "Exemples concrets", "Téléchargement gratuit"]
    },
    {
      title: "Infographies",
      description: "Des visuels percutants pour communiquer efficacement sur la cybersécurité.",
      icon: <Image className="h-8 w-8" />,
      href: "/ressources/infographies",
      color: "purple",
      count: "50+ infographies",
      features: ["Haute qualité", "Formats variés", "Partage facilité"]
    },
    {
      title: "Articles",
      description: "Analyses approfondies et insights d'experts pour rester à la pointe.",
      icon: <FileText className="h-8 w-8" />,
      href: "/ressources/articles",
      color: "green",
      count: "75+ articles",
      features: ["Analyses expertes", "Cas d'usage", "Mises à jour régulières"]
    },
    {
      title: "Boîte à Outils",
      description: "Une sélection d'outils testés et approuvés par nos experts.",
      icon: <Wrench className="h-8 w-8" />,
      href: "/ressources/boite-outils",
      color: "orange",
      count: "40+ outils",
      features: ["Outils gratuits", "Solutions payantes", "Recommandations expertes"]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      green: "from-green-500 to-green-600",
      orange: "from-orange-500 to-orange-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getHoverColorClasses = (color: string) => {
    const colors = {
      blue: "group-hover:from-blue-600 group-hover:to-blue-700",
      purple: "group-hover:from-purple-600 group-hover:to-purple-700",
      green: "group-hover:from-green-600 group-hover:to-green-700",
      orange: "group-hover:from-orange-600 group-hover:to-orange-700"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

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
            <span className="text-slate-900 font-medium">Ressources</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Centre de Ressources
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Tout ce dont vous avez besoin pour renforcer la cybersécurité de votre organisation. 
              Guides, outils, articles et infographies créés par nos experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#categories" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center">
                Explorer les ressources
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/register" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all text-center">
                Accès complet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section id="categories" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Nos ressources
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Découvrez notre collection complète de ressources pour tous les niveaux
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {resourceCategories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${getColorClasses(category.color)} ${getHoverColorClasses(category.color)} text-white transition-all duration-300`}>
                      {category.icon}
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-slate-500">{category.count}</span>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300 mt-1" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-slate-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Notre impact
            </h2>
            <p className="text-xl text-slate-600">
              Des ressources qui font la différence
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">170+</div>
              <div className="text-slate-600">Ressources disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-slate-600">Téléchargements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-slate-600">Organisations aidées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">15</div>
              <div className="text-slate-600">Pays couverts</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Accédez à toutes nos ressources
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Créez votre compte gratuit pour télécharger toutes nos ressources et rester informé des nouveautés.
          </p>
          <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center">
            Créer un compte gratuit
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
