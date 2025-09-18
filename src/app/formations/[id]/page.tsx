"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, GraduationCap, User, AlertCircle, Loader, Play, BookOpen } from "lucide-react";
import { useSession } from "@/components/SessionProvider";
import { generateFormationCertificatePDF } from "@/lib/pdfGenerator";

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

type Formation = {
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
  modules: Module[];
};

const toYouTubeEmbed = (url: string): string => {
  try {
    if (!url) return '';
    const u = new URL(url);
    let id = '';
    if (u.hostname.includes('youtu.be')) {
      id = u.pathname.replace('/', '');
    } else if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/watch')) id = u.searchParams.get('v') || '';
      else if (u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2] || '';
      else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2] || '';
    }
    return id ? `https://www.youtube.com/embed/${id}` : '';
  } catch { return ''; }
};

const labelCategory = (c: string) => ({
  CYBERSECURITE: 'Cybersécurité',
  SENSIBILISATION: 'Sensibilisation',
  TECHNIQUE: 'Technique',
  MANAGEMENT: 'Management'
} as any)[c] || c;
const labelLevel = (l: string) => ({ DEBUTANT: 'Débutant', INTERMEDIAIRE: 'Intermédiaire', AVANCE: 'Avancé' } as any)[l] || l;

// Transforme un sous-ensemble Markdown en HTML simple (listes/images/liens/bold/italic)
const toSimpleHtml = (raw: string): string => {
  let text = String(raw || '');
  // Échapper les chevrons
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Images ![alt](url)
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded" />');
  // Liens [text](url)
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-blue-600 underline">$1</a>');
  // Gras **text**
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italique *text*
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Listes à puces
  text = text.replace(/(^|\n)-(.*?)(?=\n|$)/g, (m) => m.replace(/^-\s?/gm, '<li>') + '</li>');
  if (/\<li\>/.test(text)) text = text.replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside">$1</ul>');
  // Listes numérotées
  text = text.replace(/(^|\n)\d+\.\s?(.*?)(?=\n|$)/g, (m) => m.replace(/\d+\.\s?/gm, '<li>') + '</li>');
  if (/<ul/.test(text) === false && /<li>/.test(text)) text = text.replace(/(<li>.*<\/li>)/gs, '<ol class="list-decimal list-inside">$1</ol>');
  // Retours ligne
  text = text.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br/>');
  return `<p>${text}</p>`;
};

export default function FormationViewerPage() {
  const params = useParams();
  const id = params.id as string;
  const { user, isAuthenticated } = useSession();

  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState<{ completedModules: number; progressPercentage: number } | null>(null);
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, boolean>>({});
  const [certificate, setCertificate] = useState<{ certificateNumber: string; issuedAt: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Sections open/close state (initialized later when data is ready)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/formations/${id}`);
      if (!res.ok) throw new Error('Formation introuvable');
      const data = await res.json();
      setFormation(data);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) load(); }, [id]);

  const loadStatus = async () => {
    try {
      const res = await fetch(`/api/formations/${id}/enroll`, { credentials: 'include' });
      if (!res.ok) {
        setEnrolled(false); setProgress(null); setModuleStatuses({}); setCertificate(null); return;
      }
      const data = await res.json();
      setEnrolled(!!data.enrolled);
      setProgress(data.progress || null);
      const statusMap: Record<string, boolean> = {};
      (data.moduleStatuses || []).forEach((s: any) => { statusMap[s.moduleId] = !!s.completed; });
      setModuleStatuses(statusMap);
      setCertificate(data.certificate || null);
    } catch {
      // ignore
    }
  };

  useEffect(() => { if (id) loadStatus(); }, [id, isAuthenticated]);

  const enroll = async () => {
    try {
      setEnrolling(true);
      setMessage('');
      const res = await fetch(`/api/formations/${id}/enroll`, { method: 'POST', credentials: 'include' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          // Rediriger vers login avec retour
          const next = encodeURIComponent(`/formations/${id}`);
          window.location.href = `/login?next=${next}`;
          return;
        }
        throw new Error(body.error || 'Inscription impossible');
      }
      setMessage('Inscription réussie. Vous pouvez commencer les modules.');
      await loadStatus();
    } catch (e: any) {
      setMessage(e.message || 'Inscription impossible');
    } finally {
      setEnrolling(false);
    }
  };

  const startQuiz = (quizId: string, moduleId: string) => {
    // Calculer le prochain module pour redirection après soumission
    const ordered = [...(formation?.modules || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const idx = ordered.findIndex(m => m.id === moduleId);
    const nextId = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1].id : null;
    const nextUrl = nextId ? `/formations/${id}/module/${nextId}` : `/formations/${id}`;
    window.location.href = `/quiz/${quizId}?next=${encodeURIComponent(nextUrl)}`;
  };

  const markModuleCompleted = async (moduleId: string) => {
    try {
      const res = await fetch(`/api/modules/${moduleId}/progress`, { method: 'POST', credentials: 'include' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Impossible de marquer ce module');
      setMessage('Module marqué comme complété. Progression mise à jour.');
      await loadStatus();
    } catch (e: any) {
      setMessage(e.message || 'Action impossible');
    }
  };

  // Derive rendering data upfront (safe defaults keep hooks order stable)
  const modulesSorted = [...(formation?.modules || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const totalMinutes = modulesSorted.reduce((acc, m) => acc + (m.duration || 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const firstVideo = modulesSorted.find(m => m.type === 'VIDEO' && toYouTubeEmbed(m.content));
  const lastUpdated = (formation as any)?.updatedAt ? new Date((formation as any).updatedAt) : null;
  const language = (formation as any)?.language || 'fr';
  const enrollCount = (formation as any)?._count?.enrollments ?? undefined;
  const price = (formation as any)?.price ?? 0;
  const priceLabel = price && price > 0 ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price) : 'Gratuit';

  // Sections: derive from module title pattern "Section | Title"
  const parseTitle = (t: string): { section: string; pure: string } => {
    const parts = String(t || '').split('|');
    if (parts.length > 1) return { section: parts[0].trim() || 'Général', pure: parts.slice(1).join('|').trim() };
    return { section: 'Général', pure: String(t || '') };
  };
  const sections = modulesSorted.reduce((acc: { name: string; items: Module[] }[], m: any) => {
    const sectionName = (m.section && m.section.title) ? String(m.section.title) : parseTitle(m.title).section;
    const found = acc.find(s => s.name === sectionName);
    if (found) found.items.push(m); else acc.push({ name: sectionName, items: [m] });
    return acc;
  }, [] as { name: string; items: Module[] }[]);
  // Déterminer la première section incomplète (pour le verrouillage par section)
  const firstIncompleteSectionIdx = sections.findIndex(sec => sec.items.some(it => !moduleStatuses[it.id]));
  // Initialize openSections when sections list changes and state is empty
  useEffect(() => {
    if (sections.length && Object.keys(openSections).length === 0) {
      setOpenSections(Object.fromEntries(sections.map(s => [s.name, false])));
    }
  }, [sections]);
  const toggleAll = (open: boolean) => {
    const entries = sections.map((s, idx) => {
      const gated = enrolled && firstIncompleteSectionIdx >= 0 && idx > firstIncompleteSectionIdx;
      return [s.name, gated ? false : open];
    });
    setOpenSections(Object.fromEntries(entries));
  };
  const allOpen = sections.length > 0 && sections.every((s, idx) => {
    const gated = enrolled && firstIncompleteSectionIdx >= 0 && idx > firstIncompleteSectionIdx;
    return gated ? true : !!openSections[s.name];
  });

  // Early returns after all hooks are declared
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center"><Loader className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />Chargement…</div>
      </div>
    );
  }

  if (error || !formation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Link href="/formations" className="inline-flex items-center text-blue-600 mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Retour</Link>
          <div className="bg-white p-6 rounded shadow text-red-600 flex items-center"><AlertCircle className="h-5 w-5 mr-2" /> {error || 'Formation introuvable'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/formations" className="inline-flex items-center text-blue-600 mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Retour</Link>

        {/* Hero section with CTA card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{labelCategory(formation.category)}</span>
              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{labelLevel(formation.level)}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{formation.title}</h1>
            <p className="text-gray-700 text-lg mb-4">{formation.shortDescription}</p>

            <div className="text-sm text-gray-600 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center"><User className="h-4 w-4 mr-1" /> {formation.instructor}</span>
              <span className="inline-flex items-center"><Clock className="h-4 w-4 mr-1" /> {hours}h {minutes}min de contenu</span>
              <span className="inline-flex items-center"><BookOpen className="h-4 w-4 mr-1" /> {formation.modules.length} modules</span>
              {lastUpdated && (
                <span className="inline-flex items-center">Dernière mise à jour: {lastUpdated.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
              )}
              <span className="inline-flex items-center">Langue: {language}</span>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-white rounded-lg shadow p-3 lg:p-4 lg:sticky lg:top-6 h-fit">
            <div className="rounded overflow-hidden border">
              {firstVideo ? (
                <div className="relative aspect-video bg-black">
                  {previewUrl ? (
                    <iframe src={previewUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  ) : (
                    <button onClick={() => setPreviewUrl(toYouTubeEmbed(firstVideo!.content))} className="absolute inset-0 flex items-center justify-center text-white/90 hover:text-white">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border">
                        <Play className="h-8 w-8" />
                      </div>
                    </button>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">Aperçu indisponible</div>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div className="text-2xl font-bold">{priceLabel}</div>
              {!enrolled ? (
                <button onClick={enroll} disabled={enrolling} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                  {enrolling ? 'Inscription…' : 'S’inscrire gratuitement'}
                </button>
              ) : (
                <>
                  <div className="text-sm text-gray-600 flex items-center justify-between">
                    <span>Progression</span>
                    <span>{Math.round(progress?.progressPercentage || 0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                    <div className="bg-blue-600 h-2" style={{ width: `${Math.round(progress?.progressPercentage || 0)}%` }} />
                  </div>
                  {(() => {
                    const firstIncompleteIndex = modulesSorted.findIndex(m => !moduleStatuses[m.id]);
                    const resumeId = firstIncompleteIndex >= 0 ? modulesSorted[firstIncompleteIndex]?.id : modulesSorted[0]?.id;
                    const href = resumeId ? `/formations/${id}/module/${resumeId}` : `/formations/${id}`;
                    return (
                      <Link href={href} className="block text-center w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800">
                        Reprendre la formation
                      </Link>
                    );
                  })()}
                  {certificate && formation.certificateEnabled && (
                    <button
                      onClick={() => {
                        const userName = user ? `${user.firstName} ${user.lastName}` : 'Apprenant';
                        generateFormationCertificatePDF({
                          userName,
                          formationTitle: formation.title,
                          certificateNumber: certificate.certificateNumber,
                          issuedAt: certificate.issuedAt
                        });
                      }}
                      className="w-full border py-3 rounded-lg hover:bg-gray-50"
                    >
                      Télécharger l’attestation
                    </button>
                  )}
                </>
              )}

              <ul className="text-sm text-gray-700 space-y-2 border-t pt-3">
                <li>• {hours}h {minutes}min de vidéo à la demande</li>
                <li>• Accès sur mobile et TV</li>
                <li>• Certificat de réussite {formation.certificateEnabled ? 'inclus' : 'non inclus'}</li>
                <li>• Langue: {language}</li>
                {typeof enrollCount === 'number' && (
                  <li>• {enrollCount} inscrit{enrollCount > 1 ? 's' : ''}</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* What you'll learn */}
        {Array.isArray((formation as any).objectives) && (formation as any).objectives.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Ce que vous apprendrez</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(formation as any).objectives.slice(0, 10).map((obj: string, i: number) => (
                <div key={i} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700 text-sm">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {message && (
          <div className="bg-white rounded-lg shadow p-4 mb-6 text-sm">{message}</div>
        )}

        {/* Requirements & Description (moved before course content) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Prérequis</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {Array.isArray((formation as any).prerequisites) && (formation as any).prerequisites.length > 0 ? (
                (formation as any).prerequisites.map((p: string, i: number) => (<li key={i}>{p}</li>))
              ) : (
                <li>Aucune expérience préalable n’est requise.</li>
              )}
            </ul>
          </div>
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{formation.description}</div>
          </div>
        </div>

        {/* Course content with sections */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Contenu du cours</h2>
            <button type="button" onClick={() => toggleAll(!allOpen)} className="text-violet-600 hover:underline text-sm">
              {allOpen ? 'Réduire toutes les sections' : 'Développer toutes les sections'}
            </button>
          </div>
          <div className="space-y-4">
            {sections.map((sec, sidx) => {
              const secMinutes = sec.items.reduce((acc, m) => acc + (m.duration || 0), 0);
              const secHours = Math.floor(secMinutes / 60);
              const secMins = secMinutes % 60;
              const isGatedSection = enrolled && firstIncompleteSectionIdx >= 0 && sidx > firstIncompleteSectionIdx;
              const isOpen = isGatedSection ? false : !!openSections[sec.name];
              return (
                <div key={sec.name} className="border rounded-lg">
                  <button
                    onClick={() => { if (!isGatedSection) setOpenSections(prev => ({ ...prev, [sec.name]: !prev[sec.name] })); }}
                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-900">{sec.name}</span>
                    <span className="text-sm text-gray-600">{sec.items.length} session{sec.items.length > 1 ? 's' : ''} • {secHours ? `${secHours} h ` : ''}{secMins} min</span>
                  </button>
                  {isGatedSection && (
                    <div className="px-4 pb-3 text-xs text-gray-500">Complétez d'abord la section précédente pour accéder à celle‑ci.</div>
                  )}
                  {isOpen && !isGatedSection && (
                    <div className="divide-y">
                      {sec.items.map((m, idx) => {
                        const completed = moduleStatuses[m.id];
                        const firstIncompleteIndex = modulesSorted.findIndex(mm => !moduleStatuses[mm.id]);
                        const indexInAll = modulesSorted.findIndex(mm => mm.id === m.id);
                        const gated = enrolled && firstIncompleteIndex >= 0 && indexInAll > firstIncompleteIndex;
                        const { pure } = parseTitle(m.title);
                        return (
                          <div key={m.id} className="p-4">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">{indexInAll + 1}</span>
                                <h3 className="font-medium text-gray-900">{pure}</h3>
                              </div>
                              <span className="text-xs text-gray-500 inline-flex items-center"><Clock className="h-4 w-4 mr-1" /> {m.duration} min {completed ? '• Terminé' : ''}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{m.description}</p>
                            {m.type === 'VIDEO' && toYouTubeEmbed(m.content) && (
                              <div className="aspect-video w-full overflow-hidden rounded border">
                                <iframe src={toYouTubeEmbed(m.content)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen title={`Vidéo ${pure}`} />
                              </div>
                            )}
                            {(m.type === 'TEXT' || m.type === 'EXERCISE') && (
                              <div className="bg-gray-50 rounded p-3 text-sm text-gray-800">
                                <div dangerouslySetInnerHTML={{ __html: toSimpleHtml(m.content) }} />
                              </div>
                            )}
                            {m.type === 'QUIZ' && (
                              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded p-3">
                                <div className="text-sm text-gray-700">Quiz disponible pour ce module.</div>
                                {gated ? (
                                  <span className="text-xs text-gray-500">Complétez d’abord le module précédent</span>
                                ) : m.quiz?.id ? (
                                  <button onClick={() => startQuiz(m.quiz!.id, m.id)} className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"><Play className="h-4 w-4 mr-2" /> Commencer le quiz</button>
                                ) : (
                                  <span className="text-xs text-gray-500">Quiz indisponible</span>
                                )}
                              </div>
                            )}

                            <div className="mt-3 flex items-center justify-end gap-2">
                              {(m.type === 'TEXT' || m.type === 'EXERCISE' || m.type === 'VIDEO') && enrolled && !gated && (
                                <button onClick={() => markModuleCompleted(m.id)} className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Marquer comme terminé</button>
                              )}
                              {!gated && (
                                <Link href={`/formations/${id}/module/${m.id}`} className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Ouvrir</Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        
      </div>
    </div>
  );
}
