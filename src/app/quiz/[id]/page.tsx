"use client";

import { useParams, useSearchParams } from 'next/navigation';
import QuizTaking from '@/components/QuizTaking';

export default function QuizPage() {
  const params = useParams();
  const search = useSearchParams();
  const id = params.id as string;
  const nextUrl = search.get('next') || undefined;
  return <QuizTaking quizId={id} nextUrl={nextUrl} />;
}

