'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/Header';
import { 
  Shield, 
  ChevronRight, 
  BookOpen, 
  Download, 
  Clock,
  Search,
  Filter,
  Lock,
  Eye,
  Settings,
  Users,
  AlertTriangle,
  Database,
  FileCheck,
  BarChart3,
  Star,
  Zap,
  CheckCircle,
  FileText,
  Calendar,
  User,
  Target
} from 'lucide-react';

export default function GuidesPratiquesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedChecklist, setExpandedChecklist] = useState(false);

  // Guide unique basé sur le contenu fourni
  const mainGuide = {
    id: 1,
    title: "Plan d'Action Cybersécurité pour les ONG",
    description: "",
    category: "Plan complet",
    difficulty: "Pour professionnels",
    duration: "Plan complet",
    downloads: "2.5k",
    rating: 4.9,
    color: "blue",
    icon: <Shield className="h-6 w-6" />,
    topics: [
      "Cadre NIST (5 fonctions essentielles)",
      "Cyber-hygiène accessible",
      "Approche progressive",
      "Conformité réglementaire",
      "Gestion des incidents"
    ],
    content: {
      introduction: "La cybersécurité est aujourd'hui un enjeu stratégique pour toutes les organisations, y compris les ONG. Ce plan repose sur les principes du cadre NIST et la cyberhygiène essentielle.",
      sections: [
        "Mesures de protection fondamentales",
        "Mesures de protection exécutables", 
        "Gouvernance et conformité",
        "Protection des données personnelles",
        "Plan opérationnel en 5 phases"
      ]
    }
  };

  // Plan avancé basé sur le contenu fourni
  const advancedPlan = {
    id: 2,
    title: "Plan avancé de mise en œuvre de la cyber résilience pour ONG",
    description: "Cadre pratique pour la cyber résilience des ONG, conforme aux normes CIS et NIST.",
    category: "Plan avancé",
    difficulty: "Pour professionnels",
    duration: "Guide complet",
    downloads: "1.8k",
    rating: 4.8,
    color: "green",
    icon: <BookOpen className="h-6 w-6" />,
    topics: [
      "Prévention des incidents cyber",
      "Continuité des activités",
      "Protection des données",
      "Culture de cybersécurité",
      "Conformité CIS et NIST"
    ],
    sections: [
      {
        title: "1. Identification – Connaître son environnement",
        content: "Inventaire des équipements et logiciels, gestion structurée des données, inventaire des comptes utilisateurs et privilèges associés."
      },
      {
        title: "2. Protection – Configurations sécurisées et gestion des accès", 
        content: "Configurations systèmes et réseau sécurisées, mots de passe uniques, authentification multifacteur, gestion des vulnérabilités."
      },
      {
        title: "3. Défense contre les logiciels malveillants",
        content: "Restrictions sur logiciels, filtrage DNS et anti-maliciels, blocage des exécutions automatiques sur supports amovibles."
      },
      {
        title: "4. Sensibilisation et formation",
        content: "Programmes réguliers de sensibilisation, simulations de phishing, formation au signalement rapide des incidents."
      },
      {
        title: "5. Détection et intervention", 
        content: "Équipe dédiée à la gestion des incidents, processus de signalement intégré, gestion et analyse des journaux."
      },
      {
        title: "6. Récupération et continuité",
        content: "Processus de récupération documenté, sauvegardes automatisées et chiffrées, plan de reprise des activités critiques."
      },
      {
        title: "7. Réglementation et protection des données",
        content: "Respect des lois locales et internationales, classification des données, consentement éclairé des bénéficiaires."
      },
      {
        title: "8. Suivi et amélioration continue",
        content: "Audits réguliers de cybersécurité, tests de pénétration, mise à jour continue des mesures de protection."
      }
    ]
  };

  // Checklist opérationnelle cybersécurité ONG
  const checklistGuide = {
    id: 3,
    title: "Checklist opérationnelle cybersécurité ONG",
    description: "Outil d'évaluation pratique du niveau de cybersécurité des ONG avec indicateurs de suivi.",
    category: "Checklist",
    difficulty: "Opérationnel",
    duration: "Outil pratique",
    downloads: "950",
    rating: 4.7,
    color: "purple",
    icon: <FileCheck className="h-6 w-6" />,
    topics: [
      "22 mesures organisées",
      "Indicateurs de suivi",
      "Responsabilités définies",
      "Classification par type",
      "Conformité NIST et CIS"
    ],
    checklistItems: [
      {
        category: "Identification",
        fonction: "Identification",
        mesure: "Inventaire détaillé des équipements",
        type: "Fondamentale",
        responsable: "Référent IT / Prestataire",
        frequence: "Mensuel",
        indicateur: "Liste à jour et vérifiée"
      },
      {
        category: "Identification",
        fonction: "Identification", 
        mesure: "Inventaire des logiciels",
        type: "Fondamentale",
        responsable: "Référent IT / Prestataire",
        frequence: "Mensuel",
        indicateur: "Liste complète, versions et support à jour"
      },
      {
        category: "Identification",
        fonction: "Identification",
        mesure: "Gestion des données (classification, suivi)",
        type: "Fondamentale",
        responsable: "Référent IT / Responsable data",
        frequence: "Trimestriel",
        indicateur: "Données classifiées et accès documentés"
      },
      {
        category: "Identification",
        fonction: "Identification",
        mesure: "Inventaire des comptes utilisateurs",
        type: "Fondamentale",
        responsable: "Référent IT / RH",
        frequence: "Mensuel",
        indicateur: "Comptes recensés et privilèges documentés"
      },
      {
        category: "Protection",
        fonction: "Protection",
        mesure: "Configuration sécurisée des systèmes",
        type: "Fondamentale",
        responsable: "Référent IT / Prestataire",
        frequence: "Semestriel",
        indicateur: "Rapport de conformité des configurations"
      },
      {
        category: "Protection",
        fonction: "Protection",
        mesure: "Configuration sécurisée réseau",
        type: "Fondamentale",
        responsable: "Référent IT / Prestataire",
        frequence: "Semestriel",
        indicateur: "Audit réseau validé"
      },
      {
        category: "Protection",
        fonction: "Protection",
        mesure: "Gestion des comptes par défaut",
        type: "Exécutable",
        responsable: "Référent IT",
        frequence: "Trimestriel",
        indicateur: "Tous les comptes par défaut désactivés"
      },
      {
        category: "Protection",
        fonction: "Protection",
        mesure: "Mots de passe uniques et MFA",
        type: "Exécutable",
        responsable: "Référent IT / RH",
        frequence: "Continu",
        indicateur: "Nombre d'accès sécurisés et MFA appliquée"
      },
      {
        category: "Protection",
        fonction: "Protection",
        mesure: "Restriction des privilèges administrateur",
        type: "Exécutable",
        responsable: "Référent IT",
        frequence: "Mensuel",
        indicateur: "Liste des comptes admins revue"
      },
      {
        category: "Protection",
        fonction: "Protection",
        mesure: "Gestion des vulnérabilités et correctifs OS & applications",
        type: "Fondamentale / Exécutable",
        responsable: "Référent IT",
        frequence: "Hebdomadaire",
        indicateur: "Correctifs appliqués et rapports de vulnérabilités"
      },
      {
        category: "Protection",
        fonction: "Protection",
        mesure: "Pare-feu et filtrage réseau",
        type: "Exécutable",
        responsable: "Référent IT",
        frequence: "Continu",
        indicateur: "Logs de pare-feu et alertes analysées"
      },
      {
        category: "Défense contre malwares",
        fonction: "Protection",
        mesure: "Antimaliciels et mises à jour automatiques",
        type: "Exécutable",
        responsable: "Référent IT",
        frequence: "Continu",
        indicateur: "Signatures à jour, incidents bloqués"
      },
      {
        category: "Défense contre malwares",
        fonction: "Protection",
        mesure: "Filtrage DNS et navigation sécurisée",
        type: "Exécutable",
        responsable: "Référent IT",
        frequence: "Continu",
        indicateur: "Blocages et alertes surveillés"
      },
      {
        category: "Sensibilisation",
        fonction: "Protection",
        mesure: "Programme de sensibilisation à la sécurité",
        type: "Fondamentale",
        responsable: "Référent sécurité / RH",
        frequence: "Trimestriel",
        indicateur: "Taux de participation et quiz validés"
      },
      {
        category: "Sensibilisation",
        fonction: "Protection",
        mesure: "Formation phishing et incidents",
        type: "Exécutable",
        responsable: "Référent sécurité / RH",
        frequence: "Trimestriel",
        indicateur: "Taux de réussite tests phishing"
      },
      {
        category: "Détection",
        fonction: "Intervention",
        mesure: "Équipe et processus de gestion des incidents",
        type: "Fondamentale",
        responsable: "Référent IT / Sécurité",
        frequence: "Permanent",
        indicateur: "Procédures documentées et testées"
      },
      {
        category: "Détection",
        fonction: "Intervention",
        mesure: "Journalisation et collecte des logs",
        type: "Exécutable",
        responsable: "Référent IT",
        frequence: "Continu",
        indicateur: "Journaux collectés et archivés"
      },
      {
        category: "Récupération",
        fonction: "Récupération",
        mesure: "Processus de récupération des données",
        type: "Fondamentale",
        responsable: "Référent IT / Prestataire",
        frequence: "Annuel / Test semestriel",
        indicateur: "Test de restauration réalisé"
      },
      {
        category: "Récupération",
        fonction: "Récupération",
        mesure: "Sauvegardes automatisées et chiffrées",
        type: "Exécutable",
        responsable: "Référent IT",
        frequence: "Continu",
        indicateur: "Sauvegardes réussies et chiffrées"
      },
      {
        category: "Récupération",
        fonction: "Récupération",
        mesure: "Instance isolée de récupération",
        type: "Exécutable",
        responsable: "Référent IT",
        frequence: "Continu",
        indicateur: "Test de restauration et isolement vérifié"
      },
      {
        category: "Réglementation",
        fonction: "Protection",
        mesure: "Respect lois locales et internationales (RGPD, etc.)",
        type: "Fondamentale",
        responsable: "Responsable data / Juridique",
        frequence: "Annuel",
        indicateur: "Audit conformité réglementaire"
      },
      {
        category: "Réglementation",
        fonction: "Protection",
        mesure: "Consentement et traçabilité des données",
        type: "Exécutable",
        responsable: "Responsable data",
        frequence: "Continu",
        indicateur: "Dossiers de consentement à jour"
      },
      {
        category: "Réglementation",
        fonction: "Protection",
        mesure: "Chiffrement et accès contrôlé aux données sensibles",
        type: "Exécutable",
        responsable: "Référent IT / Responsable data",
        frequence: "Continu",
        indicateur: "Rapports de chiffrement et accès auditables"
      }
    ]
  };

  const guides = [mainGuide, advancedPlan, checklistGuide];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-gradient-to-r from-blue-500 to-blue-600",
      green: "bg-gradient-to-r from-green-500 to-green-600",
      purple: "bg-gradient-to-r from-purple-500 to-purple-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = searchTerm === '' || 
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
              Guides Pratiques Cybersécurité
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Plans d'action structurés pour renforcer la résilience des ONG en Afrique de l'Ouest et du Centre. 
              Basés sur les frameworks NIST et CIS Controls.
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un guide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-slate-500" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les guides</option>
                <option value="Plan complet">Plan complet</option>
                <option value="Plan avancé">Plan avancé</option>
                <option value="Checklist">Checklist</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Framework NIST Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Approche basée sur le Framework NIST
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Une approche progressive et priorisée, combinant mesures fondamentales et exécutables, 
              en conformité avec les normes internationales.
            </p>
          </div>
          
          {/* Framework NIST Visual */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
            <div className="flex flex-wrap justify-center items-center gap-6">
              {[
                { name: "Identification", icon: <Search className="h-5 w-5" />, color: "bg-orange-500" },
                { name: "Protection", icon: <Shield className="h-5 w-5" />, color: "bg-red-500" },
                { name: "Détection", icon: <Eye className="h-5 w-5" />, color: "bg-blue-500" },
                { name: "Intervention", icon: <Zap className="h-5 w-5" />, color: "bg-teal-500" },
                { name: "Récupération", icon: <CheckCircle className="h-5 w-5" />, color: "bg-green-500" }
              ].map((phase, index) => (
                <div key={phase.name} className="flex items-center">
                  <div className={`${phase.color} text-white p-3 rounded-lg flex items-center justify-center`}>
                    {phase.icon}
                  </div>
                  <span className="ml-3 font-medium text-slate-700">{phase.name}</span>
                  {index < 4 && <ChevronRight className="h-4 w-4 text-slate-400 mx-4" />}
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <div className="inline-block bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium">
                Conformité réglementaire
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredGuides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-lg text-white ${getColorClasses(guide.color)}`}>
                      {guide.icon}
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {guide.difficulty}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium mb-3 inline-block">
                      {guide.category}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      {guide.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {guide.description}
                    </p>
                  </div>

                  {/* Topics */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Points clés couverts :</h4>
                    <ul className="space-y-2">
                      {guide.topics.map((topic, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>



                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {guide.downloads}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{guide.rating}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    {guide.id === 1 ? (
                      <>
                        <Link 
                          href="/ressources/guides-pratiques/plan-action-cybersecurite-ong"
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Consulter le plan
                        </Link>
                        <button className="bg-slate-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center">
                          <Download className="h-4 w-4" />
                        </button>
                      </>
                    ) : guide.id === 3 ? (
                      <>
                        <Link 
                          href="/ressources/guides-pratiques/checklist-cybersecurite-ong"
                          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Consulter la checklist
                        </Link>
                        <button className="bg-slate-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center">
                          <Download className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger PDF
                        </button>
                        <button className="bg-slate-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center">
                          <Eye className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectifs stratégiques */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Objectifs stratégiques
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Protéger les données et systèmes",
                description: "Protéger les données et systèmes informatiques des ONG contre toutes formes de cybermenaces.",
                icon: <Shield className="h-6 w-6" />
              },
              {
                title: "Développer la cyber-hygiène",
                description: "Développer la cyber-hygiène du personnel, des partenaires et des bénévoles.",
                icon: <Users className="h-6 w-6" />
              },
              {
                title: "Garantir la continuité",
                description: "Garantir la continuité des opérations en cas d'incident informatique.",
                icon: <Settings className="h-6 w-6" />
              },
              {
                title: "Procédures claires",
                description: "Mettre en place des procédures claires et opérationnelles de gestion des incidents.",
                icon: <FileCheck className="h-6 w-6" />
              },
              {
                title: "Approche évolutive",
                description: "Favoriser une approche évolutive, adaptable à chaque ONG.",
                icon: <BarChart3 className="h-6 w-6" />
              }
            ].map((objective, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-xl">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg w-fit mb-4">
                  {objective.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{objective.title}</h3>
                <p className="text-sm text-slate-600">{objective.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan opérationnel */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Plan opérationnel en 5 phases
            </h2>
          </div>
          
          <div className="space-y-6">
            {[
              { phase: "Phase 1", title: "Identification", description: "Inventaires, analyse des risques" },
              { phase: "Phase 2", title: "Protection fondamentale", description: "Configurations sécurisées, gestion des accès, sensibilisation, correctifs manuels" },
              { phase: "Phase 3", title: "Protection avancée", description: "AMF, correctifs automatisés, filtrage DNS, sécurisation RDP, antimalware" },
              { phase: "Phase 4", title: "Intervention & récupération", description: "Procédures incidents, collecte journaux, sauvegardes isolées et tests" },
              { phase: "Phase 5", title: "Suivi & audit", description: "Audit régulier, ajustements et mise à jour continue" }
            ].map((phase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold mr-6 flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-2">{phase.title}</h3>
                  <p className="text-slate-600">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Besoin d'un guide personnalisé ?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Notre équipe d'experts peut créer des guides adaptés aux besoins spécifiques de votre organisation.
          </p>
          <Link href="/contact" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center">
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
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
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
