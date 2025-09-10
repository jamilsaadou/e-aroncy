import Link from "next/link";
import { ChevronRight, Building2, User, Globe, FileText, Shield, CheckCircle, Upload, Heart } from "lucide-react";
import Header from "@/components/Header";

export default function AdhesionPage() {
  const workAreas = [
    "Protection de l'enfance / Child protection",
    "Éducation / Education", 
    "Santé communautaire / Community health",
    "Inclusion sociale / Social inclusion",
    "Droits humains / Human rights",
    "Lutte contre les VBG / GBV prevention",
    "Réponse humanitaire / Humanitarian response",
    "Résilience climatique / Climate resilience",
    "Autonomisation des jeunes / Youth empowerment",
    "Inclusion digitale / Digital inclusion"
  ];

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
            <Link href="/a-propos" className="text-slate-500 hover:text-blue-600">À propos</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 font-medium">Adhésion au réseau</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="h-4 w-4 mr-2" />
            Rejoignez le réseau
          </div>
          <h1 className="text-3xl lg:text-5xl font-display font-bold mb-6">
            Formulaire d'adhésion au Réseau ARONCY
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Pour les ONG engagées dans la résilience communautaire, la protection numérique 
            et l'innovation sociale en Afrique
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form className="space-y-12">
            
            {/* Section 1: Informations générales */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg mr-4">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">1. Informations générales</h2>
                  <p className="text-slate-600">General Information</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom de l'organisation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Organization name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pays d'intervention principal <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un pays</option>
                    <option value="benin">Bénin</option>
                    <option value="burkina-faso">Burkina Faso</option>
                    <option value="cote-ivoire">Côte d'Ivoire</option>
                    <option value="ghana">Ghana</option>
                    <option value="guinee">Guinée</option>
                    <option value="mali">Mali</option>
                    <option value="niger">Niger</option>
                    <option value="nigeria">Nigeria</option>
                    <option value="senegal">Sénégal</option>
                    <option value="togo">Togo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Autres pays d'intervention
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Other countries of operation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Année de création <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max="2025"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Year of establishment"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Adresse physique <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Physical address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.example.org"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Statut juridique <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez le statut</option>
                    <option value="association">Association</option>
                    <option value="ong">ONG</option>
                    <option value="fondation">Fondation</option>
                    <option value="cooperative">Coopérative</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Personne de contact */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-lg mr-4">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">2. Personne de contact</h2>
                  <p className="text-slate-600">Contact Person</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fonction <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Position"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email professionnel <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="professional@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Téléphone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+XXX XX XX XX XX"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Langue(s) préférée(s) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2">Français</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2">English</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2">Arabe</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Domaines d'intervention */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-lg mr-4">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">3. Domaines d'intervention</h2>
                  <p className="text-slate-600">Areas of Work</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-slate-600 mb-4">
                  Cochez les secteurs d'activité principaux / Check relevant sectors:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {workAreas.map((area, index) => (
                    <label key={index} className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-3 text-sm">{area}</span>
                    </label>
                  ))}
                  <div className="md:col-span-2">
                    <label className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-3 text-sm">Autres / Other:</span>
                      <input
                        type="text"
                        className="ml-2 flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                        placeholder="Précisez / Specify"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Lien avec la cybersécurité / Link to Cybersecurity
                </h3>
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-3">
                    Votre ONG intègre-t-elle des éléments liés à la cybersécurité ?
                  </p>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input type="radio" name="cybersecurity" value="yes" className="text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2">Oui / Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="cybersecurity" value="no" className="text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2">Non / No</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="cybersecurity" value="considering" className="text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2">En réflexion / Considering</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Si oui, précisez / If yes, briefly explain:
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Décrivez brièvement vos activités liées à la cybersécurité..."
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Projets numériques (optionnel) */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-lg mr-4">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">4. Projets numériques ou cybersécurité</h2>
                  <p className="text-slate-600">Digital or Cybersecurity Projects (optional)</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Titre du projet
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Partenaires impliqués
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Partners involved"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description (max 500 caractères)
                  </label>
                  <textarea
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Résultats clés
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Key outcomes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lien vers documentation
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Motivation */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg mr-4">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">5. Motivation pour rejoindre ARONCY</h2>
                  <p className="text-slate-600">Motivation to Join ARONCY</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pourquoi souhaitez-vous intégrer le réseau ? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Expliquez vos motivations pour rejoindre ARONCY..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Types de collaboration recherchés <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Décrivez les types de collaboration que vous recherchez..."
                  />
                </div>
              </div>
            </div>

            {/* Section 6: Documents */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-3 rounded-lg mr-4">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">6. Documents à joindre</h2>
                  <p className="text-slate-600">Documents to Attach</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Statuts <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preuve d'enregistrement <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Logo officiel <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    required
                    accept=".jpg,.png,.svg"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Présentation institutionnelle
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Section 7: Déclaration */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-lg mr-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">7. Déclaration</h2>
                  <p className="text-slate-600">Declaration</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-6">
                <p className="text-slate-700 leading-relaxed mb-4">
                  <strong>Français:</strong> En soumettant ce formulaire, l'organisation confirme son engagement 
                  à respecter les principes de collaboration, de transparence et de protection numérique 
                  promus par le réseau ARONCY.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  <strong>English:</strong> By submitting this form, the organization confirms its commitment 
                  to the principles of collaboration, transparency, and digital protection promoted by the ARONCY network.
                </p>
              </div>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">
                  <strong>Je confirme / I confirm</strong> que notre organisation s'engage à respecter 
                  ces principes et que toutes les informations fournies sont exactes.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center text-lg"
              >
                Soumettre la demande d'adhésion
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <p className="text-sm text-slate-600 mt-4">
                Votre demande sera examinée par notre équipe dans un délai de 5 à 10 jours ouvrables.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
