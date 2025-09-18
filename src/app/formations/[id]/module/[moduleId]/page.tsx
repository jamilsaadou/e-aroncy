"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, BookOpen, Play, AlertCircle } from "lucide-react";

type Module = {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'EXERCISE';
  content: string;
  order: number;
  quiz?: { id: string } | null;
};

type FormationMinimal = {
  id: string;
  title: string;
  shortDescription: string;
  duration: string;
};

const toYouTubeEmbed = (url: string): string => {
  try {
    if (!url) return '';
    const u = new URL(url);
    let id = '';
    if (u.hostname.includes('youtu.be')) id = u.pathname.replace('/', '');
    else if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/watch')) id = u.searchParams.get('v') || '';
      else if (u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2] || '';
      else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2] || '';
    }
    return id ? `https://www.youtube.com/embed/${id}` : '';
  } catch { return ''; }
};

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const formationId = params.id as string;
  const moduleId = params.moduleId as string;

  const [formation, setFormation] = useState<FormationMinimal | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, boolean>>({});

  const currentIndex = useMemo(() => {
    const ordered = [...modules].sort((a,b)=> (a.order ?? 0) - (b.order ?? 0));
    return ordered.findIndex(m => m.id === moduleId);
  }, [modules, moduleId]);

  const currentModule: Module | null = useMemo(() => {
    const ordered = [...modules].sort((a,b)=> (a.order ?? 0) - (b.order ?? 0));
    return currentIndex >= 0 ? ordered[currentIndex] : null;
  }, [modules, currentIndex]);

  const prevModuleId = useMemo(() => {
    const ordered = [...modules].sort((a,b)=> (a.order ?? 0) - (b.order ?? 0));
    return currentIndex > 0 ? ordered[currentIndex - 1].id : null;
  }, [modules, currentIndex]);

  const nextModuleId = useMemo(() => {
    const ordered = [...modules].sort((a,b)=> (a.order ?? 0) - (b.order ?? 0));
    return currentIndex >= 0 && currentIndex < ordered.length - 1 ? ordered[currentIndex + 1].id : null;
  }, [modules, currentIndex]);

  const firstIncompleteIndex = useMemo(() => {
    const ordered = [...modules].sort((a,b)=> (a.order ?? 0) - (b.order ?? 0));
    return ordered.findIndex(m => !moduleStatuses[m.id]);
  }, [modules, moduleStatuses]);

  const gated = useMemo(() => {
    if (!enrolled) return false; // l'accès est libre en lecture si pas inscrit
    if (firstIncompleteIndex === -1) return false;
    return currentIndex > firstIncompleteIndex; // bloquer les modules après le premier non complété
  }, [enrolled, firstIncompleteIndex, currentIndex]);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [fRes, mRes] = await Promise.all([
        fetch(`/api/formations/${formationId}`),
        fetch(`/api/formations/${formationId}/modules`, { credentials: 'include' })
      ]);
      if (!fRes.ok) throw new Error('Formation introuvable');
      const fData = await fRes.json();
      setFormation({ id: fData.id, title: fData.title, shortDescription: fData.shortDescription, duration: fData.duration });

      const mData = await mRes.json();
      setModules(mData || []);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadStatus = async () => {
    try {
      setStatusLoading(true);
      const res = await fetch(`/api/formations/${formationId}/enroll`, { credentials: 'include' });
      if (!res.ok) { setEnrolled(false); setModuleStatuses({}); return; }
      const data = await res.json();
      setEnrolled(!!data.enrolled);
      const map: Record<string, boolean> = {};
      (data.moduleStatuses || []).forEach((s: any) => { map[s.moduleId] = !!s.completed; });
      setModuleStatuses(map);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => { if (formationId) load(); }, [formationId]);
  useEffect(() => { if (formationId) loadStatus(); }, [formationId]);

  const startQuiz = (quizId: string) => {
    const next = nextModuleId ? `/formations/${formationId}/module/${nextModuleId}` : `/formations/${formationId}`;
    window.location.href = `/quiz/${quizId}?next=${encodeURIComponent(next)}`;
  };

  const markCompleted = async () => {
    if (!currentModule) return;
    try {
      const res = await fetch(`/api/modules/${currentModule.id}/progress`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        await loadStatus();
      }
    } catch {}
  };

  if (loading || statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">Chargement…</div>
      </div>
    );
  }

  if (error || !formation || !currentModule) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Link href={`/formations/${formationId}`} className="inline-flex items-center text-blue-600 mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Retour au cours</Link>
          <div className="bg-white p-6 rounded shadow text-red-600 flex items-center"><AlertCircle className="h-5 w-5 mr-2" /> {error || 'Module introuvable'}</div>
        </div>
      </div>
    );
  }

  const canNavigateNext = enrolled ? !!moduleStatuses[currentModule.id] : true;

  const toSimpleHtml = (raw: string): string => {
    let text = String(raw || '');
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded" />');
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-blue-600 underline">$1</a>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/(^|\n)-(.*?)(?=\n|$)/g, (m) => m.replace(/^-\s?/gm, '<li>') + '</li>');
    if (/\<li\>/.test(text)) text = text.replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside">$1</ul>');
    text = text.replace(/(^|\n)\d+\.\s?(.*?)(?=\n|$)/g, (m) => m.replace(/\d+\.\s?/gm, '<li>') + '</li>');
    if (/<ul/.test(text) === false && /<li>/.test(text)) text = text.replace(/(<li>.*<\/li>)/gs, '<ol class="list-decimal list-inside">$1</ol>');
    text = text.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br/>');
    return `<p>${text}</p>`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/formations/${formationId}`} className="inline-flex items-center text-blue-600"><ArrowLeft className="h-4 w-4 mr-2" /> Retour au cours</Link>
          <div className="text-sm text-gray-500 inline-flex items-center"><BookOpen className="h-4 w-4 mr-1" /> Module {currentIndex + 1} / {modules.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold text-gray-900">{currentModule.title}</h1>
            <span className="text-sm text-gray-500 inline-flex items-center"><Clock className="h-4 w-4 mr-1" /> {currentModule.duration} min</span>
          </div>
          <p className="text-gray-600 mb-4">{currentModule.description}</p>

          {gated && (
            <div className="mb-4 p-4 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
              Veuillez compléter d'abord le module précédent pour accéder à celui-ci.
            </div>
          )}

          {!gated && (
            <div className="space-y-4">
              {currentModule.type === 'VIDEO' && (
                <div>
                  {toYouTubeEmbed(currentModule.content) ? (
                    <div className="aspect-video w-full overflow-hidden rounded border">
                      <iframe src={toYouTubeEmbed(currentModule.content)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen title={`Vidéo ${currentModule.title}`} />
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Lien vidéo non reconnu.</div>
                  )}
                </div>
              )}

              {(currentModule.type === 'TEXT' || currentModule.type === 'EXERCISE') && (
                <div className="bg-gray-50 rounded p-4 text-gray-800 text-sm">
                  <div dangerouslySetInnerHTML={{ __html: toSimpleHtml(currentModule.content) }} />
                </div>
              )}

              {currentModule.type === 'QUIZ' && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded p-4">
                  <div className="text-sm text-gray-700">Quiz de ce module.</div>
                  {currentModule.quiz?.id ? (
                    <button onClick={() => startQuiz(currentModule.quiz!.id)} className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"><Play className="h-4 w-4 mr-2" /> Commencer le quiz</button>
                  ) : (
                    <span className="text-xs text-gray-500">Quiz indisponible</span>
                  )}
                </div>
              )}

              {enrolled && currentModule.type !== 'QUIZ' && !moduleStatuses[currentModule.id] && (
                <div className="text-right">
                  <button onClick={markCompleted} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Marquer comme terminé</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            disabled={!prevModuleId}
            onClick={() => prevModuleId && router.push(`/formations/${formationId}/module/${prevModuleId}`)}
            className={`px-4 py-2 rounded border ${prevModuleId ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            Précédent
          </button>

          <button
            disabled={!nextModuleId || (enrolled && !canNavigateNext)}
            onClick={() => nextModuleId && router.push(`/formations/${formationId}/module/${nextModuleId}`)}
            className={`px-4 py-2 rounded inline-flex items-center ${(!nextModuleId || (enrolled && !canNavigateNext)) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Suivant <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
