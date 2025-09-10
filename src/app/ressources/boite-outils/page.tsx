'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/Header';
import { 
  Shield, 
  ChevronRight, 
  Wrench, 
  Download, 
  ExternalLink, 
  Star,
  Search,
  Filter,
  Lock,
  Wifi,
  AlertTriangle,
  Database,
  Smartphone,
  Scan,
  Server,
  Eye,
  Bug,
  FileText,
  Users,
  ShieldCheck,
  HardDrive,
  MonitorSpeaker
} from 'lucide-react';

export default function BoiteOutilsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Outils organisés par catégorie selon les informations fournies
  const toolCategories = [
    {
      id: 1,
      title: "Identifier son environnement",
      icon: <Search className="h-6 w-6" />,
      color: "blue",
      count: 7,
      tools: [
        {
          name: "Nmap",
          description: "Scanner réseau puissant pour la découverte d'hôtes et l'audit de sécurité",
          price: "Gratuit",
          rating: 4.9,
          url: "https://nmap.org/",
          features: ["Scan de ports", "Détection d'OS", "Script NSE", "Interface CLI"]
        },
        {
          name: "Zenmap", 
          description: "Interface graphique intuitive pour Nmap",
          price: "Gratuit",
          rating: 4.7,
          url: "https://nmap.org/zenmap/",
          features: ["GUI pour Nmap", "Visualisation réseau", "Profils prédéfinis", "Historique des scans"]
        },
        {
          name: "Spiceworks Inventory",
          description: "Gestion complète des actifs IT en ligne",
          price: "Gratuit", 
          rating: 4.5,
          url: "https://www.spiceworks.com/free-tools/",
          features: ["Inventaire automatique", "Monitoring", "Helpdesk", "Rapports détaillés"]
        },
        {
          name: "Open-AudIT",
          description: "Inventaire réseau et serveur open source",
          price: "Freemium",
          rating: 4.3,
          url: "https://openaudit.org/",
          features: ["Audit automatisé", "Découverte réseau", "Conformité", "Tableaux de bord"]
        },
        {
          name: "Fing",
          description: "Application mobile pour scan et inventaire réseau",
          price: "Gratuit",
          rating: 4.6,
          url: "https://www.fing.com/products/fing-app",
          features: ["Scan WiFi", "Test de sécurité", "Alertes d'intrusion", "Interface mobile"]
        },
        {
          name: "Lansweeper",
          description: "Solution professionnelle de gestion de parc informatique",
          price: "Payant",
          rating: 4.4,
          url: "https://www.lansweeper.com/",
          features: ["Asset management", "Compliance", "Reporting", "Intégrations"]
        },
        {
          name: "Snipe-IT",
          description: "Gestionnaire d'actifs open source basé sur le web",
          price: "Gratuit",
          rating: 4.2,
          url: "https://snipeitapp.com/",
          features: ["Suivi d'actifs", "Check-in/out", "Maintenance", "Rapports"]
        }
      ]
    },
    {
      id: 2,
      title: "Configuration sécurisée & Gestion des accès",
      icon: <Lock className="h-6 w-6" />,
      color: "green", 
      count: 8,
      tools: [
        {
          name: "OpenSCAP",
          description: "Framework d'audit et de conformité pour systèmes Linux/Unix",
          price: "Gratuit",
          rating: 4.1,
          url: "https://www.open-scap.org/",
          features: ["Audit SCAP", "Conformité", "Remédiation", "Rapports"]
        },
        {
          name: "DISA STIGs",
          description: "Guides officiels de configuration sécurisée pour systèmes et réseaux",
          price: "Gratuit",
          rating: 4.8,
          url: "https://public.cyber.mil/stigs/",
          features: ["Guides officiels", "Standards DoD", "Multi-plateformes", "Mise à jour régulière"]
        },
        {
          name: "CIS Benchmarks",
          description: "Standards de sécurité reconnus mondialement avec outil d'analyse",
          price: "Payant",
          rating: 4.7,
          url: "https://www.cisecurity.org/cis-benchmarks/",
          features: ["Standards CIS", "Assessment", "Benchmarking", "Compliance"]
        },
        {
          name: "KeePass",
          description: "Gestionnaire de mots de passe open source sécurisé",
          price: "Gratuit",
          rating: 4.6,
          url: "https://keepass.info/",
          features: ["Chiffrement AES", "Base hors ligne", "Plugins", "Multi-plateforme"]
        },
        {
          name: "Password Safe",
          description: "Gestionnaire de mots de passe simple et sécurisé",
          price: "Gratuit", 
          rating: 4.3,
          url: "https://pwsafe.org/",
          features: ["Interface simple", "Chiffrement fort", "Import/Export", "Portable"]
        },
        {
          name: "Thycotic Secret Server",
          description: "Solution entreprise de gestion des comptes privilégiés",
          price: "Payant",
          rating: 4.5,
          url: "https://www.thycotic.com/",
          features: ["PAM", "Rotation automatique", "Audit", "Intégrations"]
        },
        {
          name: "Google Authenticator",
          description: "Application d'authentification à deux facteurs",
          price: "Gratuit",
          rating: 4.2,
          url: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
          features: ["TOTP", "Multi-comptes", "Backup", "Interface simple"]
        },
        {
          name: "Microsoft Authenticator", 
          description: "Solution MFA Microsoft avec notifications push",
          price: "Gratuit",
          rating: 4.4,
          url: "https://www.microsoft.com/en-us/account/authenticator",
          features: ["Push notifications", "Intégration Azure", "Backup cloud", "Biométrie"]
        }
      ]
    },
    {
      id: 3,
      title: "Gestion des vulnérabilités",
      icon: <Bug className="h-6 w-6" />,
      color: "red",
      count: 6,
      tools: [
        {
          name: "OpenVAS",
          description: "Scanner de vulnérabilités complet et open source",
          price: "Gratuit",
          rating: 4.5,
          url: "https://www.openvas.org/",
          features: ["Scan complet", "Base CVE", "Rapports détaillés", "Web interface"]
        },
        {
          name: "Lynis",
          description: "Outil d'audit de sécurité pour systèmes Unix/Linux",
          price: "Gratuit", 
          rating: 4.3,
          url: "https://cisofy.com/lynis/",
          features: ["Audit système", "Compliance", "Hardening", "CLI simple"]
        },
        {
          name: "NVD Database",
          description: "Base officielle américaine des vulnérabilités",
          price: "Gratuit",
          rating: 4.8,
          url: "https://nvd.nist.gov/",
          features: ["Base CVE complète", "CVSS scores", "API gratuite", "Mises à jour quotidiennes"]
        },
        {
          name: "RANCID",
          description: "Système de gestion et suivi des configurations réseau",
          price: "Gratuit",
          rating: 4.1,
          url: "https://shrubbery.net/rancid/",
          features: ["Config backup", "Change tracking", "Multi-vendor", "Alertes"]
        },
        {
          name: "ClamAV",
          description: "Antivirus open source multiplateforme",
          price: "Gratuit",
          rating: 4.2,
          url: "https://www.clamav.net/",
          features: ["Scan en temps réel", "Base signatures", "API", "Multi-plateforme"]
        },
        {
          name: "Windows Defender",
          description: "Antivirus intégré Microsoft Windows",
          price: "Gratuit",
          rating: 4.0,
          url: "https://www.microsoft.com/en-us/windows/comprehensive-security",
          features: ["Intégré Windows", "Cloud protection", "Firewall", "Contrôle parental"]
        }
      ]
    },
    {
      id: 4,
      title: "Protection DNS & Filtrage",
      icon: <Wifi className="h-6 w-6" />,
      color: "purple",
      count: 3,
      tools: [
        {
          name: "MS-ISAC Malicious Domain Blocking",
          description: "Service gratuit de blocage de domaines malveillants",
          price: "Gratuit",
          rating: 4.6,
          url: "https://www.cisecurity.org/ms-isac/",
          features: ["Blocage automatique", "Threat intelligence", "Support 24/7", "Multi-secteur"]
        },
        {
          name: "Quad9",
          description: "DNS sécurisé avec filtrage automatique des menaces",
          price: "Gratuit",
          rating: 4.7,
          url: "https://www.quad9.net/",
          features: ["Filtrage malware", "Respect vie privée", "Performance", "Global coverage"]
        },
        {
          name: "OpenDNS",
          description: "Service DNS avec filtrage de contenu et protection",
          price: "Gratuit/Payant",
          rating: 4.5,
          url: "https://www.opendns.com/",
          features: ["Content filtering", "Phishing protection", "Statistiques", "Contrôles parentaux"]
        }
      ]
    },
    {
      id: 5,
      title: "Formation & Sensibilisation",
      icon: <Users className="h-6 w-6" />,
      color: "indigo",
      count: 3,
      tools: [
        {
          name: "MS-ISAC Awareness Toolkit",
          description: "Kit complet de ressources de sensibilisation cybersécurité",
          price: "Gratuit",
          rating: 4.4,
          url: "https://www.cisecurity.org/ms-isac/",
          features: ["Ressources prêtes", "Multi-formats", "Mis à jour", "Expertise gouvernementale"]
        },
        {
          name: "FedVTE Online Courses",
          description: "Formation cybersécurité en ligne du gouvernement américain",
          price: "Gratuit",
          rating: 4.3,
          url: "https://fedvte.usalearning.gov/",
          features: ["Cours certifiants", "Niveaux variés", "Contenu expert", "Suivi progrès"]
        },
        {
          name: "StaySafeOnline.org",
          description: "Ressources vidéo et éducatives sur la cybersécurité",
          price: "Gratuit",
          rating: 4.2,
          url: "https://www.staysafeonline.org/",
          features: ["Contenu accessible", "Vidéos pratiques", "Conseils quotidiens", "Actualités"]
        }
      ]
    },
    {
      id: 6,
      title: "Gestion des incidents & Sauvegarde",
      icon: <Database className="h-6 w-6" />,
      color: "orange",
      count: 8,
      tools: [
        {
          name: "NIST SP 800-61",
          description: "Guide officiel de gestion des incidents cybersécurité",
          price: "Gratuit",
          rating: 4.8,
          url: "https://csrc.nist.gov/publications",
          features: ["Standard NIST", "Méthodologie complète", "Bonnes pratiques", "Cas d'usage"]
        },
        {
          name: "MS-ISAC CIRT",
          description: "Service d'assistance gratuite pour la réponse aux incidents",
          price: "Gratuit",
          rating: 4.5,
          url: "https://www.cisecurity.org/ms-isac/",
          features: ["Support 24/7", "Expertise incident", "Threat intelligence", "Coordination"]
        },
        {
          name: "Bacula",
          description: "Solution de sauvegarde enterprise open source",
          price: "Gratuit",
          rating: 4.3,
          url: "https://www.bacula.org/",
          features: ["Sauvegarde complète", "Déduplication", "Multi-OS", "Interface web"]
        },
        {
          name: "Clonezilla",
          description: "Outil de clonage et sauvegarde système gratuit",
          price: "Gratuit",
          rating: 4.4,
          url: "https://clonezilla.org/",
          features: ["Clone système", "Multi-cast", "Compression", "Boot USB"]
        },
        {
          name: "VeraCrypt",
          description: "Solution de chiffrement avancée pour protéger vos données",
          price: "Gratuit",
          rating: 4.6,
          url: "https://www.veracrypt.fr/",
          features: ["Chiffrement fort", "Conteneurs cachés", "Multi-algorithmes", "Cross-platform"]
        },
        {
          name: "Time Machine",
          description: "Sauvegarde automatique intégrée macOS",
          price: "Gratuit",
          rating: 4.1,
          url: "https://support.apple.com/en-us/HT201250",
          features: ["Sauvegarde auto", "Versions fichiers", "Restauration facile", "Intégré macOS"]
        },
        {
          name: "Windows Backup",
          description: "Outil de sauvegarde intégré à Windows",
          price: "Gratuit",
          rating: 3.9,
          url: "https://support.microsoft.com/en-us/windows/backup-and-restore-your-pc-ac359b36-7015-4694-de4a-c5eaf1e32893",
          features: ["Sauvegarde système", "Historique fichiers", "Image système", "Intégré Windows"]
        },
        {
          name: "No More Ransom",
          description: "Outils gratuits de déchiffrement pour victimes de ransomware",
          price: "Gratuit",
          rating: 4.7,
          url: "https://www.nomoreransom.org/",
          features: ["Décrypteurs gratuits", "Multi-ransomware", "Partenariat police", "Prévention"]
        }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800", 
      red: "bg-red-100 text-red-800",
      purple: "bg-purple-100 text-purple-800",
      indigo: "bg-indigo-100 text-indigo-800",
      orange: "bg-orange-100 text-orange-800"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBgColorClasses = (color: string) => {
    const colors = {
      blue: "bg-gradient-to-r from-blue-500 to-blue-600",
      green: "bg-gradient-to-r from-green-500 to-green-600",
      red: "bg-gradient-to-r from-red-500 to-red-600", 
      purple: "bg-gradient-to-r from-purple-500 to-purple-600",
      indigo: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      orange: "bg-gradient-to-r from-orange-500 to-orange-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getPriceColor = (price: string) => {
    if (price === "Gratuit") return "text-green-600 font-medium";
    if (price === "Freemium") return "text-blue-600 font-medium";
    return "text-orange-600 font-medium";
  };

  const filteredCategories = selectedCategory === 'all' 
    ? toolCategories 
    : toolCategories.filter(cat => cat.id.toString() === selectedCategory);

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
            <span className="text-slate-900 font-medium">Boîte à Outils Cybersécurité</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Wrench className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Outils de Cybersécurité pour ONG
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Une collection complète d'outils testés et approuvés pour renforcer 
              la sécurité de votre organisation. Solutions gratuites et professionnelles.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un outil..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-500" />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Toutes les catégories</option>
                  {toolCategories.map(cat => (
                    <option key={cat.id} value={cat.id.toString()}>{cat.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Catégories d'outils
            </h2>
            <p className="text-xl text-slate-600">
              Outils organisés selon le framework de cybersécurité pour ONG
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolCategories.map((category) => (
              <div key={category.id} className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition-all cursor-pointer ${getColorClasses(category.color)}`}>
                <div className="flex items-center mb-3">
                  {category.icon}
                  <h3 className="font-semibold ml-3 text-sm">{category.title}</h3>
                </div>
                <p className="text-xs opacity-80">{category.count} outils disponibles</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools by Category */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.map((category) => (
            <div key={category.id} className="mb-16">
              <div className="flex items-center mb-8">
                <div className={`p-3 rounded-lg text-white mr-4 ${getBgColorClasses(category.color)}`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{category.title}</h2>
                  <p className="text-slate-600">{category.count} outils dans cette catégorie</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools
                  .filter(tool => 
                    searchTerm === '' || 
                    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((tool, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-2 rounded-lg text-white ${getBgColorClasses(category.color)}`}>
                          <Shield className="h-5 w-5" />
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-slate-600 ml-1">{tool.rating}</span>
                          </div>
                          <span className={`text-sm font-medium ${getPriceColor(tool.price)}`}>
                            {tool.price}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${getColorClasses(category.color)}`}>
                        {category.title}
                      </span>
                      
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {tool.name}
                      </h3>
                      
                      <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                        {tool.description}
                      </p>

                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-xs font-medium text-slate-900 mb-2">Fonctionnalités :</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {tool.features.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="text-xs text-slate-600 flex items-center">
                              <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <Link 
                          href={tool.url}
                          target="_blank"
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center text-sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visiter
                        </Link>
                        <button className="bg-slate-100 text-slate-700 py-2.5 px-4 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Besoin d'aide pour choisir ?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Nos experts peuvent vous conseiller sur les meilleurs outils pour votre organisation.
          </p>
          <Link href="/contact" className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-all inline-flex items-center">
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