"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  ArrowLeft, 
  GraduationCap, 
  Image, 
  Upload, 
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Globe,
  Clock,
  BookOpen,
  Users,
  Star,
  Play,
  FileText,
  Video,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  options: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: number; // en minutes
  type: 'video' | 'text' | 'quiz' | 'exercise';
  content: string;
  resources: Resource[];
  // Liaison locale à une section (côté UI)
  sectionId?: string | null;
  quiz?: {
    questions: QuizQuestion[];
    passingScore: number;
    timeLimit?: number; // en minutes
    allowRetries: boolean;
    showCorrectAnswers: boolean;
  };
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video' | 'document';
  url: string;
}

export default function NewFormation() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    level: 'DEBUTANT', // Valeur par défaut
    instructor: '',
    duration: '', // durée totale en heures
    price: '',
    maxEnrollments: '',
    language: 'fr',
    tags: [] as string[],
    prerequisites: [] as string[],
    objectives: [] as string[],
    status: 'DRAFT',
    featured: false,
    certificateEnabled: true,
    allowDiscussions: true,
    metaTitle: '',
    metaDescription: '',
    featuredImage: null as File | null,
    promoVideo: null as File | null
  });

  const [modules, setModules] = useState<Module[]>([]);
  const [sections, setSections] = useState<{ id: string; title: string; order: number }[]>([]);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  // Filtre d'affichage dans le bloc Modules: 'all' | 'none' | sectionId
  const [modulesSectionFilter, setModulesSectionFilter] = useState<string>('all');
  const modulesBlockRef = useRef<HTMLDivElement | null>(null);

  const scrollToModules = () => {
    try {
      modulesBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      // ignore scroll errors in non-DOM environments
    }
  };

  const categories = [
    { value: 'CYBERSECURITE', label: 'Cybersécurité', description: 'Formations sur la sécurité informatique et la protection des données' },
    { value: 'SENSIBILISATION', label: 'Sensibilisation', description: 'Formations de sensibilisation aux risques numériques' },
    { value: 'TECHNIQUE', label: 'Technique', description: 'Formations techniques approfondies' },
    { value: 'MANAGEMENT', label: 'Management', description: 'Formations sur la gestion et le management de la sécurité' }
  ];

  const levels = [
    { value: 'DEBUTANT', label: 'Débutant', description: 'Aucune connaissance préalable requise' },
    { value: 'INTERMEDIAIRE', label: 'Intermédiaire', description: 'Connaissances de base requises' },
    { value: 'AVANCE', label: 'Avancé', description: 'Expertise technique requise' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (prerequisiteToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(prerequisite => prerequisite !== prerequisiteToRemove)
    }));
  };

  const addObjective = () => {
    if (newObjective.trim() && !formData.objectives.includes(newObjective.trim())) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (objectiveToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(objective => objective !== objectiveToRemove)
    }));
  };

  const addModule = (sectionId?: string) => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: '',
      description: '',
      // Valeur par défaut à 60 pour éviter les erreurs de validation côté API
      duration: 60,
      type: 'video',
      content: '',
      resources: [],
      sectionId
    };
    setModules(prev => [...prev, newModule]);
    setExpandedModule(newModule.id);
    // Focus l'affichage sur la section concernée
    setModulesSectionFilter(sectionId || (sections.length ? (modulesSectionFilter === 'none' ? 'none' : 'all') : 'all'));
    scrollToModules();
  };

  const addModuleForSection = (sectionId: string) => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: '',
      description: '',
      duration: 60,
      type: 'video',
      content: '',
      resources: [],
      sectionId
    };
    setModules(prev => [...prev, newModule]);
    setExpandedModule(newModule.id);
    setModulesSectionFilter(sectionId);
    scrollToModules();
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, ...updates } : module
    ));
  };

  const removeModule = (moduleId: string) => {
    setModules(prev => prev.filter(module => module.id !== moduleId));
    if (expandedModule === moduleId) {
      setExpandedModule(null);
    }
  };

  // Quiz functions
  const addQuizQuestion = (moduleId: string) => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1
    };

    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        const quiz = module.quiz || {
          questions: [],
          passingScore: 70,
          timeLimit: 30,
          allowRetries: true,
          showCorrectAnswers: true
        };
        return {
          ...module,
          quiz: {
            ...quiz,
            questions: [...quiz.questions, newQuestion]
          }
        };
      }
      return module;
    }));
  };

  const updateQuizQuestion = (moduleId: string, questionId: string, updates: Partial<QuizQuestion>) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId && module.quiz) {
        return {
          ...module,
          quiz: {
            ...module.quiz,
            questions: module.quiz.questions.map(q => 
              q.id === questionId ? { ...q, ...updates } : q
            )
          }
        };
      }
      return module;
    }));
  };

  const removeQuizQuestion = (moduleId: string, questionId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId && module.quiz) {
        return {
          ...module,
          quiz: {
            ...module.quiz,
            questions: module.quiz.questions.filter(q => q.id !== questionId)
          }
        };
      }
      return module;
    }));
  };

  const updateQuizSettings = (moduleId: string, settings: Partial<Module['quiz']>) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        const quiz = module.quiz || {
          questions: [],
          passingScore: 70,
          timeLimit: 30,
          allowRetries: true,
          showCorrectAnswers: true
        };
        return {
          ...module,
          quiz: { ...quiz, ...settings }
        };
      }
      return module;
    }));
  };

  const updateQuestionOption = (moduleId: string, questionId: string, optionIndex: number, value: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId && module.quiz) {
        return {
          ...module,
          quiz: {
            ...module.quiz,
            questions: module.quiz.questions.map(q => {
              if (q.id === questionId) {
                const newOptions = [...q.options];
                newOptions[optionIndex] = value;
                return { ...q, options: newOptions };
              }
              return q;
            })
          }
        };
      }
      return module;
    }));
  };

  // Sections functions
  const addSection = () => {
    const title = newSectionTitle.trim();
    if (!title) return;
    if (sections.some(s => s.title.toLowerCase() === title.toLowerCase())) {
      alert('Une section avec ce titre existe déjà');
      return;
    }
    const newSec = { id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, title, order: sections.length };
    setSections(prev => [...prev, newSec]);
    setNewSectionTitle('');
    // Après création, filtrer sur cette section et faire défiler vers Modules
    setModulesSectionFilter(newSec.id);
    scrollToModules();
  };

  const removeSection = (id: string) => {
    const sec = sections.find(s => s.id === id);
    setSections(prev => prev.filter(s => s.id !== id).map((s, idx) => ({ ...s, order: idx })));
    // Détacher les modules référencés
    setModules(prev => prev.map(m => (m.sectionId === id ? { ...m, sectionId: undefined } : m)));
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const idx = sections.findIndex(s => s.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const copy = [...sections];
    const [a, b] = [copy[idx], copy[targetIdx]];
    copy[idx] = { ...b, order: idx };
    copy[targetIdx] = { ...a, order: targetIdx };
    setSections(copy);
  };

  const renameSection = (id: string, title: string) => {
    setSections(prev => prev.map(s => (s.id === id ? { ...s, title } : s)));
  };

  // Helper: transforme un lien YouTube en URL d'intégration
  const toYouTubeEmbed = (url: string): string => {
    try {
      if (!url) return '';
      const u = new URL(url);
      let id = '';
      if (u.hostname.includes('youtu.be')) {
        id = u.pathname.replace('/', '');
      } else if (u.hostname.includes('youtube.com')) {
        if (u.pathname.startsWith('/watch')) {
          id = u.searchParams.get('v') || '';
        } else if (u.pathname.startsWith('/embed/')) {
          id = u.pathname.split('/')[2] || '';
        } else if (u.pathname.startsWith('/shorts/')) {
          id = u.pathname.split('/')[2] || '';
        }
      }
      return id ? `https://www.youtube.com/embed/${id}` : '';
    } catch {
      return '';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, featuredImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.instructor) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.category) {
      alert('Veuillez sélectionner une catégorie');
      return;
    }

    if (!formData.shortDescription) {
      alert('Veuillez renseigner la description courte');
      return;
    }

    if (!formData.duration || String(formData.duration).trim() === '') {
      alert('Veuillez renseigner la durée estimée');
      return;
    }

    // Validation des modules avant envoi
    const moduleIssues = modules.map((m, idx) => {
      const problems: string[] = [];
      if (!m.title || !m.title.trim()) problems.push('titre');
      if (!m.description || !m.description.trim()) problems.push('description');
      if (!m.duration || m.duration < 1) problems.push('durée');
      return { id: m.id, index: idx, problems };
    }).filter(x => x.problems.length > 0);

    if (moduleIssues.length > 0) {
      const first = moduleIssues[0];
      setExpandedModule(first.id);
      const firstModule = modules.find(m => m.id === first.id);
      if (firstModule?.sectionId) setModulesSectionFilter(firstModule.sectionId);
      scrollToModules();
      const list = moduleIssues
        .map(mi => `- Module ${mi.index + 1}: ${mi.problems.join(', ')}`)
        .join('\n');
      alert(
        'Certains modules sont incomplets. Veuillez corriger avant de créer la formation:\n\n' +
        list +
        '\n\nChamps requis par module: titre, description, durée (>= 1 minute).'
      );
      return;
    }

    try {
      // Uploader l'image de couverture si présente
      let featuredImageUrl: string | undefined = undefined;
      if (formData.featuredImage) {
        try {
          const fd = new FormData();
          fd.append('file', formData.featuredImage);
          fd.append('type', 'image');
          const up = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
          const upBody = await up.json();
          if (!up.ok) throw new Error(upBody.error || 'Upload image échoué');
          featuredImageUrl = upBody.url;
        } catch (err: any) {
          alert('Erreur lors de l\'upload de l\'image: ' + (err.message || 'inconnue'));
          return;
        }
      }
      // Préparer les données pour l'API
      const formationPayload = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        level: formData.level,
        instructor: formData.instructor,
        duration: formData.duration,
        price: formData.price ? parseFloat(formData.price) : 0,
        maxEnrollments: formData.maxEnrollments ? parseInt(formData.maxEnrollments) : undefined,
        language: formData.language,
        tags: formData.tags,
        prerequisites: formData.prerequisites,
        objectives: formData.objectives,
        status: formData.status,
        featured: formData.featured,
        certificateEnabled: formData.certificateEnabled,
        allowDiscussions: formData.allowDiscussions,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        featuredImage: featuredImageUrl,
        sections: sections
          .slice()
          .sort((a,b)=>a.order-b.order)
          .map((s, idx) => ({ title: s.title, order: idx }))
      };

      // Créer la formation
      const response = await fetch('/api/formations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formationPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      const result = await response.json();
      const formationId = result.formation.id;

      // Ajouter les modules
      for (const module of modules) {
        const modulePayload = {
          title: module.title.trim(),
          description: module.description.trim(),
          duration: module.duration,
          type: module.type.toUpperCase(),
          content: module.content,
          order: modules.indexOf(module),
          // Passer le nom de la section si sélectionnée
          section: sections.find(s => s.id === module.sectionId)?.title
        };

        const moduleResponse = await fetch(`/api/formations/${formationId}/modules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(modulePayload),
        });

        if (!moduleResponse.ok) {
          const errBody = await moduleResponse.json().catch(() => ({} as any));
          console.error('Erreur lors de l\'ajout du module:', module.title, errBody);
          throw new Error(`Erreur lors de l'ajout du module: ${module.title}`);
        }

        const moduleResult = await moduleResponse.json();
        const moduleId = moduleResult.module.id;

        // Ajouter le quiz si présent
        if (module.quiz && module.quiz.questions.length > 0) {
          const quizPayload = {
            passingScore: module.quiz.passingScore,
            timeLimit: module.quiz.timeLimit,
            allowRetries: module.quiz.allowRetries,
            showCorrectAnswers: module.quiz.showCorrectAnswers,
            questions: module.quiz.questions.map(q => ({
              question: q.question,
              type: q.type.toUpperCase().replace('-', '_'),
              options: q.options,
              correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer.toString() : q.correctAnswer,
              explanation: q.explanation,
              points: q.points
            }))
          };

          const quizResp = await fetch(`/api/modules/${moduleId}/quiz`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(quizPayload),
          });
          if (!quizResp.ok) {
            const qBody = await quizResp.json().catch(() => ({} as any));
            console.error('Erreur lors de la création du quiz du module:', module.title, qBody);
            throw new Error(`Erreur lors de la création du quiz pour: ${module.title}`);
          }
        }
      }

      alert('Formation créée avec succès !');
      
      // Rediriger vers la liste des formations
      window.location.href = '/admin/formations';

    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de la formation: ' + (error as Error).message);
    }
  };

  const getTotalDuration = () => {
    return modules.reduce((total, module) => total + module.duration, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nouvelle Formation</h1>
                <p className="text-gray-600 mt-1">Créer une nouvelle formation pour la plateforme</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/formations"
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            
            {/* Category and Level Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Catégorie et Niveau</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Catégorie de la formation *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <label
                        key={category.value}
                        className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                          formData.category === category.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={formData.category === category.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3 mb-2">
                          <GraduationCap className={`h-6 w-6 ${
                            formData.category === category.value ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <h3 className="font-medium text-gray-900">{category.label}</h3>
                        </div>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Niveau de difficulté *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {levels.map((level) => (
                      <label
                        key={level.value}
                        className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                          formData.level === level.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="level"
                          value={level.value}
                          checked={formData.level === level.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <h3 className="font-medium text-gray-900 mb-1">{level.label}</h3>
                          <p className="text-sm text-gray-500">{level.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations de base</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la formation *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Entrez le titre de la formation"
                  />
                </div>

                <div>
                  <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description courte *
                  </label>
                  <textarea
                    id="shortDescription"
                    name="shortDescription"
                    required
                    rows={3}
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description courte de la formation (affichée dans les listes)"
                    maxLength={300}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.shortDescription.length}/300 caractères
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description détaillée *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description complète de la formation, ses objectifs et son contenu"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
                      Instructeur *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="instructor"
                        name="instructor"
                        required
                        value={formData.instructor}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nom de l'instructeur"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Durée estimée (heures) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="duration"
                        name="duration"
                        required
                        min="1"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="8"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="maxEnrollments" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre max d'inscrits
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="maxEnrollments"
                        name="maxEnrollments"
                        min="1"
                        value={formData.maxEnrollments}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Illimité si vide"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Image de couverture</h2>
              
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, featuredImage: null }));
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Ajouter une image de couverture</h3>
                      <p className="text-gray-500 mb-4">
                        Cette image sera affichée sur la page de la formation
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="featured-image"
                      />
                      <label
                        htmlFor="featured-image"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                      >
                        Sélectionner une image
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Formats supportés: JPG, PNG, WebP (Max: 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prerequisites and Objectives */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Prérequis et Objectifs</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Prerequisites */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prérequis
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newPrerequisite}
                      onChange={(e) => setNewPrerequisite(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ajouter un prérequis"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                    />
                    <button
                      type="button"
                      onClick={addPrerequisite}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {formData.prerequisites.length > 0 && (
                    <div className="space-y-2">
                      {formData.prerequisites.map((prerequisite, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">{prerequisite}</span>
                          <button
                            type="button"
                            onClick={() => removePrerequisite(prerequisite)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Objectives */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objectifs d'apprentissage
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ajouter un objectif"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                    />
                    <button
                      type="button"
                      onClick={addObjective}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {formData.objectives.length > 0 && (
                    <div className="space-y-2">
                      {formData.objectives.map((objective, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">{objective}</span>
                          <button
                            type="button"
                            onClick={() => removeObjective(objective)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Sections</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom de la section (ex: Introduction)"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSection())}
                  />
                  <button
                    type="button"
                    onClick={addSection}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Ajouter
                  </button>
                </div>

                {sections.length === 0 ? (
                  <div className="text-sm text-gray-500">Aucune section. Ajoutez-en pour regrouper vos modules.</div>
                ) : (
                  <div className="space-y-2">
                    {sections
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((sec, idx) => {
                        const mods = modules.filter(m => m.sectionId === sec.id);
                        return (
                          <div key={sec.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                              <span className="w-6 text-center text-gray-500">{idx + 1}</span>
                              <input
                                type="text"
                                value={sec.title}
                                onChange={(e) => renameSection(sec.id, e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded"
                              />
                              <div className="flex items-center gap-1">
                                <button type="button" onClick={() => moveSection(sec.id, 'up')} className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded">
                                  ↑
                                </button>
                                <button type="button" onClick={() => moveSection(sec.id, 'down')} className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded">
                                  ↓
                                </button>
                                <button type="button" onClick={() => removeSection(sec.id)} className="px-2 py-1 text-red-600 hover:bg-red-100 rounded">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {mods.length === 0 ? (
                                <span className="text-xs text-gray-500">Aucun module dans cette section</span>
                              ) : (
                                mods.map(m => (
                                  <span key={m.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                    {m.title || 'Module sans titre'}
                                  </span>
                                ))
                              )}
                            </div>
                            <div className="mt-3">
                              <button
                                type="button"
                                onClick={() => addModuleForSection(sec.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-2"
                              >
                                <Plus className="h-4 w-4" /> Ajouter un module à cette section
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Modules */}
            <div ref={modulesBlockRef} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Modules de formation</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Organisez votre formation en modules ({modules.length} modules, {Math.round(getTotalDuration() / 60)}h {getTotalDuration() % 60}min au total)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={modulesSectionFilter}
                    onChange={(e) => setModulesSectionFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    title="Filtrer par section"
                  >
                    <option value="all">Toutes les sections</option>
                    <option value="none">Sans section</option>
                    {sections.slice().sort((a,b)=>a.order-b.order).map(sec => (
                      <option key={sec.id} value={sec.id}>{sec.title}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const sid = modulesSectionFilter === 'all' ? undefined : (modulesSectionFilter === 'none' ? undefined : modulesSectionFilter);
                      addModule(sid);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter un module</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {modules
                  .filter(m => {
                    if (modulesSectionFilter === 'all') return true;
                    if (modulesSectionFilter === 'none') return !m.sectionId;
                    return m.sectionId === modulesSectionFilter;
                  })
                  .map((module, index) => (
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
                            {module.duration > 0 && `${Math.round(module.duration / 60)}h ${module.duration % 60}min`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                          {expandedModule === module.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeModule(module.id)}
                          className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {expandedModule === module.id && (
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Titre du module *
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
                              Durée (minutes) *
                            </label>
                            <input
                              type="number"
                              value={module.duration}
                              onChange={(e) => updateModule(module.id, { duration: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="60"
                              min="1"
                            />
                          </div>
                        </div>

                        {/* Section selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section
                          </label>
                          <select
                            value={module.sectionId || ''}
                            onChange={(e) => updateModule(module.id, { sectionId: e.target.value || undefined })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Aucune</option>
                            {sections
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((sec) => (
                                <option key={sec.id} value={sec.id}>{sec.title}</option>
                              ))}
                          </select>
                          {sections.length === 0 && (
                            <p className="text-xs text-gray-500 mt-1">Astuce: ajoutez des sections ci-dessus pour organiser vos modules.</p>
                          )}
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
                            placeholder="Description du contenu du module"
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
                            <option value="video">Vidéo</option>
                            <option value="text">Texte/Document</option>
                            <option value="quiz">Quiz</option>
                            <option value="exercise">Exercice pratique</option>
                          </select>
                        </div>

                        {module.type === 'video' ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Lien vidéo (YouTube/URL)</label>
                              <input
                                type="url"
                                value={module.content}
                                onChange={(e) => updateModule(module.id, { content: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxx"
                              />
                              <p className="text-xs text-gray-500 mt-1">Collez un lien YouTube ou une URL vidéo valide.</p>
                            </div>
                            {toYouTubeEmbed(module.content) && (
                              <div className="aspect-video w-full overflow-hidden rounded-lg border">
                                <iframe
                                  src={toYouTubeEmbed(module.content)}
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  referrerPolicy="strict-origin-when-cross-origin"
                                  allowFullScreen
                                  title="Aperçu vidéo"
                                />
                              </div>
                            )}
                          </div>
                        ) : module.type !== 'quiz' ? (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contenu du module</label>
                            {/* Barre d'outils simple pour listes et images */}
                            <div className="flex items-center gap-2 mb-2">
                              <button
                                type="button"
                                onClick={() => updateModule(module.id, { content: (module.content || '') + (module.content?.endsWith('\n') ? '' : '\n') + '- Élément de liste\n' })}
                                className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                                title="Liste à puces"
                              >• Liste</button>
                              <button
                                type="button"
                                onClick={() => updateModule(module.id, { content: (module.content || '') + (module.content?.endsWith('\n') ? '' : '\n') + '1. Élément numéroté\n' })}
                                className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                                title="Liste numérotée"
                              >1. Liste</button>
                              <label className="px-2 py-1 text-sm border rounded hover:bg-gray-50 cursor-pointer">
                                Insérer une image
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      const fd = new FormData();
                                      fd.append('file', file);
                                      fd.append('type', 'image');
                                      const resp = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
                                      const data = await resp.json();
                                      if (!resp.ok) throw new Error(data.error || 'Upload échoué');
                                      const md = `\n\n![](${data.url})\n`;
                                      updateModule(module.id, { content: (module.content || '') + md });
                                    } catch (err: any) {
                                      alert(err.message || 'Upload échoué');
                                    } finally {
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            <textarea
                              value={module.content}
                              onChange={(e) => updateModule(module.id, { content: e.target.value })}
                              rows={8}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={"Utilisez du texte libre, des listes (\n- item ou 1. item) et insérez des images via le bouton ci-dessus.\nAffichage côté apprenant: le contenu est rendu en texte/HTML simple."}
                            />
                            <p className="text-xs text-gray-500 mt-1">Astuce: vous pouvez coller des liens d'images existants (format ![alt](url)).</p>
                          </div>
                        ) : (
                          /* Quiz Configuration */
                          <div className="space-y-6">
                            {/* Quiz Settings */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="text-lg font-medium text-gray-900 mb-4">Configuration du Quiz</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Score de réussite (%)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={module.quiz?.passingScore || 70}
                                    onChange={(e) => updateQuizSettings(module.id, { passingScore: parseInt(e.target.value) || 70 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Temps limité (minutes)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={module.quiz?.timeLimit || ''}
                                    onChange={(e) => updateQuizSettings(module.id, { timeLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Optionnel"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700">Autoriser les tentatives multiples</h5>
                                    <p className="text-sm text-gray-500">Les étudiants peuvent refaire le quiz</p>
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={module.quiz?.allowRetries ?? true}
                                    onChange={(e) => updateQuizSettings(module.id, { allowRetries: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700">Afficher les bonnes réponses</h5>
                                    <p className="text-sm text-gray-500">Montrer les corrections après le quiz</p>
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={module.quiz?.showCorrectAnswers ?? true}
                                    onChange={(e) => updateQuizSettings(module.id, { showCorrectAnswers: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Questions */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-medium text-gray-900">
                                  Questions ({module.quiz?.questions.length || 0})
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => addQuizQuestion(module.id)}
                                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                                >
                                  <Plus className="h-4 w-4" />
                                  <span>Ajouter une question</span>
                                </button>
                              </div>

                              <div className="space-y-4">
                                {module.quiz?.questions.map((question, qIndex) => (
                                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <h5 className="font-medium text-gray-900">Question {qIndex + 1}</h5>
                                      <button
                                        type="button"
                                        onClick={() => removeQuizQuestion(module.id, question.id)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>

                                    <div className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type de question
                                          </label>
                                          <select
                                            value={question.type}
                                            onChange={(e) => updateQuizQuestion(module.id, question.id, { 
                                              type: e.target.value as QuizQuestion['type'],
                                              options: e.target.value === 'true-false' ? ['Vrai', 'Faux'] : 
                                                      e.target.value === 'open-ended' ? [] : ['', '', '', ''],
                                              correctAnswer: e.target.value === 'true-false' ? 0 : 
                                                            e.target.value === 'open-ended' ? '' : 0
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          >
                                            <option value="multiple-choice">Choix multiple</option>
                                            <option value="true-false">Vrai/Faux</option>
                                            <option value="open-ended">Question ouverte</option>
                                          </select>
                                        </div>
                                        
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Points
                                          </label>
                                          <input
                                            type="number"
                                            min="1"
                                            value={question.points}
                                            onChange={(e) => updateQuizQuestion(module.id, question.id, { points: parseInt(e.target.value) || 1 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Question *
                                        </label>
                                        <textarea
                                          value={question.question}
                                          onChange={(e) => updateQuizQuestion(module.id, question.id, { question: e.target.value })}
                                          rows={3}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          placeholder="Tapez votre question ici..."
                                        />
                                      </div>

                                      {/* Options for multiple choice and true/false */}
                                      {(question.type === 'multiple-choice' || question.type === 'true-false') && (
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Options de réponse
                                          </label>
                                          <div className="space-y-2">
                                            {question.options.map((option, optionIndex) => (
                                              <div key={optionIndex} className="flex items-center space-x-3">
                                                <input
                                                  type="radio"
                                                  name={`correct-${question.id}`}
                                                  checked={question.correctAnswer === optionIndex}
                                                  onChange={() => updateQuizQuestion(module.id, question.id, { correctAnswer: optionIndex })}
                                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <input
                                                  type="text"
                                                  value={option}
                                                  onChange={(e) => updateQuestionOption(module.id, question.id, optionIndex, e.target.value)}
                                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                  placeholder={`Option ${optionIndex + 1}`}
                                                  disabled={question.type === 'true-false'}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                          <p className="text-sm text-gray-500 mt-2">
                                            Sélectionnez la bonne réponse en cochant le bouton radio correspondant
                                          </p>
                                        </div>
                                      )}

                                      {/* Answer for open-ended questions */}
                                      {question.type === 'open-ended' && (
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Réponse modèle (optionnel)
                                          </label>
                                          <textarea
                                            value={question.correctAnswer as string || ''}
                                            onChange={(e) => updateQuizQuestion(module.id, question.id, { correctAnswer: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Réponse modèle pour l'évaluation..."
                                          />
                                        </div>
                                      )}

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Explication (optionnel)
                                        </label>
                                        <textarea
                                          value={question.explanation || ''}
                                          onChange={(e) => updateQuizQuestion(module.id, question.id, { explanation: e.target.value })}
                                          rows={2}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          placeholder="Explication de la réponse (affichée après le quiz)..."
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {(!module.quiz?.questions || module.quiz.questions.length === 0) && (
                                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune question ajoutée</h3>
                                    <p className="text-gray-500 mb-4">
                                      Commencez par ajouter votre première question
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => addQuizQuestion(module.id)}
                                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                      Ajouter une question
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {modules.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun module ajouté</h3>
                    <p className="text-gray-500 mb-4">
                      Commencez par ajouter votre premier module de formation
                    </p>
                    <button
                      type="button"
                      onClick={addModule}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ajouter un module
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags and Metadata */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Tags et métadonnées</h2>
              
              <div className="space-y-6">
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ajouter un tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Tag className="h-4 w-4" />
                    </button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* SEO Meta */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Titre SEO
                    </label>
                    <input
                      type="text"
                      id="metaTitle"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Titre pour les moteurs de recherche"
                    />
                  </div>

                  <div>
                    <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Description SEO
                    </label>
                    <textarea
                      id="metaDescription"
                      name="metaDescription"
                      rows={3}
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description pour les moteurs de recherche"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Paramètres de publication</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="DRAFT">Brouillon</option>
                    <option value="PUBLISHED">Publié</option>
                    <option value="ARCHIVED">Archivé</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Formation en vedette</h3>
                      <p className="text-sm text-gray-500">Afficher cette formation en première page</p>
                    </div>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Certificat activé</h3>
                      <p className="text-sm text-gray-500">Délivrer un certificat à la fin de la formation</p>
                    </div>
                    <input
                      type="checkbox"
                      name="certificateEnabled"
                      checked={formData.certificateEnabled}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Autoriser les discussions</h3>
                      <p className="text-sm text-gray-500">Les participants peuvent discuter dans les forums</p>
                    </div>
                    <input
                      type="checkbox"
                      name="allowDiscussions"
                      checked={formData.allowDiscussions}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Link
                href="/admin/formations"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Annuler</span>
              </Link>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Aperçu</span>
                </button>
                
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Créer la formation</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
