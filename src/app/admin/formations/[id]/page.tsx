"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import {
  ArrowLeft,
  Save,
  Loader,
  AlertCircle,
  GraduationCap,
  User,
  Clock,
  Image as ImageIcon,
  X
} from "lucide-react";

type ApiFormation = {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: 'CYBERSECURITE' | 'SENSIBILISATION' | 'TECHNIQUE' | 'MANAGEMENT';
  level: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  instructor: string;
  duration: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  certificateEnabled: boolean;
  allowDiscussions: boolean;
  language?: string;
  tags?: string[];
  prerequisites?: string[];
  objectives?: string[];
  featuredImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export default function EditFormationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formation, setFormation] = useState<ApiFormation | null>(null);
  const [modules, setModules] = useState<Array<any>>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [moduleError, setModuleError] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Sections
  const [sections, setSections] = useState<Array<{ id: string; title: string; order: number }>>([]);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [renamingSectionId, setRenamingSectionId] = useState<string | null>(null);
  const [renameSectionTitle, setRenameSectionTitle] = useState('');
  const [newModuleSection, setNewModuleSection] = useState('');
  const [newModuleSectionId, setNewModuleSectionId] = useState<string>('');

  // Module forms
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    duration: 10,
    type: 'VIDEO',
    content: '',
    order: 0,
  });
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editModule, setEditModule] = useState({
    title: '', description: '', duration: 10, type: 'VIDEO', content: '', order: 0
  });
  const [editModuleSection, setEditModuleSection] = useState('');

  // Quiz edit state par module
  type QuizQuestionEdit = {
    id: string;
    question: string;
    type: 'multiple-choice' | 'true-false' | 'open-ended';
    options: string[];
    correctAnswer: string | number;
    explanation?: string;
    points: number;
  };
  type QuizEdit = {
    passingScore: number;
    timeLimit?: number;
    allowRetries: boolean;
    showCorrectAnswers: boolean;
    questions: QuizQuestionEdit[];
  };
  const [quizEdits, setQuizEdits] = useState<Record<string, QuizEdit>>({});
  const [quizErrors, setQuizErrors] = useState<Record<string, string[]>>({});
  // Drag & Drop ordering
  const [dragModuleId, setDragModuleId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const sectionTitle = (m: any): string => (m.section?.title || '').trim() || 'Sans section';
  const sectionKey = (m: any): string => m.section?.id || 'none';
  const groupedModules = React.useMemo(() => {
    const groups: Record<string, { id: string | null; title: string; items: any[] }> = {};
    (modules || []).slice().sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)).forEach((m: any) => {
      const key = sectionKey(m);
      if (!groups[key]) groups[key] = { id: m.section?.id || null, title: sectionTitle(m), items: [] };
      groups[key].items.push(m);
    });
    return Object.values(groups);
  }, [modules]);

  const reorderWithinSection = async (sectionId: string | null, orderedIds: string[]) => {
    try {
      setReordering(true);
      const updates = orderedIds.map((id, idx) => (
        fetch(`/api/modules/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ order: idx })
        })
      ));
      await Promise.all(updates);
      await loadModules();
    } finally {
      setReordering(false);
    }
  };

  // Helper YouTube
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

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'CYBERSECURITE',
    level: 'DEBUTANT',
    instructor: '',
    duration: '',
    status: 'DRAFT',
    featured: false,
    certificateEnabled: true,
    allowDiscussions: true,
    tags: [] as string[],
    prerequisites: [] as string[],
    objectives: [] as string[],
    featuredImage: null as string | null,
    metaTitle: '',
    metaDescription: ''
  } as ApiFormation);

  const categories = [
    { value: 'CYBERSECURITE', label: 'Cybersécurité' },
    { value: 'SENSIBILISATION', label: 'Sensibilisation' },
    { value: 'TECHNIQUE', label: 'Technique' },
    { value: 'MANAGEMENT', label: 'Management' },
  ];
  const levels = [
    { value: 'DEBUTANT', label: 'Débutant' },
    { value: 'INTERMEDIAIRE', label: 'Intermédiaire' },
    { value: 'AVANCE', label: 'Avancé' },
  ];

  const loadFormation = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/formations/${id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur lors du chargement');
      const data: ApiFormation = await res.json();
      setFormation(data);
      setForm({
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        category: data.category,
        level: data.level,
        instructor: data.instructor,
        duration: data.duration,
        status: data.status,
        featured: data.featured,
        certificateEnabled: data.certificateEnabled,
        allowDiscussions: data.allowDiscussions,
        tags: (data as any).tags || [],
        prerequisites: (data as any).prerequisites || [],
        objectives: (data as any).objectives || [],
        featuredImage: (data as any).featuredImage || null,
        metaTitle: (data as any).metaTitle || '',
        metaDescription: (data as any).metaDescription || '',
        id: data.id,
      } as any);
      setImagePreview((data as any).featuredImage || null);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) loadFormation(); }, [id]);

  const loadModules = async () => {
    try {
      setLoadingModules(true);
      setModuleError('');
      const res = await fetch(`/api/formations/${id}/modules`, { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur lors du chargement des modules');
      const data = await res.json();
      setModules(data || []);
    } catch (e: any) {
      setModuleError(e.message || 'Erreur de chargement des modules');
    } finally {
      setLoadingModules(false);
    }
  };

  useEffect(() => { if (id) loadModules(); }, [id]);
  useEffect(() => { if (id) loadSections(); }, [id]);
  // Préremplir l'ordre du nouveau module comme dans la création (index courant)
  useEffect(() => {
    setNewModule(prev => prev.order === 0 ? { ...prev, order: modules.length } : prev);
  }, [modules.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload: Partial<ApiFormation> = {
        title: form.title,
        shortDescription: form.shortDescription,
        description: form.description,
        category: form.category,
        level: form.level,
        instructor: form.instructor,
        duration: String(form.duration),
        status: form.status,
        featured: form.featured,
        certificateEnabled: form.certificateEnabled,
        allowDiscussions: form.allowDiscussions,
        tags: (form as any).tags || [],
        prerequisites: (form as any).prerequisites || [],
        objectives: (form as any).objectives || [],
        featuredImage: (form as any).featuredImage || null,
        metaTitle: (form as any).metaTitle || '',
        metaDescription: (form as any).metaDescription || '',
      };
      const res = await fetch(`/api/formations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const er = await res.json().catch(() => ({}));
        throw new Error(er.error || 'Mise à jour impossible');
      }
      alert('Formation mise à jour');
      router.push('/admin/formations');
    } catch (e: any) {
      setError(e.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'image');
      const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload échoué');
      setForm(prev => ({ ...(prev as any), featuredImage: data.url } as any));
      setImagePreview(data.url);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'upload');
    }
  };

  const submitNewModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const computedOrder = (newModule.order === 0 && modules.length > 0) ? modules.length : newModule.order;
      const res = await fetch(`/api/formations/${id}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newModule.title.trim(),
          description: (newModule.description || '').trim(),
          duration: Number(newModule.duration),
          type: newModule.type,
          content: newModule.content,
          order: Number(computedOrder),
          sectionId: newModuleSectionId || null,
          section: (newModuleSection || '').trim() || null
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const details = (body.details || []) as Array<{ message?: string }>;
        const detailMsg = details.map(d => d.message).filter(Boolean).join(', ');
        throw new Error(body.error || detailMsg || 'Création du module impossible');
      }
      setNewModule({ title: '', description: '', duration: 10, type: 'VIDEO', content: '', order: 0 });
      setNewModuleSection('');
      setNewModuleSectionId('');
      await loadSections();
      await loadModules();
    } catch (e: any) {
      alert(e.message || 'Erreur lors de l\'ajout du module');
    }
  };

  // Sections API helpers
  const loadSections = async () => {
    try {
      const res = await fetch(`/api/formations/${id}/sections`, { credentials: 'include' });
      if (!res.ok) throw new Error('Chargement des sections impossible');
      const list = await res.json();
      setSections((Array.isArray(list) ? list : []) as any);
    } catch (e) {
      console.error(e);
    }
  };

  const addSection = async () => {
    const title = newSectionTitle.trim();
    if (!title) return;
    try {
      const res = await fetch(`/api/formations/${id}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title })
      });
      if (!res.ok) throw new Error('Création de section impossible');
      setNewSectionTitle('');
      await loadSections();
    } catch (e: any) {
      alert(e.message || 'Erreur lors de la création de la section');
    }
  };

  const moveSection = async (sectionId: string, dir: 'up' | 'down') => {
    const sorted = sections.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const idx = sorted.findIndex(s => s.id === sectionId);
    if (idx < 0) return;
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= sorted.length) return;
    // swap orders locally then persist both
    const a = sorted[idx];
    const b = sorted[target];
    try {
      await Promise.all([
        fetch(`/api/sections/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ order: b.order }) }),
        fetch(`/api/sections/${b.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ order: a.order }) })
      ]);
      await loadSections();
    } catch (e: any) {
      alert(e.message || 'Erreur lors du réordonnancement');
    }
  };

  const renameSection = async (sectionId: string, title: string) => {
    const t = (title || '').trim();
    if (!t) { setRenamingSectionId(null); setRenameSectionTitle(''); return; }
    try {
      const res = await fetch(`/api/sections/${sectionId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ title: t }) });
      if (!res.ok) throw new Error('Renommage impossible');
      setRenamingSectionId(null);
      setRenameSectionTitle('');
      await loadSections();
    } catch (e: any) {
      alert(e.message || 'Erreur lors du renommage');
    }
  };

  const removeSection = async (sectionId: string) => {
    if (!confirm('Supprimer cette section ? Les modules seront détachés.')) return;
    try {
      const res = await fetch(`/api/sections/${sectionId}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Suppression impossible');
      await loadSections();
      await loadModules();
    } catch (e: any) {
      alert(e.message || 'Erreur lors de la suppression de la section');
    }
  };

  const startEditModule = (m: any) => {
    setEditingModuleId(m.id);
    // Préférer la vraie section si disponible
    const section = (m.section && (m.section.title || '').trim()) || '';
    const pureTitle = section ? String(m.title || '') : (() => {
      const parts = String(m.title || '').split('|');
      return parts.length > 1 ? parts.slice(1).join('|').trim() : String(m.title || '');
    })();
    setEditModule({
      title: pureTitle,
      description: m.description,
      duration: m.duration,
      type: m.type,
      content: m.content,
      order: m.order || 0,
    });
    setEditModuleSection(section);
    // Initialiser état du quiz si disponible
    if (m.quiz && !quizEdits[m.id]) {
      setQuizEdits(prev => ({
        ...prev,
        [m.id]: {
          passingScore: m.quiz.passingScore || 70,
          timeLimit: m.quiz.timeLimit || undefined,
          allowRetries: m.quiz.allowRetries ?? true,
          showCorrectAnswers: m.quiz.showCorrectAnswers ?? true,
          questions: (m.quiz.questions || []).map((q: any) => ({
            id: q.id,
            question: q.question,
            type: (q.type || 'MULTIPLE_CHOICE').toLowerCase().replace('_', '-') as any,
            options: q.options || [],
            correctAnswer: q.correctAnswer || '',
            explanation: q.explanation || '',
            points: q.points || 1,
          }))
        }
      }));
    }
  };

  const submitEditModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModuleId) return;
    try {
      const res = await fetch(`/api/modules/${editingModuleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...editModule,
          title: editModule.title.trim(),
          section: (editModuleSection || '').trim() || null,
          duration: Number(editModule.duration),
          order: Number(editModule.order),
        })
      });
      if (!res.ok) throw new Error('Mise à jour du module impossible');
      setEditingModuleId(null);
      await loadModules();
    } catch (e: any) {
      alert(e.message || 'Erreur lors de la mise à jour du module');
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm('Supprimer ce module ?')) return;
    try {
      const res = await fetch(`/api/modules/${moduleId}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Suppression impossible');
      await loadModules();
    } catch (e: any) {
      alert(e.message || 'Erreur lors de la suppression');
    }
  };

  // Quiz helpers
  const ensureQuiz = (moduleId: string) => {
    if (!quizEdits[moduleId]) {
      setQuizEdits(prev => ({
        ...prev,
        [moduleId]: {
          passingScore: 70,
          timeLimit: 30,
          allowRetries: true,
          showCorrectAnswers: true,
          questions: []
        }
      }));
    }
  };
  const addQuizQuestion = (moduleId: string) => {
    ensureQuiz(moduleId);
    const q: QuizQuestionEdit = {
      id: `q-${Date.now()}`,
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1
    };
    setQuizEdits(prev => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], questions: [...(prev[moduleId]?.questions || []), q] }
    }));
  };
  const updateQuizQuestion = (moduleId: string, questionId: string, updates: Partial<QuizQuestionEdit>) => {
    setQuizEdits(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        questions: prev[moduleId].questions.map(q => q.id === questionId ? { ...q, ...updates } : q)
      }
    }));
  };
  const removeQuizQuestion = (moduleId: string, questionId: string) => {
    setQuizEdits(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        questions: prev[moduleId].questions.filter(q => q.id !== questionId)
      }
    }));
  };
  const setQuizSettings = (moduleId: string, settings: Partial<QuizEdit>) => {
    setQuizEdits(prev => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], ...settings }
    }));
  };
  const saveQuiz = async (moduleId: string, hasExisting: boolean) => {
    try {
      const quiz = quizEdits[moduleId];
      if (!quiz) return;
      // Validation légère
      const errors: string[] = [];
      if (quiz.passingScore < 0 || quiz.passingScore > 100) {
        errors.push('Le score de réussite doit être entre 0 et 100');
      }
      quiz.questions.forEach((q, idx) => {
        if (!q.question || !q.question.trim()) {
          errors.push(`Question ${idx + 1}: l'intitulé est requis`);
        }
        if (q.type !== 'open-ended') {
          if (q.type === 'multiple-choice') {
            const filled = q.options.filter(o => (o || '').trim().length > 0);
            if (filled.length < 2) {
              errors.push(`Question ${idx + 1}: au moins 2 options non vides sont requises`);
            }
            const max = Math.max(0, q.options.length - 1);
            const ans = typeof q.correctAnswer === 'number' ? q.correctAnswer : parseInt(String(q.correctAnswer) || '0');
            if (isNaN(ans) || ans < 0 || ans > max) {
              errors.push(`Question ${idx + 1}: l'indice de la bonne réponse doit être entre 0 et ${max}`);
            }
          }
          if (q.type === 'true-false') {
            const ans = typeof q.correctAnswer === 'number' ? q.correctAnswer : parseInt(String(q.correctAnswer) || '0');
            if (isNaN(ans) || ans < 0 || ans > 1) {
              errors.push(`Question ${idx + 1}: la bonne réponse doit être 0 (Vrai) ou 1 (Faux)`);
            }
          }
        }
      });
      if (errors.length) {
        setQuizErrors(prev => ({ ...prev, [moduleId]: errors }));
        return;
      } else {
        setQuizErrors(prev => ({ ...prev, [moduleId]: [] }));
      }
      const payload = {
        passingScore: quiz.passingScore,
        timeLimit: quiz.timeLimit,
        allowRetries: quiz.allowRetries,
        showCorrectAnswers: quiz.showCorrectAnswers,
        questions: quiz.questions.map(q => ({
          question: q.question,
          type: q.type.toUpperCase().replace('-', '_'),
          options: q.options,
          correctAnswer: typeof q.correctAnswer === 'number' ? String(q.correctAnswer) : (q.correctAnswer || ''),
          explanation: q.explanation,
          points: q.points
        }))
      };
      const method = hasExisting ? 'PUT' : 'POST';
      const res = await fetch(`/api/modules/${moduleId}/quiz`, { method, credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Enregistrement du quiz impossible');
      alert('Quiz enregistré');
      await loadModules();
    } catch (e: any) {
      alert(e.message || 'Erreur lors de l\'enregistrement du quiz');
    }
  };
  const deleteQuiz = async (moduleId: string) => {
    if (!confirm('Supprimer ce quiz ?')) return;
    try {
      const res = await fetch(`/api/modules/${moduleId}/quiz`, { method: 'DELETE', credentials: 'include' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Suppression du quiz impossible');
      setQuizEdits(prev => { const n = { ...prev }; delete n[moduleId]; return n; });
      await loadModules();
    } catch (e: any) {
      alert(e.message || 'Erreur lors de la suppression du quiz');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 lg:flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center pt-20 lg:pt-0">
          <div className="text-center">
            <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">Chargement de la formation…</p>
          </div>
        </div>

          
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 lg:flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center pt-20 lg:pt-0">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={loadFormation} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Réessayer</button>
          </div>
        </div>
      </div>
    );
  }

  if (!formation) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Modifier la formation</h1>
                <p className="text-gray-600 mt-1">{formation.title}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/admin/formations" className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
                  <ArrowLeft className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {/* Catégorie et Niveau - même présentation que la création */}
          <div className="max-w-4xl mx-auto mb-6">
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
                          form.category === category.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={form.category === category.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3 mb-2">
                          <GraduationCap className={`h-6 w-6 ${
                            form.category === category.value ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <h3 className="font-medium text-gray-900">{category.label}</h3>
                        </div>
                        <p className="text-sm text-gray-500">Sélectionner cette catégorie</p>
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
                          form.level === level.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="level"
                          value={level.value}
                          checked={form.level === level.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <h3 className="font-medium text-gray-900 mb-1">{level.label}</h3>
                          <p className="text-sm text-gray-500">Choisir ce niveau</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form id="formation-form" onSubmit={onSubmit} className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description courte</label>
                  <input name="shortDescription" value={form.shortDescription} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" maxLength={300} required />
                  <div className="text-xs text-gray-500 mt-1">{(form.shortDescription || '').length}/300 caractères</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={6} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
              {/* Catégorie et niveau gérés au-dessus via cartes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructeur</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input name="instructor" value={form.instructor} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée (heures)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input name="duration" type="number" min="1" value={form.duration} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border rounded-lg" required />
                  </div>
                </div>
              </div>
              {/* Paramètres déplacés plus bas pour suivre l'ordre de création */}
            </div>

            {/* Image de couverture */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Image de couverture</h2>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Aperçu" className="w-full h-64 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setForm(prev => ({ ...(prev as any), featuredImage: null } as any)); }}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                      title="Retirer l'image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Ajouter une image de couverture</h3>
                      <p className="text-gray-500 mb-4">Cette image sera affichée sur la page de la formation</p>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="featured-image" />
                      <label htmlFor="featured-image" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                        Sélectionner une image
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Formats: JPG, PNG, WebP (Max: 10MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SEO déplacé sous Tags pour suivre l'ordre de création */}

            {/* Prérequis et Objectifs - même présentation */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Prérequis et Objectifs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prérequis</label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newPrerequisite}
                      onChange={(e) => setNewPrerequisite(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ajouter un prérequis"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); if (newPrerequisite.trim()) {
                          setForm(prev => ({ ...(prev as any), prerequisites: ([...(prev as any).prerequisites || [], newPrerequisite.trim()]) } as any)); setNewPrerequisite('');
                        } }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => { if (newPrerequisite.trim()) { setForm(prev => ({ ...(prev as any), prerequisites: ([...(prev as any).prerequisites || [], newPrerequisite.trim()]) } as any)); setNewPrerequisite(''); } }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="space-y-2">
                    {((form as any).prerequisites || []).map((pr: string, idx: number) => (
                      <div key={`${pr}-${idx}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{pr}</span>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...(prev as any), prerequisites: (prev as any).prerequisites.filter((x: string, i: number) => i !== idx) } as any))}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objectifs d'apprentissage</label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ajouter un objectif"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); if (newObjective.trim()) {
                          setForm(prev => ({ ...(prev as any), objectives: ([...(prev as any).objectives || [], newObjective.trim()]) } as any)); setNewObjective('');
                        } }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => { if (newObjective.trim()) { setForm(prev => ({ ...(prev as any), objectives: ([...(prev as any).objectives || [], newObjective.trim()]) } as any)); setNewObjective(''); } }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="space-y-2">
                    {((form as any).objectives || []).map((obj: string, idx: number) => (
                      <div key={`${obj}-${idx}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{obj}</span>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...(prev as any), objectives: (prev as any).objectives.filter((x: string, i: number) => i !== idx) } as any))}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions déplacées en bas de page pour éviter toute confusion avec la gestion des modules */}
          </form>
  
              {/* Sections management */}
              <div className="max-w-4xl mx-auto mt-10">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Sections</h2>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <input value={newSectionTitle} onChange={(e)=>setNewSectionTitle(e.target.value)} className="flex-1 px-3 py-2 border rounded" placeholder="Ajouter une section (ex: Introduction)" />
                    <button onClick={addSection} className="px-4 py-2 bg-blue-600 text-white rounded">Ajouter</button>
                  </div>
                  <div className="divide-y">
                    {sections.sort((a:any,b:any)=> (a.order??0)-(b.order??0)).map((s:any, idx:number)=> (
                      <div key={s.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{idx+1}.</span>
                          {renamingSectionId===s.id ? (
                            <input value={renameSectionTitle} onChange={(e)=>setRenameSectionTitle(e.target.value)} className="px-2 py-1 border rounded" />
                          ) : (
                            <span className="font-medium text-gray-900">{s.title}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={()=>moveSection(s.id,'up')} className="px-2 py-1 border rounded">↑</button>
                          <button onClick={()=>moveSection(s.id,'down')} className="px-2 py-1 border rounded">↓</button>
                          {renamingSectionId===s.id ? (
                            <>
                              <button onClick={()=>renameSection(s.id, renameSectionTitle)} className="px-2 py-1 bg-blue-600 text-white rounded">OK</button>
                              <button onClick={()=>{setRenamingSectionId(null); setRenameSectionTitle('');}} className="px-2 py-1 border rounded">Annuler</button>
                            </>
                          ) : (
                            <button onClick={()=>{setRenamingSectionId(s.id); setRenameSectionTitle(s.title);}} className="px-2 py-1 border rounded">Renommer</button>
                          )}
                          <button onClick={()=>removeSection(s.id)} className="px-2 py-1 border rounded text-red-600">Supprimer</button>
                        </div>
                      </div>
                    ))}
                    {!sections.length && (
                      <div className="text-sm text-gray-500 py-2">Aucune section pour l'instant.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modules management */}
              <div className="max-w-4xl mx-auto mt-10">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center"><GraduationCap className="h-5 w-5 mr-2" /> Modules de formation</h2>
                  <p className="text-sm text-gray-500 mt-1">Organisez votre formation en modules ({modules.length} module(s))</p>
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById('new-module-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter un module
                </button>
              </div>

              {loadingModules && (
                <div className="text-gray-500 flex items-center"><Loader className="animate-spin h-4 w-4 mr-2" /> Chargement des modules…</div>
              )}
              {moduleError && (
                <div className="text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" /> {moduleError}</div>
              )}

              {/* New module form moved below the list (now only list appears here) */}

              {/* Modules list (grouped by section) */}
              <div className="space-y-6">
                {groupedModules.map((grp) => (
                  <div key={grp.id ?? grp.title} className="border rounded-lg">
                    <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
                      <div className="font-semibold text-gray-900">{grp.title}</div>
                      {reordering && <span className="text-xs text-gray-500">Réordonnancement…</span>}
                    </div>
                    <div className="divide-y">
                    {grp.items.map((m: any, idx: number) => (
                      <div
                        key={m.id}
                        className="py-4 px-4 flex items-start justify-between cursor-move"
                        draggable
                        onDragStart={() => setDragModuleId(m.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (!dragModuleId || dragModuleId === m.id) return;
                          const dragged = grp.items.find((x:any)=> x.id === dragModuleId);
                          if (!dragged) return; // ignore cross-section drops
                          const newOrder = grp.items.filter((x:any)=> x.id !== dragModuleId);
                          newOrder.splice(idx, 0, dragged);
                          reorderWithinSection(grp.id || null, newOrder.map((x:any)=> x.id));
                          setDragModuleId(null);
                        }}
                      >
                    {editingModuleId === m.id ? (
                      <>
                      <form onSubmit={submitEditModule} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                        <div>
                          <label className="block text-xs text-gray-600">Section (optionnel)</label>
                          <input value={editModuleSection} onChange={(e) => setEditModuleSection(e.target.value)} className="w-full px-2 py-2 border rounded" placeholder="Introduction, Chapitre 1,..." />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600">Titre</label>
                          <input value={editModule.title} onChange={(e) => setEditModule({...editModule, title: e.target.value})} className="w-full px-2 py-2 border rounded" required />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600">Description</label>
                          <input value={editModule.description} onChange={(e) => setEditModule({...editModule, description: e.target.value})} className="w-full px-2 py-2 border rounded" required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">Durée (min)</label>
                          <input type="number" min={1} value={editModule.duration} onChange={(e) => setEditModule({...editModule, duration: Number(e.target.value)})} className="w-full px-2 py-2 border rounded" required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">Type</label>
                          <select value={editModule.type} onChange={(e) => setEditModule({...editModule, type: e.target.value})} className="w-full px-2 py-2 border rounded">
                            <option value="VIDEO">Vidéo</option>
                            <option value="TEXT">Texte</option>
                            <option value="QUIZ">Quiz</option>
                            <option value="EXERCISE">Exercice</option>
                          </select>
                        </div>
                        {editModule.type === 'VIDEO' ? (
                          <div className="md:col-span-6">
                            <label className="block text-xs text-gray-600">Lien YouTube</label>
                            <input type="url" value={editModule.content} onChange={(e) => setEditModule({...editModule, content: e.target.value})} className="w-full px-2 py-2 border rounded" placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxx" required />
                            {toYouTubeEmbed(editModule.content) && (
                              <div className="aspect-video w-full mt-3 border rounded overflow-hidden">
                                <iframe
                                  src={toYouTubeEmbed(editModule.content)}
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  referrerPolicy="strict-origin-when-cross-origin"
                                  allowFullScreen
                                  title="Aperçu vidéo"
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="md:col-span-6">
                            <label className="block text-xs text-gray-600">Contenu</label>
                            <textarea value={editModule.content} onChange={(e) => setEditModule({...editModule, content: e.target.value})} className="w-full px-2 py-2 border rounded" rows={3} required />
                          </div>
                        )}
                        <div>
                          <label className="block text-xs text-gray-600">Ordre</label>
                          <input type="number" min={0} value={editModule.order} onChange={(e) => setEditModule({...editModule, order: Number(e.target.value)})} className="w-full px-2 py-2 border rounded" />
                        </div>
                        <div className="flex space-x-2">
                          <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Sauver</button>
                          <button type="button" onClick={() => setEditingModuleId(null)} className="px-3 py-2 border rounded">Annuler</button>
                        </div>
                      </form>

                      
                      <div className="mt-6 border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-semibold text-gray-900">Quiz du module</h3>
                          {m.quiz && (
                            <button onClick={() => deleteQuiz(m.id)} className="text-red-600 hover:text-red-800 text-sm">Supprimer le quiz</button>
                          )}
                        </div>
                        {!quizEdits[m.id] ? (
                          <button onClick={() => ensureQuiz(m.id)} className="px-3 py-2 bg-blue-600 text-white rounded">Créer un quiz</button>
                        ) : (
                          <div className="space-y-4">
                            {quizErrors[m.id] && quizErrors[m.id].length > 0 && (
                              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
                                <ul className="list-disc list-inside">
                                  {quizErrors[m.id].map((er, i) => (<li key={i}>{er}</li>))}
                                </ul>
                              </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Score de réussite (%)</label>
                                <input type="number" min={0} max={100} value={quizEdits[m.id].passingScore}
                                  onChange={e => setQuizSettings(m.id, { passingScore: parseInt(e.target.value) || 0 })}
                                  className="w-full px-3 py-2 border rounded" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Temps limite (min)</label>
                                <input type="number" min={1} value={quizEdits[m.id].timeLimit || ''}
                                  onChange={e => setQuizSettings(m.id, { timeLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                                  className="w-full px-3 py-2 border rounded" />
                              </div>
                              <div className="flex items-center gap-4 mt-6">
                                <label className="inline-flex items-center text-sm text-gray-700">
                                  <input type="checkbox" className="mr-2" checked={quizEdits[m.id].allowRetries}
                                    onChange={e => setQuizSettings(m.id, { allowRetries: e.target.checked })} />
                                  Tentatives autorisées
                                </label>
                                <label className="inline-flex items-center text-sm text-gray-700">
                                  <input type="checkbox" className="mr-2" checked={quizEdits[m.id].showCorrectAnswers}
                                    onChange={e => setQuizSettings(m.id, { showCorrectAnswers: e.target.checked })} />
                                  Afficher réponses correctes
                                </label>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <h4 className="font-medium">Questions ({quizEdits[m.id].questions.length})</h4>
                              <button onClick={() => addQuizQuestion(m.id)} className="px-3 py-2 bg-blue-600 text-white rounded">Ajouter une question</button>
                            </div>

                            <div className="space-y-3">
                              {quizEdits[m.id].questions.map((q, idx) => (
                                <div key={q.id} className="border rounded p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm text-gray-700">Question {idx + 1}</div>
                                    <button onClick={() => removeQuizQuestion(m.id, q.id)} className="text-red-600 text-sm">Supprimer</button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="md:col-span-2">
                                      <label className="block text-xs text-gray-600 mb-1">Intitulé</label>
                                      <input value={q.question} onChange={e => updateQuizQuestion(m.id, q.id, { question: e.target.value })} className="w-full px-2 py-2 border rounded" />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Type</label>
                                      <select value={q.type} onChange={e => updateQuizQuestion(m.id, q.id, { type: e.target.value as any })} className="w-full px-2 py-2 border rounded">
                                        <option value="multiple-choice">Choix multiple</option>
                                        <option value="true-false">Vrai/Faux</option>
                                        <option value="open-ended">Réponse ouverte</option>
                                      </select>
                                    </div>
                                  </div>
                                  {q.type !== 'open-ended' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                                      {q.options.map((opt, oi) => (
                                        <input key={oi} value={opt} onChange={e => {
                                          const newOpts = [...q.options];
                                          newOpts[oi] = e.target.value;
                                          updateQuizQuestion(m.id, q.id, { options: newOpts });
                                        }} className="w-full px-2 py-2 border rounded" placeholder={`Option ${oi + 1}`} />
                                      ))}
                                      <div className="md:col-span-2">
                                        <label className="block text-xs text-gray-600 mb-1">Bonne réponse</label>
                                        <input
                                          type="number"
                                          min={0}
                                          max={q.type === 'true-false' ? 1 : Math.max(0, q.options.length - 1)}
                                          value={typeof q.correctAnswer === 'number' ? q.correctAnswer : parseInt(String(q.correctAnswer) || '0')}
                                          onChange={e => updateQuizQuestion(m.id, q.id, { correctAnswer: parseInt(e.target.value) || 0 })}
                                          className="w-full px-2 py-2 border rounded"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                          {q.type === 'true-false' ? '0 = Vrai, 1 = Faux' : `Indice de l'option correcte (0 à ${Math.max(0, q.options.length - 1)})`}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                                    <input value={q.explanation || ''} onChange={e => updateQuizQuestion(m.id, q.id, { explanation: e.target.value })} className="w-full px-2 py-2 border rounded" placeholder="Explication (optionnel)" />
                                    <input type="number" min={1} value={q.points} onChange={e => updateQuizQuestion(m.id, q.id, { points: parseInt(e.target.value) || 1 })} className="w-full px-2 py-2 border rounded" placeholder="Points" />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="text-right">
                              <button onClick={() => saveQuiz(m.id, !!m.quiz)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enregistrer le quiz</button>
                            </div>
                          </div>
                        )}
                      </div>
                      </>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{m.title} <span className="text-sm text-gray-500">({m.type})</span></div>
                          <div className="text-gray-600 text-sm mb-1">{m.description}</div>
                          <div className="text-gray-500 text-sm">Durée: {m.duration} min • Ordre: {m.order ?? 0}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="px-3 py-1 border rounded" onClick={() => startEditModule(m)}>Éditer</button>
                          <button className="px-3 py-1 border rounded text-red-600" onClick={() => deleteModule(m.id)}>Supprimer</button>
                        </div>
                      </div>
                    )}
                      </div>
                    ))}
                    {!grp.items.length && (
                      <div className="text-sm text-gray-500 px-4 py-3">Aucun module dans cette section.</div>
                    )}
                    </div>
                  </div>
                ))}
                {!modules.length && !loadingModules && (
                  <div className="text-sm text-gray-500">Aucun module pour l'instant.</div>
                )}
              </div>

              {/* New module form (placed after the list for easier adding more modules) */}
              <div id="new-module-form" className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900">Ajouter un module</h3>
                  <span className="text-xs text-gray-500">Remplissez puis cliquez sur Ajouter</span>
                </div>
                <form onSubmit={submitNewModule} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                  <div>
                    <label className="block text-xs text-gray-600">Section</label>
                    <select value={newModuleSectionId} onChange={(e)=> setNewModuleSectionId(e.target.value)} className="w-full px-2 py-2 border rounded">
                      <option value="">— Sans section —</option>
                      {sections.sort((a:any,b:any)=> (a.order??0)-(b.order??0)).map((s:any)=> (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                    <input value={newModuleSection} onChange={(e) => setNewModuleSection(e.target.value)} className="w-full px-2 py-2 border rounded mt-2" placeholder="…ou créer une nouvelle section" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600">Titre</label>
                    <input value={newModule.title} onChange={(e) => setNewModule({ ...newModule, title: e.target.value })} className="w-full px-2 py-2 border rounded" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-600">Description</label>
                    <input value={newModule.description} minLength={5} onChange={(e) => setNewModule({ ...newModule, description: e.target.value })} className="w-full px-2 py-2 border rounded" required />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Durée (min)</label>
                    <input type="number" min={1} value={newModule.duration} onChange={(e) => setNewModule({ ...newModule, duration: Number(e.target.value) })} className="w-full px-2 py-2 border rounded" required />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Type</label>
                    <select value={newModule.type} onChange={(e) => setNewModule({ ...newModule, type: e.target.value })} className="w-full px-2 py-2 border rounded">
                      <option value="VIDEO">Vidéo</option>
                      <option value="TEXT">Texte</option>
                      <option value="QUIZ">Quiz</option>
                      <option value="EXERCISE">Exercice</option>
                    </select>
                  </div>
                  {newModule.type === 'VIDEO' ? (
                    <div className="md:col-span-6">
                      <label className="block text-xs text-gray-600">Lien YouTube</label>
                      <input type="url" value={newModule.content} onChange={(e) => setNewModule({ ...newModule, content: e.target.value })} className="w-full px-2 py-2 border rounded" placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxx" required />
                      {toYouTubeEmbed(newModule.content) && (
                        <div className="aspect-video w-full mt-3 border rounded overflow-hidden">
                          <iframe
                            src={toYouTubeEmbed(newModule.content)}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            title="Aperçu vidéo"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="md:col-span-6">
                      <label className="block text-xs text-gray-600">Contenu</label>
                      <textarea value={newModule.content} onChange={(e) => setNewModule({ ...newModule, content: e.target.value })} className="w-full px-2 py-2 border rounded" rows={3} required />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-gray-600">Ordre</label>
                    <input type="number" min={0} value={newModule.order} onChange={(e) => setNewModule({ ...newModule, order: Number(e.target.value) })} className="w-full px-2 py-2 border rounded" />
                  </div>
                  <div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Ajouter</button>
                  </div>
                </form>
              </div>
            </div>
          </div>


          {/* Tags et métadonnées */}
          <div className="max-w-4xl mx-auto mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Tags et métadonnées</h2>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ajouter un tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newTag.trim()) {
                        setForm(prev => ({ ...(prev as any), tags: ([...(prev as any).tags || [], newTag.trim()]) } as any));
                        setNewTag('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => { if (newTag.trim()) { setForm(prev => ({ ...(prev as any), tags: ([...(prev as any).tags || [], newTag.trim()]) } as any)); setNewTag(''); } }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
              {((form as any).tags || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {((form as any).tags || []).map((tag: string, idx: number) => (
                    <span key={`${tag}-${idx}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {tag}
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...(prev as any), tags: (prev as any).tags.filter((x: string, i: number) => i !== idx) } as any))}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* SEO Meta (déplacé ici) */}
              <div className="grid grid-cols-1 gap-6 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre SEO</label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={(form as any).metaTitle || ''}
                    onChange={e => setForm(prev => ({ ...(prev as any), metaTitle: e.target.value } as any))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Titre pour les moteurs de recherche"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description SEO</label>
                  <textarea
                    name="metaDescription"
                    rows={3}
                    value={(form as any).metaDescription || ''}
                    onChange={e => setForm(prev => ({ ...(prev as any), metaDescription: e.target.value } as any))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description pour les moteurs de recherche"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Paramètres de publication */}
          <div className="max-w-4xl mx-auto mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Paramètres de publication</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                    <option value="DRAFT">Brouillon</option>
                    <option value="PUBLISHED">Publié</option>
                    <option value="ARCHIVED">Archivé</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Mettre en vedette</h3>
                      <p className="text-sm text-gray-500">Afficher cette formation en première page</p>
                    </div>
                    <input id="featured" name="featured" type="checkbox" checked={!!form.featured} onChange={handleChange} className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Certificat activé</h3>
                      <p className="text-sm text-gray-500">Délivrer un certificat à la fin</p>
                    </div>
                    <input id="certificateEnabled" name="certificateEnabled" type="checkbox" checked={!!form.certificateEnabled} onChange={handleChange} className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Autoriser les discussions</h3>
                      <p className="text-sm text-gray-500">Activer les forums pour cette formation</p>
                    </div>
                    <input id="allowDiscussions" name="allowDiscussions" type="checkbox" checked={!!form.allowDiscussions} onChange={handleChange} className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="max-w-4xl mx-auto mt-8 mb-6">
            <div className="flex items-center justify-between">
              <Link href="/admin/formations" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</Link>
              <button
                form="formation-form"
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
              >
                {saving ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Enregistrer la formation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
