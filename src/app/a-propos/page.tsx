import Link from "next/link";
import Image from "next/image";
import { Shield, Users, Globe, Target, Heart, Award, ChevronRight, MapPin, Calendar, TrendingUp } from "lucide-react";
import Header from "@/components/Header";

export default function APropos() {
  const stats = [
    { number: "500+", label: "ONG accompagnées", icon: <Users className="h-6 w-6" /> },
    { number: "15", label: "Pays couverts", icon: <Globe className="h-6 w-6" /> },
    { number: "10K+", label: "Professionnels formés", icon: <Award className="h-6 w-6" /> },
    { number: "2019", label: "Année de création", icon: <Calendar className="h-6 w-6" /> }
  ];

  const values = [
    {
      title: "Collaboration",
      description: "Nous croyons en la force du partage de connaissances et de l'entraide entre organisations.",
      icon: <Users className="h-8 w-8" />,
      color: "blue"
    },
    {
      title: "Excellence",
      description: "Nous nous engageons à fournir des ressources et formations de la plus haute qualité.",
      icon: <Award className="h-8 w-8" />,
      color: "green"
    },
    {
      title: "Accessibilité",
      description: "La cybersécurité doit être accessible à toutes les organisations, quelle que soit leur taille.",
      icon: <Heart className="h-8 w-8" />,
      color: "purple"
    },
    {
      title: "Innovation",
      description: "Nous adaptons continuellement nos approches aux défis émergents de la cybersécurité.",
      icon: <TrendingUp className="h-8 w-8" />,
      color: "orange"
    }
  ];

  const team = [
    {
      name: "Dr. Amadou Diallo",
      role: "Directeur Exécutif",
      description: "Expert en cybersécurité avec 15 ans d'expérience en Afrique de l'Ouest",
      image: "/assets/images/team-apropos.jpeg"
    },
    {
      name: "Fatima Traoré",
      role: "Responsable Formation",
      description: "Spécialiste en pédagogie numérique et développement de capacités",
      image: "/assets/images/team-apropos.jpeg"
    },
    {
      name: "Ibrahim Koné",
      role: "Expert Technique",
      description: "Ingénieur sécurité et consultant en gouvernance des données",
      image: "/assets/images/team-apropos.jpeg"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600"
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
            <span className="text-slate-900 font-medium">À propos</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                À propos d'E-ARONCY
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                E-ARONCY est la première plateforme collaborative dédiée à la cybersécurité 
                en Afrique de l'Ouest. Nous accompagnons les ONG et organisations dans leur 
                transformation numérique sécurisée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center justify-center">
                  Rejoindre la communauté
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/knowledge-base" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all text-center">
                  Découvrir nos formations
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/assets/images/africa-map.jpg"
                alt="Carte de l'Afrique"
                width={500}
                height={400}
                className="w-full h-auto object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/assets/images/team-apropos.jpeg"
                alt="Équipe E-ARONCY"
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Target className="h-4 w-4 mr-2" />
                Notre Mission
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Démocratiser la cybersécurité en Afrique de l'Ouest
              </h2>
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                Notre mission est de rendre la cybersécurité accessible à toutes les organisations 
                d'Afrique de l'Ouest, en particulier les ONG et les PME qui constituent l'épine 
                dorsale du développement économique et social de la région.
              </p>
              <p className="text-lg text-slate-600 mb-8">
                Nous croyons que chaque organisation, quelle que soit sa taille ou ses ressources, 
                mérite d'être protégée contre les cybermenaces croissantes qui pèsent sur notre 
                écosystème numérique.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-slate-700">
                    <strong>Formation accessible :</strong> Contenus adaptés aux réalités locales
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-slate-700">
                    <strong>Communauté collaborative :</strong> Partage d'expériences et d'expertise
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-slate-700">
                    <strong>Ressources gratuites :</strong> Outils et guides pratiques librement accessibles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Notre impact en chiffres
            </h2>
            <p className="text-xl text-slate-600">
              Des résultats concrets au service de la cybersécurité africaine
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center hover:shadow-lg transition-all">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg w-fit mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Nos valeurs
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Les principes qui guident notre action quotidienne
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-all">
                <div className={`bg-gradient-to-r ${getColorClasses(value.color)} text-white p-3 rounded-lg w-fit mb-6`}>
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Notre équipe
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Des experts passionnés au service de la cybersécurité africaine
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {member.name}
                  </h3>
                  <div className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </div>
                  <p className="text-slate-600 text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Globe className="h-4 w-4 mr-2" />
            Notre Vision
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
            Une Afrique de l'Ouest cyber-résiliente
          </h2>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Nous envisageons un avenir où chaque organisation en Afrique de l'Ouest dispose 
            des connaissances, des outils et du soutien communautaire nécessaires pour 
            prospérer dans l'économie numérique en toute sécurité.
          </p>
          <p className="text-lg text-slate-600 mb-12">
            Notre vision s'articule autour de trois piliers fondamentaux qui reflètent 
            notre approche holistique de la cybersécurité.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <div className="bg-blue-600 text-white p-3 rounded-lg w-fit mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Apprend</h3>
              <p className="text-slate-600 text-sm">
                Formations continues et ressources adaptées aux défis locaux
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <div className="bg-green-600 text-white p-3 rounded-lg w-fit mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Protège</h3>
              <p className="text-slate-600 text-sm">
                Solutions pratiques et outils de protection accessibles
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
              <div className="bg-purple-600 text-white p-3 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Partage</h3>
              <p className="text-slate-600 text-sm">
                Communauté collaborative et échange d'expériences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Rejoignez notre mission
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Ensemble, construisons une Afrique de l'Ouest plus sûre dans le cyberespace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center justify-center">
              Créer un compte gratuit
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/knowledge-base" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all text-center">
              Explorer nos ressources
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
