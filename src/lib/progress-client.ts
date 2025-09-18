export type ProgressEventType = 'START' | 'PROGRESS' | 'COMPLETE' | 'PASSED' | 'FAILED';

export async function emitProgressEvent(params: {
  formationId: string;
  moduleId: string;
  event: ProgressEventType;
  data?: { timeSpentSec?: number; progress?: number; score?: number };
}): Promise<boolean> {
  try {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(params)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export type GuardResult = {
  allowed: boolean;
  reasons: Array<
    | { code: 'not_enrolled'; message: string }
    | { code: 'locked_by_prereq'; message: string; unmet: Array<{ moduleId: string; title: string; requirement: string; minScore?: number }> }
    | { code: 'locked_by_drip'; message: string; availableAt: string }
  >;
};

export async function checkAccessGuard(moduleId: string): Promise<GuardResult> {
  const res = await fetch('/api/guard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ moduleId })
  });
  if (!res.ok) throw new Error('Guard error');
  return res.json();
}

