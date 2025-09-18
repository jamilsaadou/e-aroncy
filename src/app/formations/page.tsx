"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GraduationCap, Search, Users, Clock, BookOpen, AlertCircle, Loader } from "lucide-react";

type Formation = {
  id: string;
  title: string;
  shortDescription: string;
  category: 'CYBERSECURITE' | 'SENSIBILISATION' | 'TECHNIQUE' | 'MANAGEMENT';
  level: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  duration: string; // heures string
  _count?: { enrollments: number };
  modules?: Array<{ id: string }>
};

const labelCategory = (c: string) => ({
  CYBERSECURITE: 'Cybersécurité',
  SENSIBILISATION: 'Sensibilisation',
  TECHNIQUE: 'Technique',
  MANAGEMENT: 'Management'
} as any)[c] || c;

const labelLevel = (l: string) => ({
  DEBUTANT: 'Débutant',
  INTERMEDIAIRE: 'Intermédiaire',
  AVANCE: 'Avancé'
} as any)[l] || l;

export default function PublicFormationsPage() {
  const [items, setItems] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      params.set('status', 'PUBLISHED');
      params.set('limit', '50');
      const res = await fetch(`/api/formations?${params.toString()}`);
      if (!res.ok) throw new Error('Impossible de charger les formations');
      const data = await res.json();
      setItems(data.formations || []);
    } catch (e: any) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return items.filter(f => {
      const okQ = !q || f.title.toLowerCase().includes(q.toLowerCase()) || (f.shortDescription || '').toLowerCase().includes(q.toLowerCase());
      const okC = category === 'all' || f.category === category;
      const okL = level === 'all' || f.level === level;
      return okQ && okC && okL;
    });
  }, [items, q, category, level]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center"><GraduationCap className="h-6 w-6 text-blue-600 mr-2" /> Formations</h1>
            <p className="text-gray-600">Explorez nos cours et démarrez votre parcours.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={e => setQ(e.target.value)} className="w-full pl-9 pr-3 py-2 border rounded" placeholder="Rechercher une formation…" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded px-3 py-2">
            <option value="all">Toutes catégories</option>
            <option value="CYBERSECURITE">Cybersécurité</option>
            <option value="SENSIBILISATION">Sensibilisation</option>
            <option value="TECHNIQUE">Technique</option>
            <option value="MANAGEMENT">Management</option>
          </select>
          <select value={level} onChange={e => setLevel(e.target.value)} className="border rounded px-3 py-2">
            <option value="all">Tous niveaux</option>
            <option value="DEBUTANT">Débutant</option>
            <option value="INTERMEDIAIRE">Intermédiaire</option>
            <option value="AVANCE">Avancé</option>
          </select>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow p-10 text-center"><Loader className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />Chargement…</div>
        )}
        {error && (
          <div className="bg-white rounded-lg shadow p-4 text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-2" /> {error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(f => (
            <div key={f.id} className="bg-white rounded-lg shadow p-6 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{labelCategory(f.category)}</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{labelLevel(f.level)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">{f.shortDescription}</p>
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  <span className="inline-flex items-center"><Clock className="h-4 w-4 mr-1" /> {f.duration}h</span>
                  <span className="inline-flex items-center"><Users className="h-4 w-4 mr-1" /> {(f._count?.enrollments || 0)} inscrits</span>
                  <span className="inline-flex items-center"><BookOpen className="h-4 w-4 mr-1" /> {(f.modules?.length || 0)} modules</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Link href={`/formations/${f.id}`} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Voir</Link>
              </div>
            </div>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-500">Aucune formation trouvée.</div>
        )}
      </div>
    </div>
  );
}

