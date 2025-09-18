"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Search, Clock, Users, Award, AlertCircle, Loader } from "lucide-react";
import Header from "@/components/Header";

type KBFormation = {
  id: string;
  title: string;
  shortDescription: string;
  category: 'CYBERSECURITE' | 'SENSIBILISATION' | 'TECHNIQUE' | 'MANAGEMENT';
  level: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  duration: string;
  featuredImage?: string | null;
  modules?: Array<{ id: string; title: string; duration: number }>;
  _count?: { enrollments: number };
};

export default function KnowledgeBase() {
  const [q, setQ] = useState('');
  const [formations, setFormations] = useState<KBFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState<'ALL' | KBFormation['category']>('ALL');

  const CATEGORY_OPTIONS: Array<{ value: KBFormation['category']; label: string }> = [
    { value: 'CYBERSECURITE', label: 'Cybersécurité' },
    { value: 'SENSIBILISATION', label: 'Sensibilisation' },
    { value: 'TECHNIQUE', label: 'Technique' },
    { value: 'MANAGEMENT', label: 'Management' },
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/api/formations?status=PUBLISHED&limit=6');
        if (!res.ok) throw new Error('Impossible de charger les formations');
        const data = await res.json();
        if (!mounted) return;
        setFormations((data.formations || []) as KBFormation[]);
        const pagination = data.pagination || {};
        setPage(pagination.page || 1);
        if (pagination.pages && pagination.page) {
          setHasMore(pagination.page < pagination.pages);
        } else {
          setHasMore((data.formations || []).length === 6);
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e.message || 'Erreur de chargement');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      CYBERSECURITE: 0,
      SENSIBILISATION: 0,
      TECHNIQUE: 0,
      MANAGEMENT: 0,
    };
    formations.forEach(f => {
      counts[f.category] = (counts[f.category] || 0) + 1;
    });
    return counts;
  }, [formations]);

  const filteredFormations = useMemo(() => {
    const s = q.toLowerCase();
    return formations.filter(f => {
      const matchSearch = !q || f.title.toLowerCase().includes(s) || (f.shortDescription || '').toLowerCase().includes(s);
      const matchCategory = category === 'ALL' || f.category === category;
      return matchSearch && matchCategory;
    });
  }, [formations, q, category]);

  const loadMore = async () => {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const res = await fetch(`/api/formations?status=PUBLISHED&limit=6&page=${nextPage}`);
      if (!res.ok) throw new Error('Erreur lors du chargement des formations');
      const data = await res.json();
      const newItems: KBFormation[] = data.formations || [];
      setFormations(prev => [...prev, ...newItems]);
      const pagination = data.pagination || {};
      setPage(pagination.page || nextPage);
      if (pagination.pages && pagination.page) {
        setHasMore(pagination.page < pagination.pages);
      } else {
        setHasMore(newItems.length === 6);
      }
    } catch (e) {
      // Optionally handle
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4 mr-2" /> Base de connaissances E-ARONCY
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Formations en <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">cybersécurité</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Parcourez nos formations et développez vos compétences.
          </p>
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="block w-full pl-10 pr-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              placeholder="Rechercher des formations..."
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 text-sm">
              {filteredFormations.length} formations
            </div>
          </div>
        </div>
      </section>

      {/* Formations publiées */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Award className="h-4 w-4 mr-2" /> Programme de formation
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900">Formations disponibles</h2>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button
              onClick={() => setCategory('ALL')}
              className={`px-3 py-1.5 rounded-full text-sm border ${category === 'ALL' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
            >
              Toutes ({formations.length})
            </button>
            {CATEGORY_OPTIONS.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-3 py-1.5 rounded-full text-sm border ${category === c.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
                title={c.label}
              >
                {c.label} ({categoryCounts[c.value] || 0})
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading && (
              <div className="md:col-span-2 lg:col-span-3 text-center text-slate-500">
                <Loader className="h-6 w-6 animate-spin inline mr-2 text-blue-600" /> Chargement des formations…
              </div>
            )}
            {error && (
              <div className="md:col-span-2 lg:col-span-3 text-red-600 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 mr-2" /> {error}
              </div>
            )}
            {!loading && !error && filteredFormations.map((f) => (
              <div key={f.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative h-44 overflow-hidden">
                  <Image src={f.featuredImage || '/assets/images/vps-formation.jpeg'} alt={f.title} width={600} height={260} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 mr-2">
                      {CATEGORY_OPTIONS.find(x => x.value === f.category)?.label || f.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">{f.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{f.shortDescription}</p>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center"><Clock className="h-3 w-3 mr-1 text-blue-600" /> {f.duration}h</span>
                      <span className="inline-flex items-center"><Users className="h-3 w-3 mr-1 text-blue-600" /> {(f._count?.enrollments || 0)} inscrits</span>
                    </div>
                    <span className="inline-flex items-center"><BookOpen className="h-3 w-3 mr-1 text-blue-600" /> {(f.modules?.length || 0)} modules</span>
                  </div>
                  <Link href={`/formations/${f.id}`} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center text-sm block">Voir la formation</Link>
                </div>
              </div>
            ))}
            {!loading && !error && filteredFormations.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 text-center text-slate-500">Aucune formation trouvée.</div>
            )}
          </div>

          {/* Load more */}
          {!loading && !error && hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
              >
                {loadingMore && <Loader className="h-4 w-4 animate-spin mr-2" />} Charger plus
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer simple */}
      <footer className="bg-slate-900 text-white py-10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>&copy; 2025 E-ARONCY. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
