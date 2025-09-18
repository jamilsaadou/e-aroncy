"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QuizTaking from '@/components/QuizTaking';

export default function QuizPage() {
  const params = useParams();
  const [nextUrl, setNextUrl] = useState<string | undefined>(undefined);
  const id = params.id as string;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const val = new URLSearchParams(window.location.search).get('next') || undefined;
      setNextUrl(val);
    }
  }, []);

  return <QuizTaking quizId={id} nextUrl={nextUrl} />;
}
