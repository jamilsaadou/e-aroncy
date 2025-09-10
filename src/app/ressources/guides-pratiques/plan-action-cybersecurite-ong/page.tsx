'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/Header';
import { generatePlanActionPDF } from '@/lib/pdfGenerator';
import { 
  Shield, 
  ChevronRight, 
  BookOpen,
  Download,
  Search,
  Filter,
  Eye,
  Users,
  Calendar,
  User,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  ArrowLeft,
  FileText,
  Database,
  Settings,
  Zap,
  BarChart3,
  Lock,
  Globe,
  FileCheck
} from 'lucide-react';

export default function PlanActionCybersecuriteONGPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generatePlanActionPDF();
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsDownloading(false);
    }
  };

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'objectifs', title: 'Objectifs stratégiques', icon: <Target className="h-4 w-4" /> },
    { id: 'methodologie', title: 'Approche méthodologique', icon: <Settings className="h-4 w-4" /> },
    { id: 'fondamentales', title: 'Mesures fondamentales', icon: <Shield className="h-4 w-4" /> },
    { id: 'executables', title: 'Mesures exécutables', icon: <Zap className="h-4 w-4" /> },
    { id: 'gouvernance', title: 'Gouvernance et conformité', icon: <FileCheck className="h-4 w-4" /> },
    { id: 'donnees', title: 'Protection des données', icon: <Lock className="h-4 w-4" /> },
    { id: 'plan-operationnel', title: 'Plan opérationnel', icon: <BarChart3 className="h-4 w-4" /> }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
            <Link href="/ressources" className="text-slate-500 hover:text-blue-600">Ressources</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <Link href="/ressources/guides-pratiques" className="text-slate-500 hover:text-blue-600">Guides pratiques</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-medium">Plan d'Action Cybersécurité ONG</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link 
              href="/ressources/guides-pratiques"
              className="inline-flex items-center text-blue-200 hover:text-white transition-colors mr-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour aux guides
            </Link>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Plan d'Action Cybersécurité pour les ONG
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Plan structuré pour renforcer la résilience des ONG en Afrique de l'Ouest et du Centre, 
              basé sur les principes du cadre NIST et la cyberhygiène essentielle.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Framework NIST</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">CIS Controls</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">RGPD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table des matières */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Table des matières</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {section.icon}
                      <span className="text-sm">{section.title}</span>
                    </button>
                  ))}
                </nav>
                
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Génération...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 space-y-12">
                
                {/* Introduction */}
                <section id="introduction" className="scroll-mt-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
                    Introduction
                  </h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-700 leading-relaxed mb-6">
                      La cybersécurité est aujourd'hui un enjeu stratégique pour toutes les organisations, y compris les ONG. 
                      Les attaques informatiques, qu'il s'agisse de rançongiciels, de phishing, de malwares ou d'intrusions ciblées, 
                      représentent un risque direct pour la continuité des activités et la protection des données sensibles des bénéficiaires.
                    </p>
                    
                    <div className="bg-blue-50 p-6 rounded-lg mb-6">
                      <h3 className="font-semibold text-blue-900 mb-4">Le projet ARONCY propose un plan d'action structuré basé sur :</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></div>
                          <span>Les principes du cadre NIST (Identification, Protection, Détection, Intervention, Récupération)</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></div>
                          <span>La cyberhygiène essentielle, accessible à toutes les ONG indépendamment de leurs moyens techniques</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></div>
                          <span>Une approche progressive et priorisée, combinant mesures fondamentales et exécutables</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></div>
                          <span>La conformité aux normes internationales (RGPD, CIS, NIST) et aux réglementations locales</span>
                        </li>
                      </ul>
                    </div>
                    
                    <p className="text-slate-700">
                      L'objectif est d'assurer la sécurité des systèmes, des données et des utilisateurs tout en permettant 
                      aux ONG de poursuivre leurs missions humanitaires et de développement en toute confiance.
                    </p>
                  </div>
                </section>

                {/* Objectifs stratégiques */}
                <section id="objectifs" className="scroll-mt-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <Target className="h-8 w-8 mr-3 text-blue-600" />
                    Objectifs stratégiques
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
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
                </section>

                {/* Approche méthodologique */}
                <section id="methodologie" className="scroll-mt-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <Settings className="h-8 w-8 mr-3 text-blue-600" />
                    Approche méthodologique
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Progressive et par couches",
                        description: "Commencer par les mesures fondamentales, puis appliquer les mesures avancées.",
                        color: "bg-green-100 text-green-800"
                      },
                      {
                        title: "Alignée sur NIST",
                        description: "Chaque mesure correspond à une fonction NIST.",
                        color: "bg-blue-100 text-blue-800"
                      },
                      {
                        title: "Priorisation",
                        description: "Traitement des actifs critiques et des comptes sensibles en priorité.",
                        color: "bg-orange-100 text-orange-800"
                      },
                      {
                        title: "Conformité",
                        description: "Respect des lois locales et bonnes pratiques internationales.",
                        color: "bg-purple-100 text-purple-800"
                      }
                    ].map((approach, index) => (
                      <div key={index} className="bg-white border border-slate-200 p-6 rounded-xl">
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${approach.color}`}>
                          {approach.title}
                        </div>
                        <p className="text-slate-600">{approach.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Mesures fondamentales */}
                <section id="fondamentales" className="scroll-mt-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <Shield className="h-8 w-8 mr-3 text-blue-600" />
                    Mesures de protection fondamentales
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        fonction: "Identification",
                        mesure: "Inventaire des équipements",
                        description: "Lister tous les ordinateurs, serveurs, appareils mobiles et périphériques. Permet de savoir ce qui est exposé et de gérer les correctifs.",
                        color: "bg-orange-100 text-orange-800"
                      },
                      {
                        fonction: "Identification",
                        mesure: "Inventaire des logiciels",
                        description: "Identifier toutes les applications et versions installées. Assurer que seuls les logiciels autorisés et à jour sont utilisés.",
                        color: "bg-orange-100 text-orange-800"
                      },
                      {
                        fonction: "Identification",
                        mesure: "Inventaire des comptes utilisateurs",
                        description: "Répertorier tous les comptes (normaux et administrateurs) pour éviter les accès non autorisés.",
                        color: "bg-orange-100 text-orange-800"
                      },
                      {
                        fonction: "Protection",
                        mesure: "Configuration sécurisée des équipements",
                        description: "Paramétrer ordinateurs, serveurs et mobiles selon les bonnes pratiques (antivirus, firewalls, restrictions d'installation).",
                        color: "bg-red-100 text-red-800"
                      },
                      {
                        fonction: "Protection",
                        mesure: "Configuration sécurisée du réseau",
                        description: "Définir pare-feu, segmentation réseau et accès sécurisés pour protéger contre les intrusions.",
                        color: "bg-red-100 text-red-800"
                      },
                      {
                        fonction: "Protection",
                        mesure: "Gestion des accès",
                        description: "Autoriser l'accès uniquement aux personnes habilitées et appliquer le principe du moindre privilège.",
                        color: "bg-red-100 text-red-800"
                      },
                      {
                        fonction: "Protection",
                        mesure: "Gestion des vulnérabilités",
                        description: "Installer les mises à jour critiques et corriger rapidement les failles identifiées.",
                        color: "bg-red-100 text-red-800"
                      },
                      {
                        fonction: "Protection",
                        mesure: "Sensibilisation du personnel",
                        description: "Former tous les employés et bénévoles à la reconnaissance des menaces comme le phishing et les malwares.",
                        color: "bg-red-100 text-red-800"
                      },
                      {
                        fonction: "Intervention",
                        mesure: "Processus de signalement des incidents",
                        description: "Définir comment signaler un incident, à qui, et quel type d'informations fournir.",
                        color: "bg-teal-100 text-teal-800"
                      },
                      {
                        fonction: "Intervention",
                        mesure: "Gestion des journaux",
                        description: "Collecter et sécuriser les journaux des systèmes pour détecter des anomalies et enquêter en cas d'attaque.",
                        color: "bg-teal-100 text-teal-800"
                      },
                      {
                        fonction: "Récupération",
                        mesure: "Sauvegardes régulières",
                        description: "Mettre en place des sauvegardes sécurisées et tester régulièrement leur restauration pour garantir la continuité des activités.",
                        color: "bg-green-100 text-green-800"
                      }
                    ].map((item, index) => (
                      <div key={index} className="bg-white border border-slate-200 rounded-xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${item.color}`}>
                            {item.fonction}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-2">{item.mesure}</h3>
                            <p className="text-slate-600 text-sm">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Mesures exécutables */}
                <section id="executables" className="scroll-mt-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <Zap className="h-8 w-8 mr-3 text-blue-600" />
                    Mesures de protection exécutables
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        fonction: "Identification",
                        mesure: "Logiciels autorisés",
                        description: "Vérifier que seuls les logiciels légitimes et à jour sont installés pour réduire les vulnérabilités."
                      },
                      {
                        fonction: "Protection",
                        mesure: "Gestion des comptes par défaut",
                        description: "Désactiver ou sécuriser tous les comptes par défaut (ex : admin, root) pour éviter l'accès non autorisé."
                      },
                      {
                        fonction: "Protection",
                        mesure: "Mots de passe uniques et AMF",
                        description: "Interdire la réutilisation des mots de passe et appliquer une authentification multi-facteurs sur les accès sensibles."
                      },
                      {
                        fonction: "Protection",
                        mesure: "Correctifs automatisés",
                        description: "Automatiser la mise à jour des systèmes et applications pour limiter les risques de vulnérabilités critiques."
                      },
                      {
                        fonction: "Protection",
                        mesure: "Filtrage DNS",
                        description: "Bloquer les sites malveillants et les URL de phishing pour réduire les risques de compromission."
                      },
                      {
                        fonction: "Protection",
                        mesure: "Antimalware",
                        description: "Déployer un logiciel antivirus à jour sur tous les appareils pour détecter et bloquer les malwares."
                      },
                      {
                        fonction: "Protection",
                        mesure: "Sécurisation des supports amovibles",
                        description: "Restreindre l'usage des clés USB et désactiver l'exécution automatique pour éviter la propagation de malwares."
                      },
                      {
                        fonction: "Intervention",
                        mesure: "Gestion des incidents",
                        description: "Documenter les incidents, collecter les preuves et analyser la cause pour éviter la répétition."
                      },
                      {
                        fonction: "Récupération",
                        mesure: "Sauvegardes isolées et chiffrées",
                        description: "Conserver les copies de données dans un endroit séparé et sécurisé pour pouvoir restaurer rapidement en cas d'attaque."
                      }
                    ].map((item, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {item.fonction}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-2">{item.mesure}</h3>
                            <p className="text-slate-600 text-sm">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Gouvernance et conformité */}
                <section id="gouvernance" className="scroll-mt-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <FileCheck className="h-8 w-8 mr-3 text-blue-600" />
                    Gouvernance et conformité
                  </h2>
                  <div className="bg-slate-50 p-6 rounded-xl">
                    <ul className="space-y-4">
                      {[
                        "Désignation d'un référent cybersécurité ou d'un prestataire spécialisé",
                        "Rédaction et adoption d'une politique de cybersécurité et protection des données",
                        "Documentation des inventaires, configurations, journaux et rapports d'incidents",
                        "Audit régulier pour vérifier la conformité aux normes RGPD, CIS, NIST et aux bonnes pratiques locales"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Protection des données */}
                <section id="donnees" className="scroll-mt-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <Lock className="h-8 w-8 mr-3 text-blue-600" />
                    Protection des données personnelles et cadre réglementaire
                  </h2>
                  
                  <div className="mb-8">
                    <p className="text-slate-700 mb-6">
                      Les ONG manipulent souvent des informations sensibles concernant leurs bénéficiaires, partenaires et employés. 
                      La protection de ces données est non seulement une obligation légale, mais aussi un élément clé de confiance 
                      et de résilience organisationnelle.
                    </p>
                  </div>

                  {/* Cadres légaux */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Cadres légaux internationaux et régionaux</h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "RGPD",
                          description: "Applicable aux ONG ayant des interactions avec l'Union européenne ou traitant des données de ressortissants européens."
                        },
                        {
                          title: "Législations nationales",
                          description: "Chaque pays possède ses propres lois sur la protection des données (ex. : Niger, Mali, Sénégal, Côte d'Ivoire)."
                        },
                        {
                          title: "Normes sectorielles",
                          description: "Certaines ONG ou bailleurs exigent le respect de normes internationales comme CIS, ISO 27001 ou HDPS."
                        }
                      ].map((item, index) => (
                        <div key={index} className="bg-white border border-slate-200 p-4 rounded-lg">
                          <h4 className="font-medium text-slate-900 mb-2">{item.title}</h4>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Principes fondamentaux */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Principes fondamentaux de protection des données</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        {
                          title: "Licéité, loyauté et transparence",
                          description: "Informer les personnes concernées sur l'usage de leurs données"
                        },
                        {
                          title: "Limitation des finalités",
                          description: "Collecter uniquement les données nécessaires aux missions de l'ONG"
                        },
                        {
                          title: "Minimisation des données",
                          description: "Limiter la quantité et la sensibilité des informations collectées"
                        },
                        {
                          title: "Exactitude",
                          description: "Garantir que les données sont correctes et à jour"
                        },
                        {
                          title: "Limitation de conservation",
                          description: "Supprimer ou anonymiser les données dès qu'elles ne sont plus utiles"
                        },
                        {
                          title: "Intégrité et confidentialité",
                          description: "Sécuriser les données contre les pertes, fuites ou accès non autorisés"
                        }
                      ].map((principle, index) => (
                        <div key={index} className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-900 mb-2">{principle.title}</h4>
                          <p className="text-sm text-purple-700">{principle.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Obligations opérationnelles */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Obligations opérationnelles</h3>
                    <div className="space-y-3">
                      {[
                        "Consentement éclairé : recueillir le consentement des bénéficiaires avant toute collecte de données personnelles",
                        "Registre des traitements : tenir à jour un registre décrivant les traitements de données effectués",
                        "Mesures techniques et organisationnelles : chiffrement, sauvegardes sécurisées, contrôle des accès et formation du personnel",
                        "Notification des violations : signaler toute fuite ou compromission de données aux autorités compétentes et aux personnes concernées dans les délais légaux"
                      ].map((obligation, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-slate-700 text-sm">{obligation}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bonnes pratiques */}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Bonnes pratiques pour les ONG</h3>
                    <div className="bg-green-50 p-6 rounded-xl">
                      <ul className="space-y-3">
                        {[
                          "Former régulièrement le personnel à la confidentialité et à la sécurité des données",
                          "Utiliser des outils sécurisés pour le stockage et le transfert des données (ex. messagerie chiffrée, cloud sécurisé)",
                          "Limiter l'accès aux informations sensibles selon le rôle et les responsabilités",
                          "Intégrer la protection des données dès la conception des projets (Privacy by Design)"
                        ].map((practice, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-green-800 text-sm">{practice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Plan opérationnel */}
                <section id="plan-operationnel" className="scroll-mt-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
                    Plan opérationnel résumé
                  </h2>
                  <div className="space-y-6">
                    {[
                      { 
                        phase: "Phase 1", 
                        title: "Identification", 
                        description: "Inventaires, analyse des risques",
                        color: "bg-orange-500"
                      },
                      { 
                        phase: "Phase 2", 
                        title: "Protection fondamentale", 
                        description: "Configurations sécurisées, gestion des accès, sensibilisation, correctifs manuels",
                        color: "bg-red-500"
                      },
                      { 
                        phase: "Phase 3", 
                        title: "Protection avancée", 
                        description: "AMF, correctifs automatisés, filtrage DNS, sécurisation RDP, antimalware",
                        color: "bg-blue-500"
                      },
                      { 
                        phase: "Phase 4", 
                        title: "Intervention & récupération", 
                        description: "Procédures incidents, collecte journaux, sauvegardes isolées et tests",
                        color: "bg-teal-500"
                      },
                      { 
                        phase: "Phase 5", 
                        title: "Suivi & audit", 
                        description: "Audit régulier, ajustements et mise à jour continue",
                        color: "bg-green-500"
                      }
                    ].map((phase, index) => (
                      <div key={index} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex items-center">
                        <div className={`${phase.color} text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold mr-6 flex-shrink-0`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg mb-2">{phase.title}</h3>
                          <p className="text-slate-600">{phase.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Besoin d'aide pour implémenter ce plan ?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Notre équipe d'experts peut vous accompagner dans la mise en œuvre de votre stratégie cybersécurité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center justify-center"
            >
              Demander conseil
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mr-2"></div>
                  Génération...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Télécharger le plan
                </>
              )}
            </button>
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
