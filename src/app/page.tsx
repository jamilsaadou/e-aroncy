import Image from "next/image";
import Link from "next/link";
import { Shield, Users, BookOpen, Globe, ChevronRight, Star, Award, Zap, GraduationCap, Lock, Heart } from "lucide-react";
import InteractiveAfricaMap from "@/components/InteractiveAfricaMap";
import HeroSlider from "@/components/HeroSlider";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-slate-600">ONG formées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">15</div>
              <div className="text-slate-600">Pays couverts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-slate-600">Professionnels</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-slate-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Slogan Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-4">
              Notre approche en trois piliers
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              E-ARONCY accompagne les ONG d'Afrique de l'Ouest dans leur transformation numérique sécurisée
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Apprend */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-center">
                <div className="bg-aroncy-gradient p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4">
                  <span className="text-aroncy-blue">Apprend</span>
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Formations progressives adaptées aux réalités des ONG africaines. 
                  Modules interactifs, certifications reconnues et accompagnement personnalisé.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-aroncy-blue rounded-full mr-3"></div>
                    Cybersécurité fondamentale
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-aroncy-blue rounded-full mr-3"></div>
                    Protection des données
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-aroncy-blue rounded-full mr-3"></div>
                    Outils numériques sécurisés
                  </div>
                </div>
                <Link href="/knowledge-base" className="inline-flex items-center mt-6 text-aroncy-blue font-medium hover:text-aroncy-orange transition-colors">
                  Découvrir les formations
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Protège */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-center">
                <div className="bg-aroncy-gradient p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Lock className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4">
                  <span className="text-aroncy-green">Protège</span>
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Solutions pratiques et outils de protection adaptés aux contraintes budgétaires 
                  et techniques des organisations de la société civile.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-aroncy-green rounded-full mr-3"></div>
                    Diagnostic de sécurité
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-aroncy-green rounded-full mr-3"></div>
                    Outils de protection gratuits
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-aroncy-green rounded-full mr-3"></div>
                    Conformité réglementaire
                  </div>
                </div>
                <Link href="/diagnostic" className="inline-flex items-center mt-6 text-aroncy-green font-medium hover:text-aroncy-orange transition-colors">
                  Faire un diagnostic
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Partage */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="text-center">
                <div className="bg-aroncy-gradient p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-display font-bold mb-4">
                  <span className="text-aroncy-orange">Partage</span>
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Communauté collaborative d'entraide et d'échange d'expériences. 
                  Forum actif, groupes de travail et réseau de soutien mutuel.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-aroncy-orange rounded-full mr-3"></div>
                    Forum collaboratif
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-aroncy-orange rounded-full mr-3"></div>
                    Groupes d'entraide
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 bg-aroncy-orange rounded-full mr-3"></div>
                    Veille collaborative
                  </div>
                </div>
                <Link href="/register" className="inline-flex items-center mt-6 text-aroncy-orange font-medium hover:text-aroncy-blue transition-colors">
                  Rejoindre la communauté
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Image Section */}
          <div className="relative max-w-3xl mx-auto">
            <Image
              src="/assets/images/im.jpg"
              alt="Équipe cybersécurité E-ARONCY"
              width={800}
              height={400}
              className="w-full h-auto object-cover rounded-2xl shadow-xl"
            />
            <div className="absolute inset-0 bg-aroncy-gradient opacity-90 rounded-2xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl lg:text-3xl font-display font-bold mb-2">
                  Ensemble, sécurisons l'Afrique de l'Ouest
                </h3>
                <p className="text-lg opacity-90">
                  Une alliance pour un écosystème numérique résilient
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Nos services principaux
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Découvrez nos solutions complètes pour renforcer la cybersécurité de votre organisation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all">
              <div className="bg-blue-600 p-3 rounded-lg w-fit mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Base de connaissances</h3>
              <p className="text-slate-600">Articles, guides pratiques et outils pour maîtriser la cybersécurité</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 hover:shadow-lg transition-all">
              <div className="bg-green-600 p-3 rounded-lg w-fit mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Formation certifiante</h3>
              <p className="text-slate-600">Modules de formation avec certifications reconnues</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100 hover:shadow-lg transition-all">
              <div className="bg-purple-600 p-3 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Communauté active</h3>
              <p className="text-slate-600">Échangez avec des experts et partagez vos expériences</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100 hover:shadow-lg transition-all">
              <div className="bg-orange-600 p-3 rounded-lg w-fit mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Réglementation</h3>
              <p className="text-slate-600">Conformité aux lois et normes d'Afrique de l'Ouest</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Africa Map Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Réglementation en 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Afrique</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explorez les lois et réglementations en cybersécurité dans les pays africains. 
              Cliquez sur un pays pour découvrir son cadre juridique.
            </p>
          </div>

          <InteractiveAfricaMap />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Témoignages
            </h2>
            <p className="text-xl text-slate-600">
              Ce que disent nos partenaires
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4">
                  "E-ARONCY nous a permis de considérablement améliorer notre posture de sécurité. 
                  Les formations sont excellentes et adaptées à nos besoins."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-slate-900">Directeur ONG</div>
                    <div className="text-slate-600 text-sm">Côte d'Ivoire</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Prêt à sécuriser votre organisation ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des centaines d'ONG qui font confiance à E-ARONCY pour leur cybersécurité
          </p>
          <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center">
            Commencer gratuitement
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
