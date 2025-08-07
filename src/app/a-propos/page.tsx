import Link from "next/link";
import Image from "next/image";
import { Shield, Users, Globe, Target, Heart, Award, ChevronRight, MapPin, Calendar, TrendingUp, BookOpen, AlertTriangle, Gavel, MessageSquare, BarChart3, Eye, UserCheck } from "lucide-react";
import Header from "@/components/Header";

export default function APropos() {
  const stats = [
    { number: "3", label: "Pays (Phase 1)", icon: <Globe className="h-6 w-6" /> },
    { number: "2023", label: "Lancement", icon: <Calendar className="h-6 w-6" /> },
    { number: "Multi", label: "Acteurs", icon: <Users className="h-6 w-6" /> },
    { number: "Ouest", label: "Afrique", icon: <MapPin className="h-6 w-6" /> }
  ];

  const objectives = [
    {
      title: "Renforcement des capacités",
      description: "Renforcer les capacités techniques et organisationnelles des ONG en cybersécurité.",
      icon: <Shield className="h-8 w-8" />,
      color: "blue"
    },
    {
      title: "Conformité réglementaire",
      description: "Promouvoir la conformité avec les lois sur la protection des données (RGPD, lois locales, etc.).",
      icon: <Gavel className="h-8 w-8" />,
      color: "green"
    },
    {
      title: "Communauté régionale",
      description: "Créer une communauté régionale de pratiques et de soutien mutuel.",
      icon: <Users className="h-8 w-8" />,
      color: "purple"
    },
    {
      title: "Veille active",
      description: "Fournir une veille active sur les menaces numériques et les réponses adaptées.",
      icon: <Eye className="h-8 w-8" />,
      color: "orange"
    },
    {
      title: "Outils contextualisés",
      description: "Offrir des outils, formations et accompagnements contextualisés pour les réalités des ONG.",
      icon: <Target className="h-8 w-8" />,
      color: "red"
    }
  ];

  const platformServices = [
    {
      title: "Formations progressives",
      description: "Cybersécurité, protection des données, outils numériques",
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      title: "Ressources juridiques et opérationnelles",
      description: "Modèles, guides, vidéos",
      icon: <Gavel className="h-6 w-6" />
    },
    {
      title: "Forum collaboratif",
      description: "Groupes d'entraide et échanges",
      icon: <MessageSquare className="h-6 w-6" />
    },
    {
      title: "Outils de diagnostic",
      description: "Auto-évaluation de la maturité cyber",
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      title: "Système d'alertes",
      description: "Veille sur les cybermenaces",
      icon: <AlertTriangle className="h-6 w-6" />
    }
  ];

  const participants = [
    {
      title: "ONG locales, nationales et régionales",
      icon: <Heart className="h-6 w-6" />
    },
    {
      title: "Autorités étatiques et agences nationales de cybersécurité",
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Autorités de protection des données (ANSI, HAPDP, CNDP, APDP, etc.)",
      icon: <UserCheck className="h-6 w-6" />
    },
    {
      title: "Partenaires techniques et financiers engagés dans la transformation numérique sécurisée des OSC",
      icon: <Globe className="h-6 w-6" />
    }
  ];

  const governance = [
    "Représentants des ONG membres",
    "Experts en cybersécurité",
    "Représentants des institutions étatiques",
    "Organisations partenaires régionales",
    "Bailleurs de fonds impliqués"
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      red: "from-red-500 to-red-600"
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
      <section className="py-20 bg-aroncy-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-display font-bold mb-6">
                À propos d'E-ARONCY
              </h1>
              <h2 className="text-2xl lg:text-3xl font-display font-semibold mb-6 text-white/90">
                Alliance Régionale pour la Cybersécurité des ONG en Afrique de l'Ouest
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                ARONCY est une initiative collaborative dédiée à renforcer la cybersécurité 
                des organisations de la société civile en Afrique de l'Ouest, en offrant 
                des formations, des ressources et un accompagnement adapté aux réalités locales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center justify-center">
                  Rejoindre l'alliance
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
                alt="Carte de l'Afrique de l'Ouest"
                width={500}
                height={400}
                className="w-full h-auto object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/assets/images/team-apropos.jpeg"
                alt="Vision ARONCY"
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Globe className="h-4 w-4 mr-2" />
                Notre Vision
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Un écosystème numérique sûr et inclusif
              </h2>
              <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                Favoriser un écosystème numérique sûr, résilient et inclusif pour les ONG 
                opérant en Afrique de l'Ouest, afin de protéger efficacement les données sensibles 
                des communautés et garantir la continuité de leurs missions sociales.
              </p>
              <p className="text-lg text-slate-600 mb-8">
                Notre vision s'articule autour de la protection des données des communautés 
                vulnérables et de l'accompagnement des organisations dans leur transformation 
                numérique sécurisée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Implémentation actuelle
            </h2>
            <p className="text-xl text-slate-600">
              Un déploiement progressif à travers l'Afrique de l'Ouest
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
          
          <div className="mt-12 bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Phase 1 (2023–2024)
                </h3>
                <p className="text-slate-600 mb-4">Déploiement initial dans trois pays pilotes :</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-slate-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Côte d'Ivoire
                  </li>
                  <li className="flex items-center text-slate-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Burkina Faso
                  </li>
                  <li className="flex items-center text-slate-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Niger
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Phase 2 (2024–2025)
                </h3>
                <p className="text-slate-600 mb-4">Extension vers d'autres pays d'Afrique de l'Ouest</p>
                <p className="text-slate-700">
                  Élargissement progressif de l'alliance pour couvrir l'ensemble de la région 
                  ouest-africaine avec des adaptations locales spécifiques.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Nos Objectifs
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Cinq axes stratégiques pour renforcer la cybersécurité des ONG
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectives.map((objective, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-all">
                <div className={`bg-gradient-to-r ${getColorClasses(objective.color)} text-white p-3 rounded-lg w-fit mb-6`}>
                  {objective.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {objective.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {objective.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Services Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Ce que propose la plateforme E-ARONCY
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Des services complets pour accompagner les ONG dans leur sécurisation numérique
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg w-fit mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participants Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Qui participe ?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Un écosystème multi-acteurs pour une approche collaborative
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {participants.map((participant, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg flex-shrink-0">
                    {participant.icon}
                  </div>
                  <div>
                    <p className="text-slate-700 leading-relaxed">
                      {participant.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Gouvernance du programme ARONCY
            </h2>
            <p className="text-xl text-slate-600">
              Un comité de pilotage multi-acteurs pour une gouvernance inclusive
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg w-fit mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Comité de pilotage multi-acteurs
              </h3>
              <p className="text-slate-600">
                Composé de représentants de tous les secteurs impliqués
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {governance.map((member, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <span className="text-slate-700 font-medium">{member}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Rejoignez l'Alliance ARONCY
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Ensemble, construisons un écosystème numérique sûr et résilient pour l'Afrique de l'Ouest
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center justify-center">
              Rejoindre l'alliance
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
                <Image
                  src="/assets/logos/Logo e-aroncy.png"
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
                <li><Link href="/diagnostic" className="hover:text-white transition-colors">Diagnostic cyber</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Webinaires</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Alliance</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Devenir membre</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Partenaires</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 E-ARONCY - Alliance Régionale pour la Cybersécurité des ONG en Afrique de l'Ouest. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
