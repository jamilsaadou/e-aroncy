import Link from "next/link";
import Image from "next/image";
import { Shield, BookOpen, ChevronRight, Clock, Users, Award, CheckCircle, PlayCircle, FileText, Download, ArrowLeft, ArrowRight, ImageIcon } from "lucide-react";
import Header from "@/components/Header";

export default function Module1Course() {
  const lessons = [
    {
      id: 1,
      title: "Qu'est-ce que la cybersécurité ?",
      duration: "15 min",
      type: "Vidéo + Quiz",
      completed: false
    },
    {
      id: 2,
      title: "Enjeux spécifiques pour les ONG",
      duration: "20 min",
      type: "Lecture + Exercice",
      completed: false
    },
    {
      id: 3,
      title: "Menaces courantes en Afrique",
      duration: "25 min",
      type: "Étude de cas",
      completed: false
    },
    {
      id: 4,
      title: "Évaluation des risques",
      duration: "30 min",
      type: "Atelier pratique",
      completed: false
    },
    {
      id: 5,
      title: "Quiz final et certification",
      duration: "20 min",
      type: "Évaluation",
      completed: false
    }
  ];

  const objectives = [
    "Comprendre les concepts fondamentaux de la cybersécurité",
    "Identifier les enjeux spécifiques aux ONG en Afrique de l'Ouest",
    "Reconnaître les principales menaces numériques",
    "Évaluer les risques de votre organisation",
    "Développer une approche proactive de la sécurité"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-aroncy-blue">Accueil</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <Link href="/knowledge-base" className="text-slate-500 hover:text-aroncy-blue">Formation</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-medium">Module 1</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-aroncy-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen className="h-4 w-4 mr-2" />
                Module 1 - Formation E-ARONCY
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6">
                Introduction à la cybersécurité pour les ONG
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Découvrez les fondamentaux de la cybersécurité adaptés aux réalités des organisations 
                de la société civile en Afrique de l'Ouest.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center text-white/90">
                  <Clock className="h-5 w-5 mr-2" />
                  2h 30min
                </div>
                <div className="flex items-center text-white/90">
                  <Users className="h-5 w-5 mr-2" />
                  Niveau débutant
                </div>
                <div className="flex items-center text-white/90">
                  <Award className="h-5 w-5 mr-2" />
                  Certificat inclus
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/assets/images/africa-map.jpg"
                alt="Cybersécurité en Afrique"
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-white/10 rounded-2xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-all">
                  <PlayCircle className="h-12 w-12 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course Overview */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
                  À propos de ce module
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Ce module d'introduction vous permettra de comprendre les enjeux de la cybersécurité 
                  dans le contexte spécifique des ONG opérant en Afrique de l'Ouest. Vous découvrirez 
                  les menaces les plus courantes et apprendrez à évaluer les risques pour votre organisation.
                </p>
                
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Objectifs d'apprentissage</h3>
                <div className="space-y-3 mb-8">
                  {objectives.map((objective, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-aroncy-green mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{objective}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-aroncy-light-gray rounded-xl p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Prérequis</h4>
                  <p className="text-slate-700 text-sm">
                    Aucun prérequis technique n'est nécessaire. Ce module est conçu pour les débutants 
                    et s'adresse à tous les membres d'une ONG, quel que soit leur niveau technique.
                  </p>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">
                  Leçon 1 : Qu'est-ce que la cybersécurité ?
                </h2>
                
                {/* Video Player Placeholder */}
                <div className="relative bg-slate-900 rounded-xl overflow-hidden mb-8">
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center text-white">
                      <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-80" />
                      <h3 className="text-xl font-semibold mb-2">Introduction à la cybersécurité</h3>
                      <p className="text-slate-300">Durée : 15 minutes</p>
                    </div>
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Définition de la cybersécurité</h3>
                  <p className="text-slate-700 mb-6 leading-relaxed">
                    La cybersécurité, également appelée sécurité informatique ou sécurité numérique, 
                    désigne l'ensemble des moyens techniques, organisationnels et humains mis en œuvre 
                    pour protéger les systèmes d'information contre les menaces numériques.
                  </p>

                  <div className="bg-blue-50 border-l-4 border-aroncy-blue p-6 mb-6">
                    <h4 className="font-semibold text-aroncy-blue mb-2">💡 Point clé</h4>
                    <p className="text-slate-700 text-sm">
                      Pour les ONG, la cybersécurité ne concerne pas seulement la protection des données, 
                      mais aussi la continuité des missions humanitaires et la protection des bénéficiaires.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Les trois piliers de la cybersécurité</h3>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                      <div className="bg-aroncy-blue text-white p-3 rounded-lg w-fit mb-4">
                        <Shield className="h-6 w-6" />
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Confidentialité</h4>
                      <p className="text-slate-600 text-sm">
                        Garantir que seules les personnes autorisées peuvent accéder aux informations sensibles.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                      <div className="bg-aroncy-green text-white p-3 rounded-lg w-fit mb-4">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Intégrité</h4>
                      <p className="text-slate-600 text-sm">
                        S'assurer que les données ne sont pas modifiées de manière non autorisée.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
                      <div className="bg-aroncy-orange text-white p-3 rounded-lg w-fit mb-4">
                        <Clock className="h-6 w-6" />
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Disponibilité</h4>
                      <p className="text-slate-600 text-sm">
                        Maintenir l'accès aux systèmes et données quand ils sont nécessaires.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Pourquoi la cybersécurité est-elle cruciale pour les ONG ?</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                      <div className="bg-red-100 text-red-600 p-2 rounded-lg flex-shrink-0">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900 mb-1">Protection des bénéficiaires</h5>
                        <p className="text-slate-600 text-sm">
                          Les ONG collectent souvent des données sensibles sur des populations vulnérables. 
                          Une faille de sécurité peut mettre ces personnes en danger.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg flex-shrink-0">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900 mb-1">Continuité des missions</h5>
                        <p className="text-slate-600 text-sm">
                          Une cyberattaque peut paralyser les opérations et empêcher l'aide d'atteindre 
                          ceux qui en ont besoin.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                      <div className="bg-green-100 text-green-600 p-2 rounded-lg flex-shrink-0">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900 mb-1">Confiance des donateurs</h5>
                        <p className="text-slate-600 text-sm">
                          La sécurité des données financières et la transparence sont essentielles 
                          pour maintenir la confiance des bailleurs de fonds.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Attention</h4>
                    <p className="text-yellow-700 text-sm">
                      Les ONG sont souvent ciblées par des cybercriminels car elles sont perçues comme 
                      ayant des systèmes de sécurité moins robustes que les entreprises, tout en gérant 
                      des données précieuses.
                    </p>
                  </div>

                  {/* Quiz Section */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-900 mb-6">Quiz de compréhension</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">
                          1. Quels sont les trois piliers fondamentaux de la cybersécurité ?
                        </h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="radio" name="q1" className="text-aroncy-blue" />
                            <span className="text-slate-700">Confidentialité, Intégrité, Disponibilité</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="radio" name="q1" className="text-aroncy-blue" />
                            <span className="text-slate-700">Sécurité, Protection, Défense</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="radio" name="q1" className="text-aroncy-blue" />
                            <span className="text-slate-700">Prévention, Détection, Réaction</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">
                          2. Pourquoi les ONG sont-elles particulièrement vulnérables aux cyberattaques ?
                        </h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="radio" name="q2" className="text-aroncy-blue" />
                            <span className="text-slate-700">Elles ont moins de ressources pour la sécurité</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="radio" name="q2" className="text-aroncy-blue" />
                            <span className="text-slate-700">Elles gèrent des données sensibles</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="radio" name="q2" className="text-aroncy-blue" />
                            <span className="text-slate-700">Toutes les réponses ci-dessus</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <button className="mt-6 bg-aroncy-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-aroncy-orange transition-colors">
                      Valider mes réponses
                    </button>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200">
                  <Link href="/knowledge-base" className="flex items-center text-slate-600 hover:text-aroncy-blue transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour aux modules
                  </Link>
                  <button className="flex items-center bg-aroncy-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-aroncy-orange transition-colors">
                    Leçon suivante
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Progress */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                <h3 className="font-semibold text-slate-900 mb-4">Progression du module</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Progression</span>
                    <span>20%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-aroncy-gradient h-2 rounded-full" style={{width: '20%'}}></div>
                  </div>
                </div>
                <p className="text-sm text-slate-600">1 leçon sur 5 complétée</p>
              </div>

              {/* Lessons List */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                <h3 className="font-semibold text-slate-900 mb-4">Plan du module</h3>
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      index === 0 
                        ? 'bg-aroncy-blue bg-opacity-10 border-aroncy-blue' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium text-sm ${
                          index === 0 ? 'text-aroncy-blue' : 'text-slate-900'
                        }`}>
                          {lesson.title}
                        </h4>
                        {lesson.completed && (
                          <CheckCircle className="h-4 w-4 text-aroncy-green" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{lesson.duration}</span>
                        <span>{lesson.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Ressources complémentaires</h3>
                <div className="space-y-3">
                  <Link href="#" className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <FileText className="h-5 w-5 text-aroncy-blue" />
                    <div>
                      <div className="font-medium text-slate-900 text-sm">Guide de démarrage</div>
                      <div className="text-xs text-slate-500">PDF - 2.3 MB</div>
                    </div>
                  </Link>
                  <Link href="#" className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <Download className="h-5 w-5 text-aroncy-green" />
                    <div>
                      <div className="font-medium text-slate-900 text-sm">Checklist sécurité</div>
                      <div className="text-xs text-slate-500">DOCX - 156 KB</div>
                    </div>
                  </Link>
                  <Link href="https://api-magazine.com/wp-content/uploads/2014/09/africa.jpg" className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <ImageIcon className="h-5 w-5 text-aroncy-orange" />
                    <div>
                      <div className="font-medium text-slate-900 text-sm">Infographie Afrique</div>
                      <div className="text-xs text-slate-500">Lien externe</div>
                    </div>
                  </Link>
                </div>
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
              <h3 className="font-semibold mb-4">Formation</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/knowledge-base" className="hover:text-white transition-colors">Tous les modules</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Certifications</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Ressources</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Aide</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Communauté</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Forum</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Événements</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
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
