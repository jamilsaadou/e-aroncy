'use client';

import { useState } from 'react';
import { 
  Settings, 
  Upload, 
  Image as ImageIcon, 
  Globe, 
  Palette, 
  Mail, 
  Phone, 
  MapPin, 
  Save,
  RefreshCw,
  Eye,
  Trash2,
  Plus,
  Edit3
} from 'lucide-react';

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [logoPreview, setLogoPreview] = useState('/assets/logos/Logo e-aroncy.png');
  const [faviconPreview, setFaviconPreview] = useState('/favicon.ico');
  const [sliderImages, setSliderImages] = useState([
    { id: 1, src: '/assets/images/slider1.jpg', title: 'Cybersécurité en Afrique', description: 'Protégez votre entreprise contre les cybermenaces' },
    { id: 2, src: '/assets/images/slider2.jpg', title: 'Formation Professionnelle', description: 'Développez vos compétences en sécurité informatique' },
    { id: 3, src: '/assets/images/im.jpg', title: 'Diagnostic Sécurisé', description: 'Évaluez la sécurité de votre infrastructure' }
  ]);

  const [settings, setSettings] = useState({
    siteName: 'e-Aroncy',
    siteDescription: 'Plateforme de cybersécurité pour l\'Afrique',
    contactEmail: 'contact@e-aroncy.com',
    contactPhone: '+227 XX XX XX XX',
    address: 'Niamey, Niger',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    analyticsEnabled: true,
    cookieConsent: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (type: 'logo' | 'favicon', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'logo') {
          setLogoPreview(e.target?.result as string);
        } else {
          setFaviconPreview(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addSliderImage = () => {
    const newId = Math.max(...sliderImages.map(img => img.id)) + 1;
    setSliderImages([...sliderImages, {
      id: newId,
      src: '/assets/images/placeholder.jpg',
      title: 'Nouveau slide',
      description: 'Description du nouveau slide'
    }]);
  };

  const removeSliderImage = (id: number) => {
    setSliderImages(sliderImages.filter(img => img.id !== id));
  };

  const updateSliderImage = (id: number, field: string, value: string) => {
    setSliderImages(sliderImages.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    ));
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'apparence', label: 'Apparence', icon: Palette },
    { id: 'slider', label: 'Slider', icon: ImageIcon },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'avance', label: 'Avancé', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres de la Plateforme</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gérez les paramètres généraux, l'apparence et les fonctionnalités de votre plateforme
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réinitialiser
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation des onglets */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="flex-1">
            <div className="bg-white shadow rounded-lg">
              {/* Onglet Général */}
              {activeTab === 'general' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Paramètres Généraux</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom du site
                        </label>
                        <input
                          type="text"
                          value={settings.siteName}
                          onChange={(e) => handleSettingChange('siteName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email de contact
                        </label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description du site
                      </label>
                      <textarea
                        value={settings.siteDescription}
                        onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Mode maintenance</h4>
                          <p className="text-sm text-gray-500">Désactiver temporairement le site</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.maintenanceMode}
                            onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Inscriptions ouvertes</h4>
                          <p className="text-sm text-gray-500">Permettre les nouvelles inscriptions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.registrationEnabled}
                            onChange={(e) => handleSettingChange('registrationEnabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Apparence */}
              {activeTab === 'apparence' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Apparence et Branding</h3>
                  
                  <div className="space-y-8">
                    {/* Logo */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Logo de l'application</h4>
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0">
                          <img
                            src={logoPreview}
                            alt="Logo actuel"
                            className="h-16 w-auto object-contain bg-gray-100 p-2 rounded-lg border"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block">
                            <span className="sr-only">Choisir un nouveau logo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload('logo', e)}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                          </label>
                          <p className="mt-1 text-sm text-gray-500">PNG, JPG jusqu'à 2MB. Recommandé: 200x60px</p>
                        </div>
                      </div>
                    </div>

                    {/* Favicon */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Favicon</h4>
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0">
                          <img
                            src={faviconPreview}
                            alt="Favicon actuel"
                            className="h-8 w-8 object-contain bg-gray-100 p-1 rounded border"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block">
                            <span className="sr-only">Choisir un nouveau favicon</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload('favicon', e)}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                          </label>
                          <p className="mt-1 text-sm text-gray-500">ICO, PNG 32x32px ou 16x16px</p>
                        </div>
                      </div>
                    </div>

                    {/* Couleurs */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Palette de couleurs</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Couleur primaire
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={settings.primaryColor}
                              onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                              className="h-10 w-16 rounded border border-gray-300"
                            />
                            <input
                              type="text"
                              value={settings.primaryColor}
                              onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Couleur secondaire
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={settings.secondaryColor}
                              onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                              className="h-10 w-16 rounded border border-gray-300"
                            />
                            <input
                              type="text"
                              value={settings.secondaryColor}
                              onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Couleur d'accent
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={settings.accentColor}
                              onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                              className="h-10 w-16 rounded border border-gray-300"
                            />
                            <input
                              type="text"
                              value={settings.accentColor}
                              onChange={(e) => handleSettingChange('accentColor', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Slider */}
              {activeTab === 'slider' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Slider de la page d'accueil</h3>
                    <button
                      onClick={addSliderImage}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un slide
                    </button>
                  </div>

                  <div className="space-y-6">
                    {sliderImages.map((image, index) => (
                      <div key={image.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-md font-medium text-gray-900">Slide {index + 1}</h4>
                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => removeSliderImage(image.id)}
                              className="p-2 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="lg:col-span-1">
                            <img
                              src={image.src}
                              alt={image.title}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <label className="block mt-2">
                              <span className="sr-only">Changer l'image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            </label>
                          </div>

                          <div className="lg:col-span-2 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Titre
                              </label>
                              <input
                                type="text"
                                value={image.title}
                                onChange={(e) => updateSliderImage(image.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={image.description}
                                onChange={(e) => updateSliderImage(image.id, 'description', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Onglet Contact */}
              {activeTab === 'contact' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Informations de Contact</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email de contact
                        </label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={settings.contactPhone}
                          onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Adresse
                      </label>
                      <textarea
                        value={settings.address}
                        onChange={(e) => handleSettingChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Avancé */}
              {activeTab === 'avance' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Paramètres Avancés</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Notifications email</h4>
                          <p className="text-sm text-gray-500">Envoyer des notifications par email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Notifications SMS</h4>
                          <p className="text-sm text-gray-500">Envoyer des notifications par SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.smsNotifications}
                            onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Analytics</h4>
                          <p className="text-sm text-gray-500">Activer le suivi des statistiques</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.analyticsEnabled}
                            onChange={(e) => handleSettingChange('analyticsEnabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Consentement cookies</h4>
                          <p className="text-sm text-gray-500">Afficher la bannière de cookies</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.cookieConsent}
                            onChange={(e) => handleSettingChange('cookieConsent', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
