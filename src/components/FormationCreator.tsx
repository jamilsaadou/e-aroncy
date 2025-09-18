import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Save, Eye, X, Clock, Users, Tag, 
  Upload, Video, FileText, HelpCircle, Trash2, 
  ChevronDown, ChevronUp, Settings, Check, AlertCircle,
  Loader2, Camera, File
} from 'lucide-react';

// Types
interface Formation {
  id?: string;
  title: string;
  description: string;
  shortDescription: string;
  category: 'cybersecurite' | 'sensibilisation' | 'technique' | 'management';
  level: 'debutant' | 'intermediaire' | 'avance';
  instructor: string;
  duration: string;
  price?: number;
  maxEnrollments?: number;
  language: string;
  tags: string[];
  prerequisites: string[];
  objectives: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  certificateEnabled: boolean;
  allowDiscussions: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: number; // en minutes
  type: 'video' | 'text' | 'quiz' | 'exercise';
  content: string;
  order: number;
  quiz?: Quiz;
}

interface Quiz {
  passingScore: number;
  timeLimit?: number;
  allowRetries: boolean;
  showCorrectAnswers: boolean;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  options: string[];
  correctAnswer: number | string;
  explanation?: string;
  points: number;
}

// API Service
class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  private token = localStorage.getItem('token');

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Une erreur est survenue');
    }

    return response.json();
  }

  async createFormation(formationData: Formation, featuredImage?: File) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(formationData));
    if (featuredImage) {
      formData.append('featuredImage', featuredImage);
    }

    return fetch(`${this.baseUrl}/formations`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    }).then(res => res.json());
  }

  async addModule(formationId: string, moduleData: Omit<Module, 'id'>) {
    return this.request(`/formations/${formationId}/modules`, {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });
  }

  async addQuiz(moduleId: string, quizData: Quiz) {
    return this.request(`/modules/${moduleId}/quiz`, {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  }

  async uploadFile(file: File, type: 'image' | 'video' | 'document') {
    const formData = new FormData();
    formData.append('file', file);

    return fetch(`${this.baseUrl}/upload/${type}`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    }).then(res => res.json());
  }
}

const api = new ApiService();

export default function FormationCreator() {
  // État principal
  const [formation, setFormation] = useState<Formation>({
    title: '',
    description: '',
    shortDescription: '',
    category: 'cybersecurite',
    level: 'debutant',
    instructor: '',
    duration: '',
    price: 0,
    language: 'fr',
    tags: [],
    prerequisites: [],
    objectives: [],
    status: 'draft',
    featured: false,
    certificateEnabled: true,
    allowDiscussions: true,
  });

  const [modules, setModules] = useState<Module[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // États pour les formulaires
  const [newTag, setNewTag] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [expandedModule, setExpandedModule] = useState<string>('');

  // Constantes
  const categories = [
    { value: 'cybersecurite', label: 'Cybersécurité' },
    { value: 'sensibilisation', label: 'Sensibilisation' },
    { value: 'technique', label: 'Technique' },
    { value: 'management', label: 'Management' }
  ];

  const levels = [
    { value: 'debutant', label: 'Débutant' },
    { value: 'intermediaire', label: 'Intermédiaire' },
    { value: 'avance', label: 'Avancé' }
  ];

  // Handlers
  const handleFormationChange = (field: keyof Formation, value: any) => {
    setFormation(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addModule = () => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: '',
      description: '',
      duration: 30,
      type: 'text',
      content: '',
      order: modules.length
    };
    setModules(prev => [...prev, newModule]);
    setExpandedModule(newModule.id);
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, ...updates } : m));
  };

  const removeModule = (moduleId: string) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
    setExpandedModule('');
  };

  const addQuizToModule = (moduleId: string) => {
    const quiz: Quiz = {
      passingScore: 70,
      timeLimit: 30,
      allowRetries: true,
      showCorrectAnswers: true,
      questions: []
    };
    updateModule(moduleId, { quiz, type: 'quiz' });
  };

  const addQuestionToQuiz = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module?.quiz) {
      const newQuestion: QuizQuestion = {
        id: `question-${Date.now()}`,
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 1
      };
      
      const updatedQuiz = {
        ...module.quiz,
        questions: [...module.quiz.questions, newQuestion]
      };
      
      updateModule(moduleId, { quiz: updatedQuiz });
    }
  };

  const updateQuestion = (moduleId: string, questionId: string, updates: Partial<QuizQuestion>) => {
    const module = modules.find(m => m.id === moduleId);
    if (module?.quiz) {
      const updatedQuestions = module.quiz.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      );
      updateModule(moduleId, { 
        quiz: { ...module.quiz, questions: updatedQuestions }
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formation.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formation.description.trim()) newErrors.description = 'La description est requise';
    if (!formation.instructor.trim()) newErrors.instructor = 'L\'instructeur est requis';
    if (!formation.duration.trim()) newErrors.duration = 'La durée est requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (publish = false) => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formationData = {
        ...formation,
        status: publish ? 'published' as const : 'draft' as const
      };

      // Créer la formation
      const response = await api.createFormation(formationData, featuredImage || undefined);
      const createdFormation = response.formation;

      // Ajouter les modules
      for (const module of modules) {
        const moduleResponse = await api.addModule(createdFormation.id, {
          title: module.title,
          description: module.description,
          duration: module.duration,
          type: module.type,
          content: module.content,
          order: module.order
        });

        // Ajouter le quiz si présent
        if (module.quiz && module.quiz.questions.length > 0) {
          await api.addQuiz(moduleResponse.module.id, module.quiz);
        }
      }

      alert(publish ? 'Formation publiée avec succès !' : 'Formation sauvegardée comme brouillon !');
      
      // Reset du formulaire
      setFormation({
        title: '',
        description: '',
        shortDescription: '',
        category: 'cybersecurite',
        level: 'debutant',
        instructor: '',
        duration: '',
        price: 0,
        language: 'fr',
        tags: [],
        prerequisites: [],
        objectives: [],
        status: 'draft',
        featured: false,
        certificateEnabled: true,
        allowDiscussions: true,
      });
      setModules([]);
      setFeaturedImage(null);
      setImagePreview('');
      setCurrentStep(1);

    } catch (error) {
      alert('Erreur lors de la sauvegarde : ' + (error as Error).message);
    }
    setIsLoading(false);
  };

  const addTag = () => {
    if (newTag.trim() && !formation.tags.includes(newTag.trim())) {
      handleFormationChange('tags', [...formation.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleFormationChange('tags', formation.tags.filter(tag => tag !== tagToRemove));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !formation.prerequisites.includes(newPrerequisite.trim())) {
      handleFormationChange('prerequisites', [...formation.prerequisites, newPrerequisite.trim()]);
      setNewPrerequisite('');
    }
  };

  const addObjective = () => {
    if (newObjective.trim() && !formation.objectives.includes(newObjective.trim())) {
      handleFormationChange('objectives', [...formation.objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const getTotalDuration = () => {
    return modules.reduce((total, module) => total + module.duration, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Créer une Formation</h1>
              <p className="text-gray-600 mt-1">Créez et structurez votre contenu pédagogique</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleSave(false)}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Sauvegarder</span>
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <BookOpen className="h-4 w-4" />
                <span>Publier</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <Check className="h-4 w-4" /> : step}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {step === 1 && 'Informations'}
                  {step === 2 && 'Modules'}
                  {step === 3 && 'Paramètres'}
                </span>
                {step < 3 && <div className="w-24 h-px bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Informations de base */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Informations principales */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations principales</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la formation *
                  </label>
                  <input
                    type="text"
                    value={formation.title}
                    onChange={(e) => handleFormationChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Introduction à la cybersécurité"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description courte *
                  </label>
                  <textarea
                    value={formation.shortDescription}
                    onChange={(e) => handleFormationChange('shortDescription', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description courte affichée dans les listes"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description détaillée *
                  </label>
                  <textarea
                    value={formation.description}
                    onChange={(e) => handleFormationChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Description complète de la formation"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select
                    value={formation.category}
                    onChange={(e) => handleFormationChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                  <select
                    value={formation.level}
                    onChange={(e) => handleFormationChange('level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {levels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructeur *
                  </label>
                  <input
                    type="text"
                    value={formation.instructor}
                    onChange={(e) => handleFormationChange('instructor', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.instructor ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nom de l'instructeur"
                  />
                  {errors.instructor && <p className="text-red-500 text-sm mt-1">{errors.instructor}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée estimée *
                  </label>
                  <input
                    type="text"
                    value={formation.duration}
                    onChange={(e) => handleFormationChange('duration', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: 8 heures"
                  />
                  {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                </div>
              </div>
            </div>

            {/* Image de couverture */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Image de couverture</h3>
              <div className="flex items-center space-x-6">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="featured-image"
                  />
                  <label
                    htmlFor="featured-image"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer"
                  >
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Cliquez pour ajouter une image</p>
                    </div>
                  </label>
                </div>
                {imagePreview && (
                  <div className="w-32 h-32 rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <span>Suivant</span>
                <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Modules */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Modules de formation</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {modules.length} modules • {Math.round(getTotalDuration() / 60)}h {getTotalDuration() % 60}min au total
                  </p>
                </div>
                <button
                  onClick={addModule}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter un module</span>
                </button>
              </div>

              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg">
                    <div className="p-4 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {module.title || `Module ${index + 1}`}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {module.duration > 0 && `${module.duration} min`} • {module.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setExpandedModule(expandedModule === module.id ? '' : module.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          {expandedModule === module.id ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </button>
                        <button
                          onClick={() => removeModule(module.id)}
                          className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {expandedModule === module.id && (
                      <div className="p-6 border-t border-gray-200 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Titre du module
                            </label>
                            <input
                              type="text"
                              value={module.title}
                              onChange={(e) => updateModule(module.id, { title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Titre du module"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Type de contenu
                            </label>
                            <select
                              value={module.type}
                              onChange={(e) => updateModule(module.id, { type: e.target.value as Module['type'] })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="text">Texte/Document</option>
                              <option value="video">Vidéo</option>
                              <option value="quiz">Quiz</option>
                              <option value="exercise">Exercice pratique</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Durée (minutes)
                            </label>
                            <input
                              type="number"
                              value={module.duration}
                              onChange={(e) => updateModule(module.id, { duration: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="1"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={module.description}
                            onChange={(e) => updateModule(module.id, { description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Description du module"
                          />
                        </div>

                        {module.type === 'quiz' ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">Configuration du Quiz</h4>
                              {!module.quiz && (
                                <button
                                  onClick={() => addQuizToModule(module.id)}
                                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                  <Plus className="h-4 w-4" />
                                  <span>Ajouter Quiz</span>
                                </button>
                              )}
                            </div>

                            {module.quiz && (
                              <div className="space-y-4 bg-green-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Score de réussite (%)
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={module.quiz.passingScore}
                                      onChange={(e) => updateModule(module.id, {
                                        quiz: { ...module.quiz!, passingScore: parseInt(e.target.value) }
                                      })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Temps limite (minutes)
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={module.quiz.timeLimit || ''}
                                      onChange={(e) => updateModule(module.id, {
                                        quiz: { ...module.quiz!, timeLimit: e.target.value ? parseInt(e.target.value) : undefined }
                                      })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                      placeholder="Optionnel"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <h5 className="font-medium text-gray-900">
                                    Questions ({module.quiz.questions.length})
                                  </h5>
                                  <button
                                    onClick={() => addQuestionToQuiz(module.id)}
                                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                  >
                                    <Plus className="h-4 w-4" />
                                    <span>Ajouter une question</span>
                                  </button>
                                </div>

                                <div className="space-y-3">
                                  {module.quiz.questions.map((question, qIndex) => (
                                    <div key={question.id} className="bg-white p-4 rounded-lg border">
                                      <div className="flex items-center justify-between mb-3">
                                        <h6 className="font-medium">Question {qIndex + 1}</h6>
                                        <button
                                          onClick={() => {
                                            const updatedQuiz = {
                                              ...module.quiz!,
                                              questions: module.quiz!.questions.filter(q => q.id !== question.id)
                                            };
                                            updateModule(module.id, { quiz: updatedQuiz });
                                          }}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>

                                      <div className="space-y-3">
                                        <input
                                          type="text"
                                          value={question.question}
                                          onChange={(e) => updateQuestion(module.id, question.id, { question: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                          placeholder="Tapez votre question..."
                                        />

                                        <select
                                          value={question.type}
                                          onChange={(e) => updateQuestion(module.id, question.id, { 
                                            type: e.target.value as QuizQuestion['type'],
                                            options: e.target.value === 'true-false' ? ['Vrai', 'Faux'] : ['', '', '', ''],
                                            correctAnswer: e.target.value === 'true-false' ? 0 : 0
                                          })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        >
                                          <option value="multiple-choice">Choix multiple</option>
                                          <option value="true-false">Vrai/Faux</option>
                                          <option value="open-ended">Question ouverte</option>
                                        </select>

                                        {question.type === 'multiple-choice' && (
                                          <div className="space-y-2">
                                            {question.options.map((option, oIndex) => (
                                              <div key={oIndex} className="flex items-center space-x-2">
                                                <input
                                                  type="radio"
                                                  name={`correct-${question.id}`}
                                                  checked={question.correctAnswer === oIndex}
                                                  onChange={() => updateQuestion(module.id, question.id, { correctAnswer: oIndex })}
                                                  className="h-4 w-4 text-blue-600"
                                                />
                                                <input
                                                  type="text"
                                                  value={option}
                                                  onChange={(e) => {
                                                    const newOptions = [...question.options];
                                                    newOptions[oIndex] = e.target.value;
                                                    updateQuestion(module.id, question.id, { options: newOptions });
                                                  }}
                                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                                  placeholder={`Option ${oIndex + 1}`}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Contenu du module
                            </label>
                            <textarea
                              value={module.content}
                              onChange={(e) => updateModule(module.id, { content: e.target.value })}
                              rows={6}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Contenu détaillé du module..."
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {modules.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun module ajouté</h3>
                    <p className="text-gray-500 mb-4">Commencez par ajouter votre premier module</p>
                    <button
                      onClick={addModule}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Ajouter un module</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
                <span>Précédent</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <span>Suivant</span>
                <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Paramètres */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags et métadonnées</h2>
              
              <div className="space-y-6">
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ajouter un tag..."
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formation.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prérequis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prérequis</label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newPrerequisite}
                      onChange={(e) => setNewPrerequisite(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ajouter un prérequis..."
                    />
                    <button
                      onClick={addPrerequisite}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {formation.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm">{prereq}</span>
                        <button
                          onClick={() => handleFormationChange('prerequisites', 
                            formation.prerequisites.filter((_, i) => i !== index)
                          )}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Objectifs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objectifs d'apprentissage</label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ajouter un objectif..."
                    />
                    <button
                      onClick={addObjective}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {formation.objectives.map((objective, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm">{objective}</span>
                        <button
                          onClick={() => handleFormationChange('objectives', 
                            formation.objectives.filter((_, i) => i !== index)
                          )}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Paramètres avancés */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres avancés</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Formation mise en avant</h3>
                    <p className="text-sm text-gray-500">Afficher cette formation en priorité</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formation.featured}
                    onChange={(e) => handleFormationChange('featured', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Certification activée</h3>
                    <p className="text-sm text-gray-500">Délivrer un certificat à la fin</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formation.certificateEnabled}
                    onChange={(e) => handleFormationChange('certificateEnabled', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Discussions autorisées</h3>
                    <p className="text-sm text-gray-500">Les participants peuvent discuter</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formation.allowDiscussions}
                    onChange={(e) => handleFormationChange('allowDiscussions', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
                <span>Précédent</span>
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleSave(false)}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Sauvegarder comme brouillon</span>
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
                  <span>Publier la formation</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
