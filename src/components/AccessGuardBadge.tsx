"use client";
import React, { useEffect, useState } from 'react';
import { Lock, LockOpen, PlayCircle, Info } from 'lucide-react';
import { checkAccessGuard, emitProgressEvent } from '@/lib/progress-client';

export default function AccessGuardBadge({
  moduleId,
  formationId,
  onStart,
}: {
  moduleId: string;
  formationId: string;
  onStart?: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState<boolean>(false);
  const [reasons, setReasons] = useState<any[]>([]);
  const [starting, setStarting] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await checkAccessGuard(moduleId);
      setAllowed(res.allowed);
      setReasons(res.reasons || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  const start = async () => {
    setStarting(true);
    try {
      const ok = await emitProgressEvent({
        formationId,
        moduleId,
        event: 'START',
      });
      if (ok) onStart?.();
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs">Chargement…</div>
    );
  }

  if (allowed) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
          <LockOpen className="h-3 w-3 mr-1" /> Disponible
        </span>
        <button
          onClick={start}
          disabled={starting}
          className="inline-flex items-center px-3 py-1.5 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 disabled:opacity-50"
        >
          <PlayCircle className="h-4 w-4 mr-1" /> {starting ? 'Démarrage…' : 'Commencer'}
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-800 text-xs">
        <Lock className="h-3 w-3 mr-1" /> Verrouillé
      </span>
      <div className="text-xs text-gray-600 flex items-center gap-1">
        <Info className="h-3 w-3" />
        {reasons.map((r, idx) => {
          if (r.code === 'not_enrolled') return <span key={idx}>Non inscrit</span>;
          if (r.code === 'locked_by_drip') return <span key={idx}>Disponible le {new Date(r.availableAt).toLocaleString()}</span>;
          if (r.code === 'locked_by_prereq') return (
            <span key={idx}>
              Prérequis: {r.unmet.map((u: any) => `${u.title}${u.requirement === 'MIN_SCORE' ? ` (≥ ${u.minScore}%)` : ''}`).join(', ')}
            </span>
          );
          return null;
        })}
      </div>
    </div>
  );
}

