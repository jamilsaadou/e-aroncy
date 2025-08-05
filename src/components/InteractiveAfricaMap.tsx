'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CountryData {
  [key: string]: {
    name: string;
    status: 'excellent' | 'good' | 'basic' | 'minimal';
    laws: string[];
    lastUpdate: string;
    description: string;
  };
}

const countryData: CountryData = {
  'Afrique du Sud': {
    name: 'Afrique du Sud',
    status: 'excellent',
    laws: ['Cybercrimes Act (2020)', 'Protection of Personal Information Act (2013)', 'Electronic Communications Act'],
    lastUpdate: 'Décembre 2024',
    description: 'Cadre juridique le plus avancé du continent avec des institutions spécialisées et une approche holistique.'
  },
  'Kenya': {
    name: 'Kenya',
    status: 'excellent',
    laws: ['Computer Misuse and Cybercrimes Act (2018)', 'Data Protection Act (2019)', 'Kenya Information and Communications Act'],
    lastUpdate: 'Décembre 2024',
    description: 'Cadre juridique très avancé avec des institutions spécialisées et une approche proactive de la cybersécurité.'
  },
  'Rwanda': {
    name: 'Rwanda',
    status: 'excellent',
    laws: ['Law on Prevention and Punishment of Cyber Crimes (2018)', 'Data Protection and Privacy Law (2021)', 'Electronic Transactions Law'],
    lastUpdate: 'Octobre 2024',
    description: 'Cadre juridique moderne et complet avec des institutions efficaces et une vision numérique avancée.'
  },
  'Maurice': {
    name: 'Maurice',
    status: 'excellent',
    laws: ['Computer Misuse and Cybercrime Act (2003, amended 2021)', 'Data Protection Act (2017)', 'Electronic Transactions Act'],
    lastUpdate: 'Août 2023',
    description: 'Cadre juridique très avancé avec des institutions efficaces et une approche proactive.'
  },
  'Côte d\'Ivoire': {
    name: 'Côte d\'Ivoire',
    status: 'excellent',
    laws: ['Loi sur la cybercriminalité (2013)', 'Loi sur la protection des données (2019)', 'Code pénal numérique'],
    lastUpdate: 'Décembre 2024',
    description: 'Cadre juridique complet avec des lois spécifiques sur la cybercriminalité et la protection des données personnelles.'
  },
  'Burkina Faso': {
    name: 'Burkina Faso',
    status: 'excellent',
    laws: ['Loi sur la cybersécurité (2018)', 'Loi sur les transactions électroniques', 'Stratégie nationale de cybersécurité'],
    lastUpdate: 'Novembre 2024',
    description: 'Stratégie nationale robuste avec des institutions dédiées à la cybersécurité.'
  },
  'Sénégal': {
    name: 'Sénégal',
    status: 'excellent',
    laws: ['Loi sur la cybercriminalité (2008)', 'Loi sur la protection des données (2008)', 'CERT national'],
    lastUpdate: 'Octobre 2024',
    description: 'Pionnier en Afrique de l\'Ouest avec un CERT opérationnel et des lois avancées.'
  },
  'Nigeria': {
    name: 'Nigeria',
    status: 'good',
    laws: ['Cybercrimes Act (2015)', 'Nigeria Data Protection Regulation (2019)', 'National Cybersecurity Policy'],
    lastUpdate: 'Décembre 2024',
    description: 'Cadre juridique robuste avec des lois modernes et une autorité nationale de cybersécurité active.'
  },
  'Ghana': {
    name: 'Ghana',
    status: 'good',
    laws: ['Cybersecurity Act (2020)', 'Data Protection Act (2012)', 'Electronic Transactions Act'],
    lastUpdate: 'Août 2024',
    description: 'Lois modernes sur la cybersécurité avec une autorité nationale dédiée.'
  },
  'Tanzanie': {
    name: 'Tanzanie',
    status: 'good',
    laws: ['Cybercrimes Act (2015)', 'Electronic and Postal Communications Act', 'Data Protection Act (2022)'],
    lastUpdate: 'Juillet 2023',
    description: 'Législation établie avec des mises à jour récentes et des institutions actives.'
  },
  'Botswana': {
    name: 'Botswana',
    status: 'good',
    laws: ['Cybercrime and Computer Related Crimes Act (2018)', 'Data Protection Act (2018)', 'Electronic Communications Act'],
    lastUpdate: 'Janvier 2024',
    description: 'Législation moderne avec des institutions fonctionnelles et une approche proactive.'
  },
  'Ouganda': {
    name: 'Ouganda',
    status: 'good',
    laws: ['Computer Misuse Act (2011)', 'Data Protection and Privacy Act (2019)', 'Electronic Signatures Act'],
    lastUpdate: 'Novembre 2024',
    description: 'Législation établie avec des mises à jour récentes et des institutions fonctionnelles.'
  },
  'Égypte': {
    name: 'Égypte',
    status: 'good',
    laws: ['Anti-Cyber and Information Technology Crimes Law (2018)', 'Data Protection Law (2020)', 'Electronic Signature Law'],
    lastUpdate: 'Février 2024',
    description: 'Législation moderne avec des institutions spécialisées et une approche proactive.'
  },
  'Maroc': {
    name: 'Maroc',
    status: 'good',
    laws: ['Loi sur la cybercriminalité (2007, amendée 2020)', 'Loi sur la protection des données (2009)', 'Loi sur la confiance numérique'],
    lastUpdate: 'Octobre 2023',
    description: 'Législation moderne avec des institutions spécialisées et une stratégie numérique avancée.'
  },
  'Tunisie': {
    name: 'Tunisie',
    status: 'good',
    laws: ['Loi sur la cybercriminalité (2004, amendée 2022)', 'Loi sur la protection des données (2004)', 'Code des télécommunications'],
    lastUpdate: 'Décembre 2023',
    description: 'Législation établie avec des mises à jour récentes et des institutions fonctionnelles.'
  },
  'Niger': {
    name: 'Niger',
    status: 'good',
    laws: ['Loi sur la cybercriminalité (2019)', 'Ordonnance sur les communications électroniques'],
    lastUpdate: 'Septembre 2024',
    description: 'Cadre juridique en développement avec des lois récentes sur la cybercriminalité.'
  },
  'Bénin': {
    name: 'Bénin',
    status: 'good',
    laws: ['Code du numérique (2017)', 'Loi sur les transactions électroniques'],
    lastUpdate: 'Juillet 2024',
    description: 'Code du numérique unifié couvrant plusieurs aspects de la cybersécurité.'
  },
  'Cap-Vert': {
    name: 'Cap-Vert',
    status: 'good',
    laws: ['Loi sur la cybercriminalité (2016)', 'Loi sur la protection des données'],
    lastUpdate: 'Juin 2024',
    description: 'Cadre juridique adapté aux spécificités insulaires avec focus sur le e-gouvernement.'
  },
  'Seychelles': {
    name: 'Seychelles',
    status: 'good',
    laws: ['Computer Misuse Act (2021)', 'Data Protection Act (2003, amended 2020)', 'Electronic Transactions Act'],
    lastUpdate: 'Juillet 2023',
    description: 'Législation moderne adaptée aux spécificités insulaires avec des institutions fonctionnelles.'
  },
  'Angola': {
    name: 'Angola',
    status: 'basic',
    laws: ['Lei da Cibersegurança (2020)', 'Código Penal (disposições cyber)', 'Lei das Telecomunicações'],
    lastUpdate: 'Avril 2024',
    description: 'Cadre juridique en développement avec des lois récentes sur la cybersécurité.'
  },
  'Zambie': {
    name: 'Zambie',
    status: 'basic',
    laws: ['Cyber Security and Cyber Crimes Act (2021)', 'Data Protection Act (2021)', 'Electronic Communications Act'],
    lastUpdate: 'Mars 2024',
    description: 'Lois modernes récemment adoptées avec des institutions en cours de mise en place.'
  },
  'Zimbabwe': {
    name: 'Zimbabwe',
    status: 'basic',
    laws: ['Cyber Security and Data Protection Act (2021)', 'Criminal Law Act (cyber provisions)', 'Postal and Telecommunications Act'],
    lastUpdate: 'Février 2024',
    description: 'Cadre juridique récemment modernisé avec des défis de mise en œuvre.'
  },
  'Namibie': {
    name: 'Namibie',
    status: 'basic',
    laws: ['Electronic Transactions Act (2019)', 'Criminal Procedure Act (cyber amendments)', 'Communications Act'],
    lastUpdate: 'Décembre 2023',
    description: 'Cadre juridique de base avec des efforts de modernisation en cours.'
  },
  'Mozambique': {
    name: 'Mozambique',
    status: 'basic',
    laws: ['Lei de Crimes Informáticos (2017)', 'Lei de Protecção de Dados (2022)', 'Lei das Telecomunicações'],
    lastUpdate: 'Septembre 2023',
    description: 'Législation de base avec des efforts récents de modernisation.'
  },
  'Malawi': {
    name: 'Malawi',
    status: 'basic',
    laws: ['Electronic Transactions and Cybersecurity Act (2016)', 'Data Protection Act (2020)', 'Communications Act'],
    lastUpdate: 'Août 2023',
    description: 'Cadre juridique de base avec des institutions en développement.'
  },
  'Madagascar': {
    name: 'Madagascar',
    status: 'basic',
    laws: ['Loi sur la cybercriminalité (2014)', 'Loi sur les données personnelles (2021)', 'Code des télécommunications'],
    lastUpdate: 'Septembre 2023',
    description: 'Législation de base avec des efforts récents de modernisation.'
  },
  'Éthiopie': {
    name: 'Éthiopie',
    status: 'basic',
    laws: ['Computer Crime Proclamation (2016)', 'Telecom Fraud Offences Proclamation', 'Data Protection Proclamation (2021)'],
    lastUpdate: 'Août 2024',
    description: 'Cadre juridique de base avec des efforts récents de modernisation.'
  },
  'Djibouti': {
    name: 'Djibouti',
    status: 'basic',
    laws: ['Loi sur la cybercriminalité (2018)', 'Code pénal (dispositions cyber)', 'Loi sur les télécommunications'],
    lastUpdate: 'Juin 2024',
    description: 'Législation de base avec des efforts de modernisation en cours.'
  },
  'Congo': {
    name: 'Congo',
    status: 'basic',
    laws: ['Loi sur la cybercriminalité (2019)', 'Code pénal numérique', 'Loi sur les données'],
    lastUpdate: 'Mai 2024',
    description: 'Législation de base avec des efforts récents de modernisation.'
  },
  'Cameroun': {
    name: 'Cameroun',
    status: 'basic',
    laws: ['Loi sur la cybersécurité (2010)', 'Code pénal (dispositions cyber)', 'Loi sur les communications électroniques'],
    lastUpdate: 'Novembre 2024',
    description: 'Législation de base avec des efforts de modernisation en cours.'
  },
  'Algérie': {
    name: 'Algérie',
    status: 'basic',
    laws: ['Loi sur la cybercriminalité (2009, amendée 2020)', 'Loi sur la protection des données (2018)', 'Code des postes et télécommunications'],
    lastUpdate: 'Novembre 2023',
    description: 'Cadre juridique de base avec des efforts de modernisation en cours.'
  },
  'Gabon': {
    name: 'Gabon',
    status: 'basic',
    laws: ['Loi sur la cybercriminalité (2016)', 'Code pénal numérique', 'Loi sur les données personnelles'],
    lastUpdate: 'Août 2024',
    description: 'Cadre juridique en développement avec des lois récentes sur la cybercriminalité.'
  },
  'Togo': {
    name: 'Togo',
    status: 'basic',
    laws: ['Loi sur la cybersécurité (2018)', 'Code pénal (dispositions cyber)'],
    lastUpdate: 'Mai 2024',
    description: 'Législation de base en cours de renforcement avec des projets de modernisation.'
  },
  'Guinée': {
    name: 'Guinée',
    status: 'basic',
    laws: ['Code pénal (articles cyber)', 'Projet de loi sur la cybersécurité'],
    lastUpdate: 'Avril 2024',
    description: 'Cadre juridique en développement avec des projets de lois en cours d\'adoption.'
  },
  'Libéria': {
    name: 'Libéria',
    status: 'basic',
    laws: ['Cybercrime Act (2016)', 'Telecommunications Act'],
    lastUpdate: 'Mars 2024',
    description: 'Lois de base sur la cybercriminalité avec besoin de renforcement institutionnel.'
  },
  'Gambie': {
    name: 'Gambie',
    status: 'basic',
    laws: ['Information and Communications Act', 'Computer Misuse Act (projet)'],
    lastUpdate: 'Février 2024',
    description: 'Cadre juridique minimal avec des projets de modernisation en cours.'
  },
  'Mali': {
    name: 'Mali',
    status: 'minimal',
    laws: ['Code pénal (quelques articles)', 'Loi sur les télécommunications'],
    lastUpdate: 'Janvier 2024',
    description: 'Cadre juridique limité nécessitant des réformes importantes pour la cybersécurité.'
  },
  'Mauritanie': {
    name: 'Mauritanie',
    status: 'minimal',
    laws: ['Code pénal (dispositions générales)', 'Loi sur les télécommunications'],
    lastUpdate: 'Décembre 2023',
    description: 'Législation minimale avec des besoins importants en matière de cybersécurité.'
  },
  'Sierra Leone': {
    name: 'Sierra Leone',
    status: 'minimal',
    laws: ['Criminal Procedure Act (amendements)', 'Telecommunications Act'],
    lastUpdate: 'Novembre 2023',
    description: 'Cadre juridique de base nécessitant des développements spécifiques à la cybersécurité.'
  },
  'Guinée-Bissau': {
    name: 'Guinée-Bissau',
    status: 'minimal',
    laws: ['Code pénal (dispositions générales)', 'Loi sur les télécommunications'],
    lastUpdate: 'Octobre 2023',
    description: 'Législation très limitée avec des besoins urgents de modernisation juridique.'
  },
  'Tchad': {
    name: 'Tchad',
    status: 'minimal',
    laws: ['Code pénal (quelques dispositions)', 'Loi sur les télécommunications'],
    lastUpdate: 'Octobre 2024',
    description: 'Cadre juridique très limité nécessitant des développements importants.'
  },
  'République centrafricaine': {
    name: 'République centrafricaine',
    status: 'minimal',
    laws: ['Code pénal (dispositions générales)', 'Loi sur les télécommunications'],
    lastUpdate: 'Septembre 2024',
    description: 'Législation minimale avec des défis institutionnels importants.'
  },
  'Guinée équatoriale': {
    name: 'Guinée équatoriale',
    status: 'minimal',
    laws: ['Code pénal (dispositions générales)', 'Loi sur les télécommunications'],
    lastUpdate: 'Juillet 2024',
    description: 'Législation très limitée avec des besoins urgents de modernisation.'
  },
  'République démocratique du Congo': {
    name: 'République démocratique du Congo',
    status: 'minimal',
    laws: ['Code pénal (quelques articles)', 'Loi sur les télécommunications', 'Projet de loi cybersécurité'],
    lastUpdate: 'Juin 2024',
    description: 'Cadre juridique limité avec des projets de modernisation en cours.'
  },
  'Lesotho': {
    name: 'Lesotho',
    status: 'minimal',
    laws: ['Computer Crime and Cybercrime Act (2021)', 'Communications Act', 'Criminal Procedure Act'],
    lastUpdate: 'Novembre 2023',
    description: 'Législation récente mais limitée avec des défis de mise en œuvre.'
  },
  'Eswatini': {
    name: 'Eswatini',
    status: 'minimal',
    laws: ['Computer Crime and Cybercrime Act (2020)', 'Data Protection Act (2022)', 'Communications Act'],
    lastUpdate: 'Octobre 2023',
    description: 'Cadre juridique récent mais avec des capacités institutionnelles limitées.'
  },
  'Burundi': {
    name: 'Burundi',
    status: 'minimal',
    laws: ['Code pénal (quelques dispositions)', 'Loi sur les télécommunications', 'Projet de loi cybersécurité'],
    lastUpdate: 'Septembre 2024',
    description: 'Législation très limitée avec des projets de modernisation en cours.'
  },
  'Érythrée': {
    name: 'Érythrée',
    status: 'minimal',
    laws: ['Telecommunications Proclamation', 'Penal Code (limited provisions)'],
    lastUpdate: 'Juillet 2024',
    description: 'Législation très limitée avec des défis institutionnels importants.'
  },
  'Somalie': {
    name: 'Somalie',
    status: 'minimal',
    laws: ['Telecommunications Law', 'Penal Code (limited provisions)', 'Draft Cybersecurity Law'],
    lastUpdate: 'Mai 2024',
    description: 'Cadre juridique très limité avec des défis institutionnels majeurs.'
  },
  'Soudan': {
    name: 'Soudan',
    status: 'minimal',
    laws: ['Telecommunications Act', 'Criminal Act (limited cyber provisions)', 'Draft Cybersecurity Law'],
    lastUpdate: 'Avril 2024',
    description: 'Législation limitée avec des projets de modernisation en cours de développement.'
  },
  'Soudan du Sud': {
    name: 'Soudan du Sud',
    status: 'minimal',
    laws: ['Telecommunications Act', 'Penal Code (basic provisions)', 'Draft ICT Policy'],
    lastUpdate: 'Mars 2024',
    description: 'Cadre juridique très limité avec des besoins urgents de développement.'
  },
  'Libye': {
    name: 'Libye',
    status: 'minimal',
    laws: ['Telecommunications Law', 'Penal Code (limited provisions)', 'Draft Cybersecurity Framework'],
    lastUpdate: 'Janvier 2024',
    description: 'Cadre juridique très limité avec des défis institutionnels majeurs.'
  },
  'Comores': {
    name: 'Comores',
    status: 'minimal',
    laws: ['Code pénal (dispositions limitées)', 'Loi sur les télécommunications', 'Projet de loi cybersécurité'],
    lastUpdate: 'Juin 2023',
    description: 'Cadre juridique très limité avec des projets de modernisation en cours.'
  }
};

export default function InteractiveAfricaMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleCountryClick = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  const handleCountryHover = (countryName: string) => {
    setHoveredCountry(countryName);
  };

  const handleCountryLeave = () => {
    setHoveredCountry(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-blue-600';
      case 'good': return 'text-green-600';
      case 'basic': return 'text-yellow-600';
      case 'minimal': return 'text-slate-600';
      default: return 'text-slate-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'basic': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'minimal': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return '🟢';
      case 'good': return '🟡';
      case 'basic': return '🟠';
      case 'minimal': return '🔴';
      default: return '⚪';
    }
  };

  const displayCountry = selectedCountry || hoveredCountry;
  const countryInfo = displayCountry ? countryData[displayCountry] : null;

  // Grouper les pays par statut
  const countriesByStatus = {
    excellent: Object.values(countryData).filter(country => country.status === 'excellent'),
    good: Object.values(countryData).filter(country => country.status === 'good'),
    basic: Object.values(countryData).filter(country => country.status === 'basic'),
    minimal: Object.values(countryData).filter(country => country.status === 'minimal')
  };

  return (
    <div className="grid lg:grid-cols-3 gap-12 items-start">
      {/* Map and Countries List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Map */}
            <div className="relative">
              <Image
                src="/assets/images/afrique.png"
                alt="Carte de l'Afrique"
                width={600}
                height={450}
                className="w-full h-auto object-contain rounded-lg"
                style={{ filter: 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))' }}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Réglementation Cybersécurité
                </h3>
                <p className="text-xs text-slate-600">
                  Cliquez sur un pays dans la liste
                </p>
              </div>
            </div>

            {/* Countries List */}
            <div className="max-h-96 overflow-y-auto">
              <h3 className="font-semibold text-slate-900 mb-4">Pays africains ({Object.keys(countryData).length})</h3>
          
          {/* Excellent */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              Excellent ({countriesByStatus.excellent.length})
            </h4>
            <div className="space-y-1">
              {countriesByStatus.excellent.map((country) => (
                <button
                  key={country.name}
                  onClick={() => handleCountryClick(country.name)}
                  onMouseEnter={() => handleCountryHover(country.name)}
                  onMouseLeave={handleCountryLeave}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedCountry === country.name
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : hoveredCountry === country.name
                      ? 'bg-blue-50 text-blue-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>

          {/* Good */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              Bon ({countriesByStatus.good.length})
            </h4>
            <div className="space-y-1">
              {countriesByStatus.good.map((country) => (
                <button
                  key={country.name}
                  onClick={() => handleCountryClick(country.name)}
                  onMouseEnter={() => handleCountryHover(country.name)}
                  onMouseLeave={handleCountryLeave}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedCountry === country.name
                      ? 'bg-green-100 text-green-900 border border-green-200'
                      : hoveredCountry === country.name
                      ? 'bg-green-50 text-green-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>

          {/* Basic */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              Basique ({countriesByStatus.basic.length})
            </h4>
            <div className="space-y-1">
              {countriesByStatus.basic.map((country) => (
                <button
                  key={country.name}
                  onClick={() => handleCountryClick(country.name)}
                  onMouseEnter={() => handleCountryHover(country.name)}
                  onMouseLeave={handleCountryLeave}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedCountry === country.name
                      ? 'bg-yellow-100 text-yellow-900 border border-yellow-200'
                      : hoveredCountry === country.name
                      ? 'bg-yellow-50 text-yellow-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>

          {/* Minimal */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-800 mb-2 flex items-center">
              <div className="w-3 h-3 bg-slate-400 rounded mr-2"></div>
              Minimal ({countriesByStatus.minimal.length})
            </h4>
            <div className="space-y-1">
              {countriesByStatus.minimal.map((country) => (
                <button
                  key={country.name}
                  onClick={() => handleCountryClick(country.name)}
                  onMouseEnter={() => handleCountryHover(country.name)}
                  onMouseLeave={handleCountryLeave}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedCountry === country.name
                      ? 'bg-slate-100 text-slate-900 border border-slate-200'
                      : hoveredCountry === country.name
                      ? 'bg-slate-50 text-slate-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="lg:col-span-1 space-y-6">
        {/* Legend */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Niveau de réglementation</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-slate-700">Excellent - Lois complètes</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-slate-700">Bon - Cadre établi</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-slate-700">Basique - En développement</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-slate-400 rounded"></div>
              <span className="text-sm text-slate-700">Minimal - Cadre limité</span>
            </div>
          </div>
        </div>

        {/* Country Info Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            {countryInfo ? countryInfo.name : 'Informations pays'}
          </h3>
          <div className="text-slate-600">
            {countryInfo ? (
              <div className="space-y-4">
                <div>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(countryInfo.status)}`}>
                    {countryInfo.status === 'excellent' && 'Excellent'}
                    {countryInfo.status === 'good' && 'Bon'}
                    {countryInfo.status === 'basic' && 'Basique'}
                    {countryInfo.status === 'minimal' && 'Minimal'}
                  </span>
                </div>
                
                <p className="text-sm">{countryInfo.description}</p>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Principales lois :</h4>
                  <ul className="text-sm space-y-1">
                    {countryInfo.laws.map((law, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {law}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="text-xs text-slate-500 pt-2 border-t">
                  Dernière mise à jour : {countryInfo.lastUpdate}
                </div>
              </div>
            ) : (
              <p className="text-sm">Cliquez sur un pays dans la liste pour voir les détails de sa réglementation en cybersécurité.</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-4">Statistiques continentales</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-100">Pays couverts</span>
              <span className="font-semibold">{Object.keys(countryData).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">Cadre excellent</span>
              <span className="font-semibold">{countriesByStatus.excellent.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">Cadre bon</span>
              <span className="font-semibold">{countriesByStatus.good.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">Mises à jour</span>
              <span className="font-semibold">Mensuelle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
