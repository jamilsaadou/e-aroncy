'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/Header';
import { generateChecklistPDF } from '@/lib/pdfGenerator';
import { 
  Shield, 
  ChevronRight, 
  FileCheck,
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
  BookOpen,
  Star,
  ArrowLeft,
  X,
  Building
} from 'lucide-react';

export default function ChecklistCybersecuriteONGPage() {
  const [checkedItems, setCheckedItems] = useState<{[key: number]: boolean}>({});
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const checklistItems = [
    {
      id: 1,
      category: "Identification",
      fonction: "Identification",
      mesure: "Inventaire détaillé des équipements",
      type: "Fondamentale",
      responsable: "Référent IT / Prestataire",
      frequence: "Mensuel",
      indicateur: "Liste à jour et vérifiée"
    },
    {
      id: 2,
      category: "Identification",
      fonction: "Identification", 
      mesure: "Inventaire des logiciels",
      type: "Fondamentale",
      responsable: "Référent IT / Prestataire",
      frequence: "Mensuel",
      indicateur: "Liste complète, versions et support à jour"
    },
    {
      id: 3,
      category: "Identification",
      fonction: "Identification",
      mesure: "Gestion des données (classification, suivi)",
      type: "Fondamentale",
      responsable: "Référent IT / Responsable data",
      frequence: "Trimestriel",
      indicateur: "Données classifiées et accès documentés"
    },
    {
      id: 4,
      category: "Identification",
      fonction: "Identification",
      mesure: "Inventaire des comptes utilisateurs",
      type: "Fondamentale",
      responsable: "Référent IT / RH",
      frequence: "Mensuel",
      indicateur: "Comptes recensés et privilèges documentés"
    },
    {
      id: 5,
      category: "Protection",
      fonction: "Protection",
      mesure: "Configuration sécurisée des systèmes",
      type: "Fondamentale",
      responsable: "Référent IT / Prestataire",
      frequence: "Semestriel",
      indicateur: "Rapport de conformité des configurations"
    },
    {
      id: 6,
      category: "Protection",
      fonction: "Protection",
      mesure: "Configuration sécurisée réseau",
      type: "Fondamentale",
      responsable: "Référent IT / Prestataire",
      frequence: "Semestriel",
      indicateur: "Audit réseau validé"
    },
    {
      id: 7,
      category: "Protection",
      fonction: "Protection",
      mesure: "Gestion des comptes par défaut",
      type: "Exécutable",
      responsable: "Référent IT",
      frequence: "Trimestriel",
      indicateur: "Tous les comptes par défaut désactivés"
    },
    {
      id: 8,
      category: "Protection",
      fonction: "Protection",
      mesure: "Mots de passe uniques et MFA",
      type: "Exécutable",
      responsable: "Référent IT / RH",
      frequence: "Continu",
      indicateur: "Nombre d'accès sécurisés et MFA appliquée"
    },
    {
      id: 9,
      category: "Protection",
      fonction: "Protection",
      mesure: "Restriction des privilèges administrateur",
      type: "Exécutable",
      responsable: "Référent IT",
      frequence: "Mensuel",
      indicateur: "Liste des comptes admins revue"
    },
    {
      id: 10,
      category: "Protection",
      fonction: "Protection",
      mesure: "Gestion des vulnérabilités et correctifs OS & applications",
      type: "Fondamentale / Exécutable",
      responsable: "Référent IT",
      frequence: "Hebdomadaire",
      indicateur: "Correctifs appliqués et rapports de vulnérabilités"
    },
    {
      id: 11,
      category: "Protection",
      fonction: "Protection",
      mesure: "Pare-feu et filtrage réseau",
      type: "Exécutable",
      responsable: "Référent IT",
      frequence: "Continu",
      indicateur: "Logs de pare-feu et alertes analysées"
    },
    {
      id: 12,
      category: "Défense contre malwares",
      fonction: "Protection",
      mesure: "Antimaliciels et mises à jour automatiques",
      type: "Exécutable",
      responsable: "Référent IT",
      frequence: "Continu",
      indicateur: "Signatures à jour, incidents bloqués"
    },
    {
      id: 13,
      category: "Défense contre malwares",
      fonction: "Protection",
      mesure: "Filtrage DNS et navigation sécurisée",
      type: "Exécutable",
      responsable: "Référent IT",
      frequence: "Continu",
      indicateur: "Blocages et alertes surveillés"
    },
    {
      id: 14,
      category: "Sensibilisation",
      fonction: "Protection",
      mesure: "Programme de sensibilisation à la sécurité",
      type: "Fondamentale",
      responsable: "Référent sécurité / RH",
      frequence: "Trimestriel",
      indicateur: "Taux de participation et quiz validés"
    },
    {
      id: 15,
      category: "Sensibilisation",
      fonction: "Protection",
      mesure: "Formation phishing et incidents",
      type: "Exécutable",
      responsable: "Référent sécurité / RH",
      frequence: "Trimestriel",
      indicateur: "Taux de réussite tests phishing"
    },
    {
      id: 16,
      category: "Détection",
      fonction: "Intervention",
      mesure: "Équipe et processus de gestion des incidents",
      type: "Fondamentale",
      responsable: "Référent IT / Sécurité",
      frequence: "Permanent",
      indicateur: "Procédures documentées et testées"
    },
    {
      id: 17,
      category: "Détection",
      fonction: "Intervention",
      mesure: "Journalisation et collecte des logs",
      type: "Exécutable",
      responsable: "Référent IT",
      frequence: "Continu",
      indicateur: "Journaux collectés et archivés"
    },
    {
      id: 18,
      category: "Récupération",
      fonction: "Récupération",
      mesure: "Processus de récupération des données",
      type: "Fondamentale",
      responsable: "Référent IT / Prestataire",
      frequence: "Annuel / Test semestriel",
      indicateur: "Test de restauration réalisé"
    },
    {
      id: 19,
      category: "Récupération",
      fonction: "Récupération",
      mesure: "Sauvegardes automatisées et chiffrées",
      type: "Exécutable",
      responsable: "Référent IT",
      frequence: "Continu",
      indicateur: "Sauvegardes réussies et chiffrées"
    },
    {
      id: 20,
      category: "Récupération",
      fonction: "Récupération",
      mesure: "Instance isolée de récupération",
      type: "Exécutable",
      responsable: "Référent IT",
      frequence: "Continu",
      indicateur: "Test de restauration et isolement vérifié"
    },
    {
      id: 21,
      category: "Réglementation",
      fonction: "Protection",
      mesure: "Respect lois locales et internationales (RGPD, etc.)",
      type: "Fondamentale",
      responsable: "Responsable data / Juridique",
      frequence: "Annuel",
      indicateur: "Audit conformité réglementaire"
    },
    {
      id: 22,
      category: "Réglementation",
      fonction: "Protection",
      mesure: "Consentement et traçabilité des données",
      type: "Exécutable",
      responsable: "Responsable data",
      frequence: "Continu",
      indicateur: "Dossiers de consentement à jour"
    },
    {
      id: 23,
      category: "Réglementation",
      fonction: "Protection",
      mesure: "Chiffrement et accès contrôlé aux données sensibles",
      type: "Exécutable",
      responsable: "Référent IT / Responsable data",
      frequence: "Continu",
      indicateur: "Rapports de chiffrement et accès auditables"
    }
  ];

  const handleCheckItem = (id: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredItems = checklistItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.mesure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.responsable.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesType = filterType === 'all' || item.type.includes(filterType);
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercentage = (completedCount / checklistItems.length) * 100;

  const categories = [...new Set(checklistItems.map(item => item.category))];

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await generateChecklistPDF(checklistItems, checkedItems, organizationName || undefined);
      setShowExportModal(false);
      setOrganizationName('');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  const openExportModal = () => {
    setShowExportModal(true);
  };

  const closeExportModal = () => {
    setShowExportModal(false);
    setOrganizationName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
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
            <span className="text-slate-900 font-medium">Checklist cybersécurité ONG</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link 
              href="/ressources/guides-pratiques"
              className="inline-flex items-center text-purple-200 hover:text-white transition-colors mr-6"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour aux guides
            </Link>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FileCheck className="h-8 w-8" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Checklist opérationnelle cybersécurité ONG
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Évaluez et améliorez le niveau de cybersécurité de votre ONG avec cette checklist pratique 
              basée sur les frameworks NIST et CIS Controls.
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-200">Progression</span>
                <span className="text-sm text-purple-200">{completedCount}/{checklistItems.length}</span>
              </div>
              <div className="w-full bg-purple-800/30 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-purple-200 mt-2">
                {progressPercentage.toFixed(0)}% complété
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une mesure..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-500" />
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="Fondamentale">Fondamentale</option>
                <option value="Exécutable">Exécutable</option>
              </select>
              <button 
                onClick={openExportModal}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
              <div className="text-2xl font-bold text-slate-900">{checklistItems.length}</div>
              <div className="text-sm text-slate-600">Mesures totales</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-slate-600">Complétées</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
              <div className="text-2xl font-bold text-red-600">
                {checklistItems.filter(item => item.type === 'Fondamentale').length}
              </div>
              <div className="text-sm text-slate-600">Fondamentales</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {checklistItems.filter(item => item.type === 'Exécutable').length}
              </div>
              <div className="text-sm text-slate-600">Exécutables</div>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist Items */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white border-2 rounded-xl p-6 transition-all duration-200 ${
                  checkedItems[item.id] 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-slate-200 hover:border-purple-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <button
                      onClick={() => handleCheckItem(item.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        checkedItems[item.id]
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-slate-300 hover:border-purple-500'
                      }`}
                    >
                      {checkedItems[item.id] && <CheckCircle className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === 'Fondamentale' 
                          ? 'bg-red-100 text-red-800' 
                          : item.type === 'Exécutable'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {item.type}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </div>
                    
                    <h3 className={`text-lg font-semibold mb-2 ${
                      checkedItems[item.id] ? 'text-green-800 line-through' : 'text-slate-900'
                    }`}>
                      {item.mesure}
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-slate-600">
                        <User className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="font-medium">Responsable:</span>
                        <span className="ml-1">{item.responsable}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="font-medium">Fréquence:</span>
                        <span className="ml-1">{item.frequence}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Target className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="font-medium">Indicateur:</span>
                        <span className="ml-1">{item.indicateur}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune mesure trouvée</h3>
              <p className="text-slate-600">Essayez de modifier vos critères de recherche ou de filtrage.</p>
            </div>
          )}
        </div>
      </section>

      {/* Action Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Besoin d'aide pour implémenter ces mesures ?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Notre équipe d'experts peut vous accompagner dans la mise en œuvre de votre stratégie cybersécurité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all inline-flex items-center justify-center"
            >
              Demander conseil
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <button 
              onClick={openExportModal}
              className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-all inline-flex items-center justify-center"
            >
              <Download className="mr-2 h-5 w-5" />
              Télécharger la checklist
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
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
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

      {/* Modal d'export PDF */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-purple-600" />
                  Exporter la checklist PDF
                </h3>
                <button
                  onClick={closeExportModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-slate-600 mb-4">
                  Générez un rapport PDF personnalisé de votre évaluation cybersécurité avec cachet E-ARONCY.
                </p>
                
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center text-purple-800 mb-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="font-medium">Votre progression actuelle</span>
                  </div>
                  <div className="text-sm text-purple-700">
                    {completedCount}/{checklistItems.length} mesures complétées ({progressPercentage.toFixed(0)}%)
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-slate-700 mb-2">
                      <Building className="h-4 w-4 inline mr-1" />
                      Nom de votre organisation (optionnel)
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="Ex: ONG Solidarité Afrique"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Ce nom apparaîtra sur la page de couverture du rapport PDF
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={closeExportModal}
                  className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Génération...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Générer PDF
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center text-slate-600 text-xs">
                  <Shield className="h-3 w-3 mr-1 text-purple-600" />
                  Le PDF généré inclura le cachet E-ARONCY et un code QR de certification
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
