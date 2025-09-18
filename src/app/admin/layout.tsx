import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'e-aroncy-jwt-secret-key';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('auth-token')?.value;

  if (!token) {
    // Not authenticated → send to login
    redirect('/login');
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;

    if (!payload || (payload.role !== 'ADMIN')) {
      // Authenticated but not admin → deny
      redirect('/');
    }
  } catch {
    // Invalid token → force re-authentication
    redirect('/login');
  }

  return <>{children}</>;
}

