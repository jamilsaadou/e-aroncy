'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Shield, CheckCircle, AlertCircle, Save, RotateCcw, FileText, Users, Lock, Wifi, Database, Settings } from 'lucide-react';

interface DiagnosticData {
  organizationInfo: {
    name: string;
    type: string;
    size: string;
    sector: string;
    country: string;
  };
  sections: {
    governance: { [key: string]: string | string[] };
    infrastructure: { [key: string]: string | string[] };
    accessControl: { [key: string]: string | string[] };
    incidentResponse: { [key: string]: string | string[] };
    awareness: { [key: string]: string | string[] };
    resilience: { [key: string]: string | string[] };
  };
  currentSection: string;
  completedSections: string[];
}

const STORAGE_KEY = 'cybersecurity_diagnostic';

export default function DiagnosticPage() {
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData>({
    organizationInfo: {
      name: '',
      type: '',
      size: '',
      sector: '',
      country: ''
    },
    sections: {
      governance: {},
      infrastructure: {},
      accessControl: {},
      incidentResponse: {},
      awareness: {},
      resilience: {}
    },
    currentSection: 'organizationInfo',
    completedSections: []
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Charger les données depuis localStorage au montage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setDiagnosticData(parsed);
        setLastSaved(new Date(parsed.lastSaved || Date.now()));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);

  // Sauvegarder automatiquement les données
  useEffect(() => {
    const saveData = () => {
      const dataToSave = {
        ...diagnosticData,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      setLastSaved(new Date());
    };

    const timeoutId = setTimeout(saveData, 1000); // Sauvegarde après 1 seconde d'inactivité
    return () => clearTimeout(timeoutId);
  }, [diagnosticData]);

  const sections = [
    {
      id: 'organizationInfo',
      title: 'Informations sur l\'organisation',
      icon: <Users className="h-5 w-5" />,
      description: 'Informations générales sur votre organisation'
    },
    {
      id: 'governance',
      title: 'Gouvernance',
      icon: <FileText className="h-5 w-5" />,
      description: 'Politiques de sécurité et gouvernance'
    },
    {
      id: 'awareness',
      title: 'Sensibilisation',
      icon: <Shield className="h-5 w-5" />,
      description: 'Formation et sensibilisation du personnel'
    },
    {
      id: 'accessControl',
      title: 'Gestion des accès',
      icon: <Lock className="h-5 w-5" />,
      description: 'Gestion des accès et authentification'
    },
    {
      id: 'infrastructure',
      title: 'Sécurisation des infrastructures',
      icon: <Settings className="h-5 w-5" />,
      description: 'Sécurité de l\'infrastructure IT'
    },
    {
      id: 'incidentResponse',
      title: 'Détection et réaction',
      icon: <AlertCircle className="h-5 w-5" />,
      description: 'Détection et réponse aux incidents de sécurité'
    },
    {
      id: 'resilience',
      title: 'Résilience',
      icon: <Database className="h-5 w-5" />,
      description: 'Continuité d\'activité et récupération'
    }
  ];

  const questions = {
    governance: [
      {
        id: 'q1',
        question: 'Qui est responsable de la sécurité des SI dans votre organigramme ?',
        type: 'radio',
        options: [
          'Le RSSI (Responsable de la Sécurité des Systèmes d\'Information)',
          'Le Resp. informatique ou de securité informatique',
          'Il y a un référent SSI',
          'Personne'
        ],
        scores: [1.5, 1, 0.5, 0]
      },
      {
        id: 'q2',
        question: 'Avez-vous une strategie ou plan d\'action de cybersécurité?',
        type: 'radio',
        options: [
          'Il y a une Plan d\'action de cybersecurité (PAC) et est validée par la direction',
          'Il y a une PAC mais elle n\'est pas validée par la direction',
          'Aucun PAC n\'a été rédigée pour la structure',
          'Non'
        ],
        scores: [2, 1, 0.75, 0]
      },
      {
        id: 'q3',
        question: 'Est-ce que vous avez déjà réalisé une feuille de route ou schéma directeur SSI ?',
        type: 'radio',
        options: [
          'Oui, dans les 2 dernières année et il a été validé par la direction',
          'Oui, dans les 2 dernières année mais sans présentation/validation par la direction',
          'Oui, il y a plus de 2 ans',
          'Non'
        ],
        scores: [1, 0.75, 0.5, 0]
      },
      {
        id: 'q4',
        question: 'Un comité de pilotage de la cyber sécurité est-il mis en place ?',
        type: 'checkbox',
        options: [
          'Oui, et un membre de la direction générale y participe',
          'Oui, et le Directeur du Systèmes d\'Information y participe',
          'Oui, il a lieu une fois par trimestre ou mois',
          'Oui, il a lieu une fois par an ou semestre',
          'Non'
        ],
        scores: [1.5, 1, 0.75, 0.5, 0]
      },
      {
        id: 'q5',
        question: 'De quels types de cartographies/référentiels disposez vous ?',
        type: 'checkbox',
        options: [
          'Cartographie/référentiel des données',
          'Cartographie/référentiel des comptes à privilèges',
          'Cartographie/référentiel de l\'infrastructure SI',
          'Cartographie/référentiel des interconnexions avec les partenaires et les prestataires',
          'Cartographie/référentiel des flux réseau',
          'Cartographie/référentiel des enjeux SSI associés aux applications',
          'Cartographie/référentiel des applications du SI ( Systèmes d\'Information)'
        ],
        scores: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
      }
    ],
    awareness: [
      {
        id: 'q6',
        question: 'Quelles actions de sensibilisation menez-vous ?',
        type: 'checkbox',
        options: [
          'Réalisation de campagnes mail, de présentations en présentiel, de vidéos, de campagnes d\'affichage ou autre',
          'Réalisation de campagnes de phishing'
        ],
        scores: [0.5, 0.5]
      },
      {
        id: 'q7',
        question: 'Avez-vous défini une stratégie de sensibilisation ?',
        type: 'radio',
        options: [
          'Oui, et elle évolue chaque année',
          'Oui, mais elle évolue très peu',
          'Non'
        ],
        scores: [1, 0.5, 0]
      },
      {
        id: 'q8',
        question: 'Quelles populations sont sensibilisées à la cybersécurité ?',
        type: 'checkbox',
        options: [
          'Les dirigeants, qui sont des sponsors actifs des démarches cybersécurité dans l\'organisme',
          'Les acheteurs, qui garantissent la prise en compte de la cybersécurité dans la plupart des contrats et prestations',
          'Les référents/MOA métier, qui prennent en compte de la cybersécurité dans la plupart des processus métiers et maîtrise d\'ouvrage des applications',
          'Les administrateurs système, qui prennent en compte la cybersécurité dans la plupart des processus d\'exploitation des SI'
        ],
        scores: [0.5, 0.5, 0.5, 0.5]
      },
      {
        id: 'q9',
        question: 'Comment encadrez-vous vos prestataires (SI, métier ou SSI) sur les aspects cybersécurité ?',
        type: 'checkbox',
        options: [
          'Il y a des clauses contractuelles liées à la SSI',
          'Des audits des prestataires les plus sensibles sont effectués',
          'Un PAS (Plan d\'Assurance Sécurité) est mis en œuvre',
          'Aucune de ces mesures n\'est mise en œuvre'
        ],
        scores: [0.5, 0.5, 0.5, 0]
      },
      {
        id: 'q10',
        question: 'Quel ratio de vos prestations ayant des enjeux important de cybersécurité (en disponibilité, intégrité ou confidentialité) est encadré sur les aspects cybersécurité ?',
        type: 'radio',
        options: [
          'Plus de 80%',
          'Entre 50% et 80%',
          'Entre 20% et 50%',
          'Moins de 20%'
        ],
        scores: [1, 0.75, 0.5, 0.25]
      }
    ],
    accessControl: [
      {
        id: 'q11',
        question: 'Avez-vous supprimé les comptes d\'accès génériques (un compte utilisé par plusieurs personnes) ?',
        type: 'checkbox',
        options: [
          'Oui, sur les comptes d\'administration fonctionnelle des applications',
          'Oui, sur les comptes d\'administration système',
          'Oui, sur les comptes utilisateurs',
          'Non'
        ],
        scores: [2, 1, 1, 0]
      },
      {
        id: 'q12',
        question: 'Avez-vous mis en place un AD ?',
        type: 'radio',
        options: [
          'Oui, et il couvre la grande majorité des accès à mon SI',
          'Oui, et il couvre une partie des accès à mon SI',
          'Non'
        ],
        scores: [2, 1, 0]
      },
      {
        id: 'q13',
        question: 'Est-ce que les profils d\'habilitation et les droits associés sont définis selon le principe du moindre privilège ?',
        type: 'checkbox',
        options: [
          'Oui, pour les droits fonctionnels de la grande majorité des applications',
          'Oui, pour les droits fonctionnels des applications les plus sensibles',
          'Oui, pour les administrateurs système',
          'Oui, pour les accès aux serveurs de fichiers/données partagées',
          'Non'
        ],
        scores: [1, 1, 1, 1, 0]
      },
      {
        id: 'q14',
        question: 'Avez-vous mis en place un processus de revue des habilitations?',
        type: 'checkbox',
        options: [
          'Oui, sur les habilitations d\'accès aux serveurs de fichiers/données partagées',
          'Oui, sur les habilitations d\'accès aux serveurs de fichiers/données partagées les plus sensibles',
          'Oui, sur les habilitations d\'utilisation des applications',
          'Oui, sur les habilitations d\'utilisation des applications sur les périmètres les plus sensibles',
          'Oui, sur les habilitations d\'administration fonctionnelle',
          'Oui, sur les habilitations d\'administration fonctionnelle sur les périmètres les plus sensibles',
          'Oui, sur les habilitations d\'administration système',
          'Oui, sur les habilitations d\'administration système pour les périmètres les plus sensibles',
          'Non'
        ],
        scores: [1, 1, 1, 1, 1, 1, 1, 1, 0]
      },
      {
        id: 'q15',
        question: 'Appliquez-vous une politique de mot de passe ?',
        type: 'checkbox',
        options: [
          'Une politique renforcée est mise en place pour les administrateurs',
          'Oui, pour la quasi-totalité des services',
          'Oui, pour quelques services',
          'Non'
        ],
        scores: [1, 1, 0.5, 0]
      },
      {
        id: 'q16',
        question: 'Utilisez-vous un système d\'authentification multi facteurs ?',
        type: 'checkbox',
        options: [
          'Oui, sur la grande majorité des accès applicatifs',
          'Oui, sur les accès applicatifs les plus sensibles',
          'Oui, sur les accès d\'administration système',
          'Non'
        ],
        scores: [1, 1, 1, 0]
      }
    ],
    infrastructure: [
      {
        id: 'q17',
        question: 'Quels sont les délais maximum d\'application des correctifs de sécurité mis en œuvre sur vos systèmes et applicatifs ?',
        type: 'checkbox',
        options: [
          'Les correctifs critiques sont appliqués dans la semaine suivant leur publication',
          'Les correctifs pertinents pour le SI sont appliqués dans les 2 mois suivant leur publication',
          'Les correctifs pertinents pour le SI sont appliqués sous un délai supérieur à 2 mois suivant leur publication',
          'Il n\'y a pas de délai maximum d\'application des correctifs'
        ],
        scores: [2, 1, 0.5, 0]
      },
      {
        id: 'q18',
        question: 'Utilisez-vous un antivirus sur vos serveurs ?',
        type: 'radio',
        options: [
          'Oui, sur la totalité des serveurs où cela est pertinent (ex : non recommandé sur les contrôleurs de domaine AD)',
          'Non'
        ],
        scores: [2, 0]
      },
      {
        id: 'q19',
        question: 'Avez-vous fait un travail de durcissement de la configuration de certains équipements ?',
        type: 'checkbox',
        options: [
          'Sur la messagerie',
          'Sur la (quasi) totalité des serveurs',
          'Sur les serveurs hébergeant les services les plus sensibles',
          'Sur le Wi-Fi',
          'Non'
        ],
        scores: [2, 1, 1, 1, 0]
      },
      {
        id: 'q20',
        question: 'Avez-vous des ressources obsolètes (maintenance arrêtée par l\'éditeur ou ne pouvant être réalisée) ?',
        type: 'radio',
        options: [
          'Non',
          'Oui, et moins de 5% de notre périmètre est concerné',
          'Oui, et plus de 5% de notre périmètre est concerné'
        ],
        scores: [2, 1, 0]
      },
      {
        id: 'q21',
        question: 'Réalisez-vous le chiffrement de vos données stockées au sein du datacenter ?',
        type: 'checkbox',
        options: [
          'Toutes les données les plus sensibles sont chiffrées dans les sauvegardes',
          'La majorité des données les plus sensibles sont chiffrées dans les bases de données en production',
          'Oui, pour les zones de stockage des hashs des mots de passe',
          'Non'
        ],
        scores: [2, 1, 0.5, 0]
      },
      {
        id: 'q22',
        question: 'Avez-vous mis en place un VPN pour les accès à distance ?',
        type: 'radio',
        options: [
          'Oui',
          'Non'
        ],
        scores: [1, 0]
      },
      {
        id: 'q23',
        question: 'Quels dispositifs de cloisonnement sont mis en œuvre ?',
        type: 'checkbox',
        options: [
          'Il y a une DMZ dédiée aux applications exposées à l\'extérieur',
          'Un NAC (Network Access Control) est mis en place pour contrôler les équipements se connectant au réseau',
          'Les règles de filtrage des flux sont clairement définies et tenues à jour',
          'Le SI applicatif est séparé en plusieurs zones construites de façon logique et un cloisonnement complémentaire est réalisés pour les périmètres les plus sensibles',
          'Le SI applicatif est séparé en plusieurs zones construites de façon logique et cloisonnées par un FW',
          'Les interconnexions réseau dédiées avec les principaux partenaires / prestataires sont sécurisées',
          'Un FW a été positionné en coupure des liens avec les partenaires / prestataires',
          'Le réseau des administrateurs est cloisonné du reste du SI',
          'Aucun'
        ],
        scores: [1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0]
      },
      {
        id: 'q24',
        question: 'Avez-vous mis en place un proxy ?',
        type: 'checkbox',
        options: [
          'Oui, et cela couvre les flux applicatifs vers l\'Internet (sortant)',
          'Oui, et cela couvre les flux de browsing vers l\'Internet (sortant)',
          'Non'
        ],
        scores: [0.5, 0.5, 0]
      },
      {
        id: 'q25',
        question: 'Vos flux sont-ils chiffrés ?',
        type: 'checkbox',
        options: [
          'Oui, les flux sensibles transitant au sein du centre informatique et contenant des données sensibles sont chiffrés',
          'Oui, les flux sensibles transitant en dehors du centre informatique et contenant des données sensibles sont chiffrés',
          'Oui, les flux d\'administration système sont chiffrés',
          'Non, aucun flux n\'est chiffré'
        ],
        scores: [0.5, 0.5, 0.5, 0]
      },
      {
        id: 'q26',
        question: 'Sécurisez-vous les échanges de données sensibles non applicatives transmises via Internet ?',
        type: 'checkbox',
        options: [
          'Oui, une plateforme de partage sécurisé de données est mise en place',
          'Oui, les pièces jointes des mails contenant des données sensibles sont chiffrées',
          'Non'
        ],
        scores: [1, 1, 0]
      },
      {
        id: 'q27',
        question: 'Comment sécurisez-vous les données se trouvant sur les téléphones ou tablettes ?',
        type: 'checkbox',
        options: [
          'Utilisation d\'un MDM (Mobile Device Management) sur la totalité de notre parc de téléphones mobiles et de tablettes',
          'Utilisation d\'un MDM (Mobile Device Management) sur une partie de notre parc de téléphones mobiles et de tablettes (celle utilisée par les populations les plus sensibles)',
          'Solutions de chiffrement industrialisées sur la totalité des terminaux',
          'Solutions de chiffrement industrialisées sur une partie des terminaux (celle utilisée par les populations les plus sensibles)',
          'Rien n\'est mis en œuvre'
        ],
        scores: [2, 2, 1.5, 1, 0]
      },
      {
        id: 'q28',
        question: 'Comment protégez-vous vos postes de travail ?',
        type: 'checkbox',
        options: [
          'Mise en place d\'une stratégie de sécurité au travers d\'une GPO, durcissement de la configuration du BIOS et de la chaîne de démarrage',
          'Déploiement d\'un antivirus',
          'Déploiement d\'un pare-feu local',
          'Restriction des droits d\'administration au strict besoin',
          'Chiffrement des disques durs',
          'Rien n\'est réalisé'
        ],
        scores: [1, 1, 1, 1, 1, 0]
      },
      {
        id: 'q29',
        question: 'Utilisez-vous un système EDR (Endpoint Detection and Response) ?',
        type: 'radio',
        options: [
          'Oui, sur la totalité de notre parc de postes de travail',
          'Oui, sur une partie de notre parc de postes de travail',
          'Non'
        ],
        scores: [1, 0.5, 0]
      },
      {
        id: 'q30',
        question: 'Avez-vous mis en place un DLP (Data Leak Prevention) ?',
        type: 'radio',
        options: [
          'Oui',
          'Non'
        ],
        scores: [2, 0]
      },
      {
        id: 'q31',
        question: 'De quelle façon prenez-vous en compte la sécurité dans vos projets SI ?',
        type: 'checkbox',
        options: [
          'Homologation des principaux SI sensibles du SI legacy',
          'Homologation de tous les nouveaux projets sensibles',
          'Des principes de développement sécurisé sont mis en œuvre',
          'Prise en compte des problématiques de sécurisation dans les projets SI',
          'Rien n\'est fait'
        ],
        scores: [1, 1, 1, 1, 0]
      },
      {
        id: 'q32',
        question: 'Réalisez-vous des scans de vulnérabilité / audits / tests d\'intrusion ?',
        type: 'checkbox',
        options: [
          'Un audit red team, déjà au moins une fois',
          'Des tests d\'intrusions, plusieurs fois par an',
          'Des tests d\'intrusions, une fois par an',
          'Des tests d\'intrusions, une fois tous les 2 à 3 ans',
          'Des scans de vulnérabilités internes, en permanence',
          'Des scans de vulnérabilités internes, tous les ans ou plus fréquemment',
          'Des scans de vulnérabilités externes, tous les ans ou plus fréquemment',
          'Des scans de vulnérabilités externes, tous les 2 à 3 ans',
          'Non'
        ],
        scores: [2, 1, 1, 0.75, 0.5, 0.5, 0.5, 0.5, 0]
      },
      {
        id: 'q33',
        question: 'Avez-vous audité votre AD ?',
        type: 'radio',
        options: [
          'Oui',
          'Non'
        ],
        scores: [2, 1]
      }
    ],
    incidentResponse: [
      {
        id: 'q34',
        question: 'Est-ce que vous journalisez les évènements relatifs à l\'authentification des utilisateurs, à la gestion des comptes et des droits d\'accès, à l\'accès aux ressources, aux modifications des règles de sécurité ?',
        type: 'radio',
        options: [
          'Oui, pour l\'ensemble de ces évènements et pour la majorité des applications et composants',
          'Oui, pour une partie de ces évènements et pour la majorité des applications et composants',
          'Oui, pour l\'ensemble de ces évènements et pour les applications et composants les plus sensibles',
          'Oui, pour une partie de ces évènements et pour les applications et composants les plus sensibles',
          'Non'
        ],
        scores: [2, 1.5, 1, 0.5, 0]
      },
      {
        id: 'q35',
        question: 'Avez-vous mis en œuvre un puit de logs ?',
        type: 'radio',
        options: [
          'Oui, et il couvre la majorité des ressources',
          'Oui, et il couvre la majorité des ressources les plus sensibles',
          'Oui, et il couvre quelques unes des ressources',
          'Non'
        ],
        scores: [1.5, 1, 0.5, 0]
      },
      {
        id: 'q36',
        question: 'Etes-vous équipé d\'un SIEM (Security Information and Event Management) ?',
        type: 'radio',
        options: [
          'Oui, et il couvre la majorité des ressources',
          'Oui, et il couvre la majorité des ressources les plus sensibles',
          'Oui, et il couvre quelques unes des ressources',
          'Non'
        ],
        scores: [1.5, 1, 0.5, 0]
      },
      {
        id: 'q37',
        question: 'Disposez-vous d\'un SOC (Centre des Opérations de Sécurité )?',
        type: 'checkbox',
        options: [
          'Oui, et il fonctionne en HO/HNO',
          'Oui, et il fonctionne en HO',
          'Oui, et il couvre la majorité des ressources',
          'Oui, et il couvre la majorité des ressources les plus sensibles',
          'Oui, et il couvre quelques unes des ressources',
          'Non'
        ],
        scores: [2, 1.5, 1, 0.75, 0.5, 0]
      },
      {
        id: 'q38',
        question: 'Disposez-vous d\'un processus de gestion des incidents de sécurité ?',
        type: 'radio',
        options: [
          'Oui, et il est formalisé',
          'Oui, il est informel ou se limite à une fiche réflexe',
          'Non'
        ],
        scores: [3, 1.5, 0]
      },
      {
        id: 'q39',
        question: 'Avez-vous un processus formel de gestion de crise ?',
        type: 'radio',
        options: [
          'Oui, et il a été testé',
          'Oui',
          'Non'
        ],
        scores: [3, 1, 0]
      }
    ],
    resilience: [
      {
        id: 'q40',
        question: 'Vos actifs sont-ils tous sauvegardés au minimum toutes les 24 heures ?',
        type: 'checkbox',
        options: [
          'Oui, pour les données sur les postes de travail',
          'Oui, pour les serveurs de fichiers/données partagées',
          'Oui, pour les données applicatives',
          'Non'
        ],
        scores: [2, 1.5, 1, 0]
      },
      {
        id: 'q41',
        question: 'Seriez-vous capable de restaurer l\'intégralité de votre SI en cas de cryptolockage généralisé de votre SI ?',
        type: 'radio',
        options: [
          'Oui, mes sauvegardes sont stockées de façon sécurisée (déconnectées ou stockées sur bande magnétique) et une solution de reconstruction/reprise rapide des serveurs de sauvegarde et terminaux est disponible en cas de crise.',
          'Oui, mes sauvegardes sont stockées de façon sécurisée (déconnectées ou stockées sur bande magnétique) mais il faudrait du temps pour rétablir l\'infrastructure',
          'Non'
        ],
        scores: [2, 1, 0]
      }
    ]
  };

  const updateOrganizationInfo = (field: string, value: string) => {
    setDiagnosticData(prev => ({
      ...prev,
      organizationInfo: {
        ...prev.organizationInfo,
        [field]: value
      }
    }));
  };

  const updateSectionData = (section: string, questionId: string, value: string | string[]) => {
    setDiagnosticData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: {
          ...prev.sections[section as keyof typeof prev.sections],
          [questionId]: value
        }
      }
    }));
  };

  const goToSection = (sectionId: string) => {
    // Empêcher de sauter des étapes - on ne peut aller que vers la section suivante ou précédente
    const currentIndex = sections.findIndex(s => s.id === diagnosticData.currentSection);
    const targetIndex = sections.findIndex(s => s.id === sectionId);
    
    // Permettre de naviguer vers les sections précédentes ou la section suivante immédiate
    if (targetIndex <= currentIndex + 1 || diagnosticData.completedSections.includes(sectionId)) {
      setDiagnosticData(prev => ({
        ...prev,
        currentSection: sectionId
      }));
    }
  };

  const markSectionComplete = (sectionId: string) => {
    setDiagnosticData(prev => ({
      ...prev,
      completedSections: [...prev.completedSections.filter(s => s !== sectionId), sectionId]
    }));
  };

  // Fonction pour vérifier si toutes les questions d'une section sont répondues
  const isSectionComplete = (sectionId: string) => {
    if (sectionId === 'organizationInfo') {
      const { name, type, size, sector, country } = diagnosticData.organizationInfo;
      return name && type && size && sector && country;
    }

    const sectionQuestions = questions[sectionId as keyof typeof questions];
    if (!sectionQuestions) return true;

    const sectionData = diagnosticData.sections[sectionId as keyof typeof diagnosticData.sections];
    if (!sectionData) return false;
    
    return sectionQuestions.every(question => {
      const answer = sectionData[question.id];
      if (question.type === 'radio') {
        return answer && answer !== '';
      } else if (question.type === 'checkbox') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return false;
    });
  };

  // Fonction pour obtenir les questions manquantes d'une section
  const getMissingQuestions = (sectionId: string) => {
    if (sectionId === 'organizationInfo') {
      const { name, type, size, sector, country } = diagnosticData.organizationInfo;
      const missing = [];
      if (!name) missing.push('Nom de l\'organisation');
      if (!type) missing.push('Type d\'organisation');
      if (!size) missing.push('Taille de l\'organisation');
      if (!sector) missing.push('Secteur d\'activité');
      if (!country) missing.push('Pays');
      return missing;
    }

    const sectionQuestions = questions[sectionId as keyof typeof questions];
    if (!sectionQuestions) return [];

    const sectionData = diagnosticData.sections[sectionId as keyof typeof diagnosticData.sections];
    if (!sectionData) return sectionQuestions.map(q => q.question);
    
    return sectionQuestions.filter(question => {
      const answer = sectionData[question.id];
      if (question.type === 'radio') {
        return !answer || answer === '';
      } else if (question.type === 'checkbox') {
        return !Array.isArray(answer) || answer.length === 0;
      }
      return true;
    }).map(q => q.question);
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    // Scores maximums par section selon vos données
    const maxScores = {
      governance: 16.25,
      awareness: 8.5,
      accessControl: 23.5,
      infrastructure: 56.75,
      incidentResponse: 25.25,
      resilience: 7.5
    };

    Object.entries(questions).forEach(([sectionKey, sectionQuestions]) => {
      const sectionData = diagnosticData.sections[sectionKey as keyof typeof diagnosticData.sections];
      let sectionScore = 0;
      
      sectionQuestions.forEach(question => {
        const answer = sectionData ? sectionData[question.id] : undefined;
        
        if (answer) {
          if (question.type === 'radio') {
            const index = question.options.indexOf(answer as string);
            if (index !== -1 && question.scores) {
              sectionScore += question.scores[index];
            }
          } else if (question.type === 'checkbox' && Array.isArray(answer)) {
            answer.forEach(selectedOption => {
              const index = question.options.indexOf(selectedOption);
              if (index !== -1 && question.scores) {
                sectionScore += question.scores[index];
              }
            });
          }
        }
      });
      
      totalScore += sectionScore;
    });

    // Score total maximum
    const totalMaxScore = Object.values(maxScores).reduce((sum, score) => sum + score, 0);
    
    return Math.round((totalScore / totalMaxScore) * 100);
  };

  const resetDiagnostic = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDiagnosticData({
      organizationInfo: {
        name: '',
        type: '',
        size: '',
        sector: '',
        country: ''
      },
      sections: {
        governance: {},
        infrastructure: {},
        accessControl: {},
        incidentResponse: {},
        awareness: {},
        resilience: {}
      },
      currentSection: 'organizationInfo',
      completedSections: []
    });
    setShowResults(false);
    setLastSaved(null);
  };

  const generateReport = () => {
    setShowResults(true);
  };

  const renderOrganizationInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Nom de l'organisation *
        </label>
        <input
          type="text"
          value={diagnosticData.organizationInfo.name}
          onChange={(e) => updateOrganizationInfo('name', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Nom de votre organisation"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Type d'organisation *
        </label>
        <select
          value={diagnosticData.organizationInfo.type}
          onChange={(e) => updateOrganizationInfo('type', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sélectionnez le type</option>
          <option value="ong">ONG</option>
          <option value="association">Association</option>
          <option value="fondation">Fondation</option>
          <option value="cooperative">Coopérative</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Taille de l'organisation *
        </label>
        <select
          value={diagnosticData.organizationInfo.size}
          onChange={(e) => updateOrganizationInfo('size', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sélectionnez la taille</option>
          <option value="1-10">1-10 employés</option>
          <option value="11-50">11-50 employés</option>
          <option value="51-200">51-200 employés</option>
          <option value="200+">Plus de 200 employés</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Secteur d'activité *
        </label>
        <select
          value={diagnosticData.organizationInfo.sector}
          onChange={(e) => updateOrganizationInfo('sector', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sélectionnez le secteur</option>
          <option value="education">Éducation</option>
          <option value="sante">Santé</option>
          <option value="environnement">Environnement</option>
          <option value="droits-humains">Droits humains</option>
          <option value="developpement">Développement</option>
          <option value="humanitaire">Humanitaire</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Pays *
        </label>
        <select
          value={diagnosticData.organizationInfo.country}
          onChange={(e) => updateOrganizationInfo('country', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Sélectionnez le pays</option>
          <option value="benin">Bénin</option>
          <option value="burkina-faso">Burkina Faso</option>
          <option value="cote-ivoire">Côte d'Ivoire</option>
          <option value="ghana">Ghana</option>
          <option value="guinee">Guinée</option>
          <option value="mali">Mali</option>
          <option value="niger">Niger</option>
          <option value="senegal">Sénégal</option>
          <option value="togo">Togo</option>
          <option value="autre">Autre</option>
        </select>
      </div>
    </div>
  );

  const renderQuestion = (question: any, sectionKey: string) => {
    const sectionData = diagnosticData.sections[sectionKey as keyof typeof diagnosticData.sections];
    const currentValue = sectionData ? sectionData[question.id] : undefined;

    if (question.type === 'radio') {
      return (
        <div key={question.id} className="space-y-3">
          <h4 className="font-medium text-slate-900">{question.question}</h4>
          <div className="space-y-2">
            {question.options.map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentValue === option}
                  onChange={(e) => updateSectionData(sectionKey, question.id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === 'checkbox') {
      return (
        <div key={question.id} className="space-y-3">
          <h4 className="font-medium text-slate-900">{question.question}</h4>
          <div className="space-y-2">
            {question.options.map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(currentValue) && currentValue.includes(option)}
                  onChange={(e) => {
                    const currentArray = Array.isArray(currentValue) ? currentValue : [];
                    if (e.target.checked) {
                      updateSectionData(sectionKey, question.id, [...currentArray, option]);
                    } else {
                      updateSectionData(sectionKey, question.id, currentArray.filter(v => v !== option));
                    }
                  }}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }
  };

  const renderSection = (sectionKey: string) => {
    const sectionQuestions = questions[sectionKey as keyof typeof questions];
    
    if (!sectionQuestions) {
      return (
        <div className="text-center py-8">
          <p className="text-slate-600">Questions en cours de préparation pour cette section.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-8">
        {sectionQuestions.map(question => renderQuestion(question, sectionKey))}
      </div>
    );
  };

  const renderResults = () => {
    const score = calculateScore();
    let level = '';
    let color = '';
    let bgColor = '';

    // Niveaux selon votre système
    if (score > 75) {
      level = 'Optimal';
      color = 'text-green-600';
      bgColor = 'bg-green-50 border-green-200';
    } else if (score > 50) {
      level = 'Avancé';
      color = 'text-blue-600';
      bgColor = 'bg-blue-50 border-blue-200';
    } else if (score > 25) {
      level = 'Essentiel';
      color = 'text-yellow-600';
      bgColor = 'bg-yellow-50 border-yellow-200';
    } else {
      level = 'Initial';
      color = 'text-red-600';
      bgColor = 'bg-red-50 border-red-200';
    }

    const recommendations: Record<string, Array<{title: string; items: string[]}>> = {
      'Initial': [
        {
          title: '1. Organisation et sensibilisation aux risques numériques',
          items: [
            'Ma structure a un référent à la sécurité des systèmes d\'informations (SSI), désigné par la direction et identifié comme tel par les agents et formé à la SSI',
            'Je sensibilise mon équipe dirigeante aux risques numériques et elle est un soutien actif de la démarche de sécurisation',
            'Je sensibilise l\'ensemble des agents aux risques liés au phishing (courriels piégés)',
            'Je sensibilise et réalise des actions de formation aux problématiques et bonnes pratiques de la SSI pour les acteurs à privilèges de la DSI (exploitation, assistance,...)',
            'J\'ai identifié mes principaux fournisseurs de services numériques et je leur impose des clauses SSI adaptées en fonction des prestations menées',
            'Je pilote et je mets en œuvre les recommandations de mes audits à l\'aide d\'un plan de sécurisation'
          ]
        },
        {
          title: '2. Contrôle des accès au système d\'information',
          items: [
            'J\'utilise un outil de gestion centralisée d\'identification et d\'authentification (p. ex. AD)',
            'J\'identifie nommément chaque utilisateur accédant au système (absence de compte générique)',
            'Je mets en œuvre des dispositifs garantissant la robustesse des mots de passe utilisés',
            'J\'utilise des mécanismes d\'authentification pour protéger les accès à mon SI depuis l\'extérieur'
          ]
        },
        {
          title: '3. Protection des données, applications et services',
          items: [
            'Je dispose d\'une cartographie de mes services les plus sensibles au regard de leurs besoins de sécurité et les plus vulnérables par rapport à leur exposition aux menaces',
            'J\'ai mis en place des mesures de protection de la messagerie professionnelle',
            'J\'ai mis en place des mesures de protection des services exposés sur Internet (p. ex. serveur mandataire inverse / reverse proxy)'
          ]
        },
        {
          title: '4. Sécurisation des équipements de travail',
          items: [
            'J\'ai inventorié l\'ensemble de mes postes de travail et équipements mobiles',
            'J\'ai déployé et configuré des solutions de protection sur les postes de travail (p. ex. anti-virus, pare-feu local)',
            'J\'applique une politique efficace de mise à jour de sécurité pour les postes de travail'
          ]
        },
        {
          title: '5. Protection du réseau',
          items: [
            'Je dispose d\'une cartographie de mon réseau et de ses interconnexions avec mes partenaires et prestataires',
            'J\'ai mis en place une protection des réseaux d\'accès Wi-Fi (accès par compte nominatif, certificats, etc.) et j\'ai mis en place une séparation des usages (interne, invité, etc.)',
            'J\'ai déployé et configuré une passerelle d\'accès sécurisé à Internet (p. ex. proxy)',
            'J\'ai cloisonné les ressources visibles depuis Internet du reste du système d\'information',
            'Je filtre les flux réseaux vers mes partenaires et prestataires',
            'La connexion des postes nomades à mon SI se fait au travers de connexions réseaux sécurisées (p. ex. VPN)'
          ]
        },
        {
          title: '6. Intégration de la sécurité dans l\'administration informatique',
          items: [
            'Je dispose d\'un inventaire exhaustif et à jour des comptes à privilèges, qui sont distincts des comptes utilisateurs',
            'J\'ai déployé un dispositif d\'authentification pour tout accès aux ressources de mon SI et j\'ai changé les éléments d\'authentification par défaut',
            'J\'utilise des protocoles sécurisés pour mes flux d\'administration',
            'J\'ai déployé et configuré des solutions de protection contre les codes malveillants (p. ex. anti-virus) sur les serveurs qui le nécessitent (p. ex. non recommandé sur un AD)',
            'J\'applique une politique efficace de mise à jour de sécurité pour les infrastructures',
            'J\'anticipe la fin de la maintenance des logiciels et systèmes',
            'Je prends en compte les enjeux de sécurité dans l\'identification des périmètres éligibles au Cloud (IaaS/PaaS/SaaS)',
            'J\'ai un dispositif de sauvegarde opérationnel et mes sauvegardes sont stockées indépendamment du reste du SI'
          ]
        },
        {
          title: '7. Identification des vulnérabilités du système',
          items: [
            'Je réalise des scans de vulnérabilité de mon SI exposé sur Internet',
            'Je mène un audit organisationnel adapté à mon niveau de maturité'
          ]
        },
        {
          title: '8. Détection et réaction aux incidents de sécurité',
          items: [
            'Je dispose d\'une fiche réflexe en cas d\'incident'
          ]
        }
      ],
      'Essentiel': [
        {
          title: '1. Organisation et sensibilisation aux risques numériques',
          items: [
            'Ma structure a un responsable de la SSI (RSSI) à temps plein',
            'J\'ai une politique SSI (PSSI), validée par la direction',
            'Je connais les principales zones de risques de mon infrastructure et de mon écosystème SI',
            'Je sensibilise l\'ensemble des agents aux risques numériques au moins une fois par an',
            'Je réalise des tests de phishing régulièrement',
            'Je mets en place des moyens d\'encadrement renforcés des prestations (p. ex. Plan d\'Assurance Sécurité, audits)',
            'J\'ai formalisé une charte applicable aux utilisateurs que ces derniers ont ensuite signée'
          ]
        },
        {
          title: '2. Contrôle des accès au système d\'information',
          items: [
            'Je dispose de procédures de gestion des habilitations liées au cycle de vie des agents (arrivée, départ, changement de fonction, etc.)',
            'Je sécurise le stockage des mots de passe ou de leurs hashs'
          ]
        },
        {
          title: '3. Protection des données, applications et services',
          items: [
            'J\'intègre la sécurité dans tout le cycle de vie de mes projets SI (étude d\'opportunité, architecture, recette, production, fin de vie...)',
            'Je mets en œuvre des principes de développement sécurisé dans mes projets SI',
            'J\'utilise des protocoles sécurisés pour les flux de données applicatifs dès qu\'ils sont pertinents',
            'J\'utilise des solutions de chiffrement (p. ex conteneur chiffré) lorsque je transmets des données non structurées (p. ex. fichiers) sensibles via Internet',
            'J\'applique une politique efficace de mise à jour de sécurité pour les applications'
          ]
        },
        {
          title: '4. Sécurisation des équipements de travail',
          items: [
            'J\'ai renforcé la configuration de mes terminaux/postes de travail pour limiter leur surface d\'exposition',
            'J\'ai mis en œuvre une solution de gestion centralisée des téléphones mobiles (p. ex. MDM)',
            'J\'ai mis en œuvre les bonnes pratiques liées à la configuration et l\'usage de mes imprimantes et copieurs multifonctions'
          ]
        },
        {
          title: '5. Protection du réseau',
          items: [
            'J\'ai défini des zones réseau selon la sensibilité de leur contenu et mis en place des dispositifs de filtrage / segmentation entre celles-ci'
          ]
        },
        {
          title: '6. Intégration de la sécurité dans l\'administration informatique',
          items: [
            'Je dispose d\'une cartographie de l\'infrastructure de mon SI',
            'J\'ai renforcé la configuration de l\'ensemble de mes serveurs/infrastructures pour limiter la surface d\'exposition des services d\'administration',
            'Je maîtrise l\'activité des comptes de service utilisés par les machines',
            'Je définis et j\'applique systématiquement des configurations de sécurité dans mes services Cloud (IaaS/PaaS)',
            'Je contrôle et protège l\'accès physique aux salles serveurs et aux locaux techniques',
            'J\'ai formalisé une charte applicable aux utilisateurs à privilèges de la DSI que ces derniers ont ensuite signée',
            'J\'ai déployé des dispositifs afin d\'augmenter la disponibilité de mes ressources les plus sensibles (p. ex. cluster)',
            'Je suis en capacité de restaurer rapidement mes services d\'infrastructure critiques (AD-DNS-DHCP-Console AV-SCCM- …) en cas de besoin'
          ]
        },
        {
          title: '7. Identification des vulnérabilités du système',
          items: [
            'Je réalise des scans de vulnérabilité de tout mon SI',
            'Je réalise un audit régulier de mon système de gestion centralisé d\'identification et d\'authentification'
          ]
        },
        {
          title: '8. Détection et réaction aux incidents de sécurité',
          items: [
            'J\'ai activé les principaux journaux d\'évènements de mes équipements de sécurité et de mon système de gestion centralisée d\'identification et d\'authentification et les ai centralisés dans un espace dédié indépendant de ces SI',
            'J\'ai une procédure formelle de gestion des incidents de sécurité',
            'J\'ai défini et testé une procédure d\'arrêt d\'urgence de mon SI en cas de sinistre'
          ]
        }
      ],
      'Avancé': [
        {
          title: '1. Organisation et sensibilisation aux risques numériques',
          items: [
            'Ma structure dispose de ressources dédiées à la sécurité opérationnelle',
            'J\'ai formalisé et attribué l\'ensemble des responsabilités internes et externes (prestataires, partenaires, etc.) à l\'égard de la SSI',
            'J\'ai un référentiel documentaire',
            'J\'applique un processus maîtrisé de gestion des dérogations/exceptions',
            'Je dispose d\'un comité régulier de pilotage des risques numériques auquel participe la direction',
            'Je mène des actions structurées et récurrentes de sensibilisation et de formation aux risques numériques et je vérifie l\'efficience de mes campagnes'
          ]
        },
        {
          title: '2. Contrôle des accès au système d\'information',
          items: [
            'J\'attribue les droits d\'accès aux ressources sensibles du SI selon les principes du moindre privilège et en évitant les combinaisons toxiques',
            'Je revois les comptes et les droits d\'accès de mes périmètres les plus sensibles annuellement',
            'J\'ai généralisé l\'authentification forte sur les périmètres les plus sensibles',
            'Je n\'autorise la connexion au réseau de l\'entité qu\'aux seuls équipements maîtrisés'
          ]
        },
        {
          title: '3. Protection des données, applications et services',
          items: [
            'J\'homologue mes nouveaux SI sensibles',
            'Je contrôle le niveau de sécurité des projets les plus sensibles (p. ex. audit, scan, revue de code, etc.) avant leur mise en production',
            'Je protège mes applications exposées les plus sensibles contre les attaques au niveau applicatif (p. ex. utilisation d\'un WAF)',
            'Je mets en œuvre un dispositif adapté d\'effacement sécurisé des supports de données (en cas de décommissionnement, de maintenance matérielle, etc.)'
          ]
        },
        {
          title: '4. Sécurisation des équipements de travail',
          items: [
            'Je limite au strict besoin opérationnel les droits d\'administration sur les postes de travail',
            'J\'ai chiffré les terminaux/postes de travail nomades contenant des données sensibles',
            'J\'ai déployé et configuré des dispositifs permettant de détecter et investiguer des intrusions sur mon poste de travail (p. ex. Endpoint Détection and Response (EDR), IPS ,etc.)'
          ]
        },
        {
          title: '5. Protection du réseau',
          items: [
            'J\'ai sécurisé les interconnexions réseau dédiées avec des tiers (p. ex. partenaires, prestataires, etc.)',
            'Je définis clairement et je tiens à jour les règles de filtrage des flux implémentées',
            'J\'ai mis en place une protection contre les attaques par déni de service (DDOS)'
          ]
        },
        {
          title: '6. Intégration de la sécurité dans l\'administration informatique',
          items: [
            'J\'utilise un réseau logique dédié et cloisonné pour l\'administration du système d\'information, déconnecté d\'Internet',
            'J\'attribue les droits administrateurs dans le respect du principe du moindre privilège',
            'Je centralise et je trace les accès des administrateurs (p. ex. serveur de rebond, bastion, etc.)',
            'Je teste régulièrement mes sauvegardes',
            'J\'ai un Plan de Reprise d\'Activité (PRA) en cas de sinistre physique de mon centre informatique, couvrant mes ressources les plus sensibles et testé annuellement'
          ]
        },
        {
          title: '7. Identification des vulnérabilités du système',
          items: [
            'Je réalise des tests d\'intrusion de mes SI exposés sur Internet'
          ]
        },
        {
          title: '8. Détection et réaction aux incidents de sécurité',
          items: [
            'J\'ai activé les principaux journaux d\'évènements pour les applications et infrastructures les plus sensibles, et les ai centralisés dans un espace dédié indépendant de ces SI',
            'J\'utilise les moyens de détection natifs des équipements de sécurité déjà déployés afin de générer des alertes pour les principaux incidents redoutés',
            'J\'ai défini un processus de gestion de crise cyber, testé annuellement'
          ]
        }
      ],
      'Optimal': [
        {
          title: '1. Organisation et sensibilisation aux risques numériques',
          items: [
            'Ma structure a positionné le RSSI à un niveau hiérarchique proche du niveau décisionnel',
            'Je définis mes orientations stratégiques en matière de sécurité et les décline sous la forme d\'une feuille de route pluriannuelle, validée par la direction',
            'Je détecte les écarts à la PSSI et met en œuvre des actions d\'amélioration',
            'Je mesure l\'efficacité de mes démarches de sécurisation à l\'aide d\'un nombre maîtrisé d\'indicateurs'
          ]
        },
        {
          title: '2. Contrôle des accès au système d\'information',
          items: [
            'Je revois l\'ensemble de mes comptes et droits d\'accès annuellement',
            'Je favorise les dispositifs limitant le nombre d\'authentifiants utilisés par les agents (p. ex. SSO)'
          ]
        },
        {
          title: '3. Protection des données, applications et services',
          items: [
            'Je dispose d\'une cartographie des données de mon SI',
            'J\'ai homologué tous mes SI sensibles',
            'Je contrôle régulièrement le niveau de sécurité des SI les plus sensibles (p. ex. audit, scan, revue de code, etc.) après leur mise en production',
            'J\'ai déployé et configuré des dispositifs permettant de bloquer les ressources infiltrées (p. ex. sandboxing) ou exfiltrées du SI (p. ex. Data Loss Prevention - DLP)',
            'Je sécurise les fichiers et bases de données les plus sensibles qui le nécessitent ainsi que leurs sauvegardes (p. ex. DRM/gestion des droits numériques, chiffrement, etc.)'
          ]
        },
        {
          title: '4. Sécurisation des équipements de travail',
          items: [
            'J\'ai formalisé une charte dédiée à l\'usage des équipements mobiles'
          ]
        },
        {
          title: '5. Protection du réseau',
          items: [
            'Je cloisonne physiquement ou logiquement les SI les plus sensibles vis-à-vis des autres systèmes d\'information internes ou tiers',
            'J\'ai déployé et configuré des sondes (p. ex. IDS, IPS) permettant de détecter ou bloquer les évènements suspects sur mon réseau'
          ]
        },
        {
          title: '6. Intégration de la sécurité dans l\'administration informatique',
          items: [
            'J\'ai déployé et configuré des dispositifs permettant de détecter et investiguer des intrusions sur mes serveurs (p. ex. IPS, EDR)',
            'J\'automatise les fonctionnalités de sécurité dans le cadre de mes déploiements d\'infrastructure dans le cloud (IaaS/PaaS)',
            'J\'ai un Plan de Reprise d\'Activité (PRA) en cas de cyberattaque, couvrant mes ressources les plus sensibles et testé annuellement'
          ]
        },
        {
          title: '7. Identification des vulnérabilités du système',
          items: [
            'Je mets en œuvre annuellement des plans de contrôle et d\'audit',
            'Je réalise des scans de vulnérabilité en continu',
            'Je réalise un audit red team'
          ]
        },
        {
          title: '8. Détection et réaction aux incidents de sécurité',
          items: [
            'J\'ai systématiquement activé les principaux journaux d\'évènements de la majorité de mes composants, et les ai centralisés dans un espace dédié indépendant de ces SI',
            'J\'ai mis en place une solution d\'analyse de mes journaux d\'évènements (p. ex. SIEM) afin de générer des alertes en accord avec une stratégie de détection',
            'J\'ai mis en place une équipe pour analyser en permanence les évènements de sécurité et réagir si nécessaire (SOC)',
            'J\'ai mis en place une équipe d\'experts en cybersécurité disponible 24/7 en cas de sinistre'
          ]
        }
      ]
    };

    const currentRecommendations = recommendations[level] || [];

    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className={`text-6xl font-bold ${color} mb-4`}>{score}%</div>
          <div className={`text-2xl font-semibold ${color} mb-2`}>Niveau: {level}</div>
          <p className="text-slate-600">Score de maturité cybersécurité</p>
        </div>

        <div className={`p-6 rounded-lg border ${bgColor}`}>
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Recommandations pour le niveau {level}
          </h3>
          
          <div className="space-y-6">
            {currentRecommendations.map((section: {title: string; items: string[]}, sectionIndex: number) => (
              <div key={sectionIndex} className="bg-white p-4 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3">{section.title}</h4>
                <ul className="space-y-2">
                  {section.items.map((item: string, itemIndex: number) => (
                    <li key={itemIndex} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-3">Prochaines étapes</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Consultez nos guides pratiques</li>
              <li>• Suivez nos formations spécialisées</li>
              <li>• Rejoignez notre communauté</li>
              <li>• Planifiez un audit complet</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-3">Ressources utiles</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Modèles de politiques de sécurité</li>
              <li>• Checklist de sécurité</li>
              <li>• Outils de sensibilisation</li>
              <li>• Contacts d'experts locaux</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const currentSectionData = sections.find(s => s.id === diagnosticData.currentSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Diagnostic Cybersécurité
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Évaluez le niveau de cybersécurité de votre organisation. 
            Vos réponses sont automatiquement sauvegardées dans votre navigateur.
          </p>
          
          {lastSaved && (
            <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-slate-500">
              <Save className="h-4 w-4" />
              <span>Dernière sauvegarde: {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Sections</h3>
              <nav className="space-y-2">
                {sections.map((section, index) => {
                  const currentIndex = sections.findIndex(s => s.id === diagnosticData.currentSection);
                  const isAccessible = index <= currentIndex + 1 || diagnosticData.completedSections.includes(section.id);
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => goToSection(section.id)}
                      disabled={!isAccessible}
                      className={`w-full text-left p-3 rounded-lg transition-all flex items-center space-x-3 ${
                        diagnosticData.currentSection === section.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : isAccessible
                          ? 'hover:bg-slate-50 text-slate-700'
                          : 'text-slate-400 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${
                        diagnosticData.completedSections.includes(section.id)
                          ? 'text-green-600'
                          : diagnosticData.currentSection === section.id
                          ? 'text-blue-600'
                          : 'text-slate-400'
                      }`}>
                        {diagnosticData.completedSections.includes(section.id) ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          section.icon
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{section.title}</div>
                        <div className="text-xs text-slate-500 truncate">{section.description}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={generateReport}
                  disabled={diagnosticData.completedSections.length < 6}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Générer le rapport
                </button>
                
                <button
                  onClick={resetDiagnostic}
                  className="w-full mt-2 text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Recommencer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              {showResults ? (
                renderResults()
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {currentSectionData?.title}
                    </h2>
                    <p className="text-slate-600">{currentSectionData?.description}</p>
                  </div>

                  {diagnosticData.currentSection === 'organizationInfo' ? (
                    renderOrganizationInfo()
                  ) : (
                    renderSection(diagnosticData.currentSection)
                  )}

                  {/* Validation Message */}
                  {!isSectionComplete(diagnosticData.currentSection) && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-amber-800 mb-1">
                            Questions obligatoires non répondues
                          </h4>
                          <p className="text-sm text-amber-700 mb-2">
                            Vous devez répondre à toutes les questions avant de passer à la section suivante.
                          </p>
                          <div className="text-xs text-amber-600">
                            <strong>Questions manquantes :</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {getMissingQuestions(diagnosticData.currentSection).map((question, index) => (
                                <li key={index}>{question}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                    <button
                      onClick={() => {
                        const currentIndex = sections.findIndex(s => s.id === diagnosticData.currentSection);
                        if (currentIndex > 0) {
                          goToSection(sections[currentIndex - 1].id);
                        }
                      }}
                      disabled={sections.findIndex(s => s.id === diagnosticData.currentSection) === 0}
                      className="px-6 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>

                    <button
                      onClick={() => {
                        const currentIndex = sections.findIndex(s => s.id === diagnosticData.currentSection);
                        if (currentIndex < sections.length - 1) {
                          // Vérifier si la section est complète avant de continuer
                          if (isSectionComplete(diagnosticData.currentSection)) {
                            // Marquer la section comme complétée
                            if (!diagnosticData.completedSections.includes(diagnosticData.currentSection)) {
                              markSectionComplete(diagnosticData.currentSection);
                            }
                            goToSection(sections[currentIndex + 1].id);
                          }
                        }
                      }}
                      disabled={
                        sections.findIndex(s => s.id === diagnosticData.currentSection) === sections.length - 1 ||
                        !isSectionComplete(diagnosticData.currentSection)
                      }
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
