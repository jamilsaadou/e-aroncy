import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requireAuth, requireRole } from '@/lib/auth';
import prisma from '@/lib/database';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  service?: string;
  type?: string;
  userId?: string;
  sessionId?: string;
  action?: string;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  severity?: string;
  details?: any;
  stack?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireRole(['ADMIN'])(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const logType = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const severity = searchParams.get('severity');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const logs: LogEntry[] = [];

    // 1. Récupérer les activités utilisateurs depuis la base de données
    const whereClause: any = {};
    
    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp.gte = new Date(startDate);
      if (endDate) whereClause.timestamp.lte = new Date(endDate);
    }

    const userActivities = await prisma.userActivity.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit * 2 // Prendre plus pour avoir assez après filtrage
    });

    // Convertir les activités utilisateurs en logs
    for (const activity of userActivities) {
      const logEntry: LogEntry = {
        timestamp: activity.timestamp.toISOString(),
        level: activity.success ? 'info' : (activity.errorMessage ? 'error' : 'warn'),
        message: activity.action,
        type: getActivityType(activity.action),
        userId: activity.userId || undefined,
        action: activity.action,
        ipAddress: activity.ipAddress || undefined,
        userAgent: activity.userAgent || undefined,
        success: activity.success,
        details: activity.details ? (typeof activity.details === 'string' ? JSON.parse(activity.details) : activity.details) : undefined,
        severity: getSeverityFromActivity(activity),
        service: 'e-aroncy-platform',
        user: activity.user || undefined
      };

      // Filtrer par type si spécifié
      if (logType !== 'all') {
        if (logType === 'error' && logEntry.level !== 'error') continue;
        if (logType === 'session' && logEntry.type !== 'session') continue;
        if (logType === 'security' && logEntry.type !== 'security') continue;
      }

      // Filtrer par sévérité si spécifiée
      if (severity && logEntry.severity !== severity) continue;

      logs.push(logEntry);
    }

    // 2. Récupérer les logs des fichiers (si ils existent)
    const logsDir = path.join(process.cwd(), 'logs');
    const logFiles = ['combined.log', 'error.log', 'sessions.log'];
    
    for (const logFile of logFiles) {
      const logPath = path.join(logsDir, logFile);
      
      try {
        const logContent = await fs.readFile(logPath, 'utf-8');
        const lines = logContent.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const logEntry: LogEntry = JSON.parse(line);
            
            // Filtrer par type si spécifié
            if (logType !== 'all') {
              if (logType === 'error' && logEntry.level !== 'error') continue;
              if (logType === 'session' && logEntry.type !== 'session') continue;
              if (logType === 'security' && logEntry.type !== 'security') continue;
            }
            
            // Filtrer par sévérité si spécifiée
            if (severity && logEntry.severity !== severity) continue;
            
            // Filtrer par date si spécifiée
            if (startDate || endDate) {
              const logDate = new Date(logEntry.timestamp);
              if (startDate && logDate < new Date(startDate)) continue;
              if (endDate && logDate > new Date(endDate)) continue;
            }
            
            logs.push(logEntry);
          } catch (parseError) {
            continue;
          }
        }
      } catch (fileError) {
        // Le fichier n'existe pas, continuer
        continue;
      }
    }

    // Trier par timestamp décroissant
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = logs.slice(startIndex, endIndex);

    // Statistiques
    const stats = {
      total: logs.length,
      errors: logs.filter(log => log.level === 'error').length,
      warnings: logs.filter(log => log.level === 'warn').length,
      security: logs.filter(log => log.type === 'security').length,
      sessions: logs.filter(log => log.type === 'session').length,
      critical: logs.filter(log => log.severity === 'critical').length,
      high: logs.filter(log => log.severity === 'high').length,
      medium: logs.filter(log => log.severity === 'medium').length,
      low: logs.filter(log => log.severity === 'low').length,
    };

    return NextResponse.json({
      success: true,
      logs: paginatedLogs,
      pagination: {
        page,
        limit,
        total: logs.length,
        totalPages: Math.ceil(logs.length / limit),
        hasNext: endIndex < logs.length,
        hasPrev: page > 1
      },
      stats
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Fonctions utilitaires
function getActivityType(action: string): string {
  if (action.includes('login') || action.includes('logout') || action.includes('session')) {
    return 'session';
  }
  if (action.includes('security') || action.includes('failed') || action.includes('blocked') || action.includes('suspicious')) {
    return 'security';
  }
  if (action.includes('error') || action.includes('failed')) {
    return 'error';
  }
  return 'info';
}

function getSeverityFromActivity(activity: any): string {
  if (!activity.success && activity.errorMessage) {
    if (activity.action.includes('brute_force') || activity.action.includes('injection')) {
      return 'critical';
    }
    if (activity.action.includes('failed_login') || activity.action.includes('suspicious')) {
      return 'high';
    }
    return 'medium';
  }
  
  if (activity.action.includes('login_failed') || activity.action.includes('timeout')) {
    return 'medium';
  }
  
  return 'low';
}

// Endpoint pour supprimer les anciens logs
export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireRole(['ADMIN'])(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const logsDir = path.join(process.cwd(), 'logs');
    const logFiles = ['combined.log', 'error.log', 'sessions.log'];
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    for (const logFile of logFiles) {
      const logPath = path.join(logsDir, logFile);
      
      try {
        const logContent = await fs.readFile(logPath, 'utf-8');
        const lines = logContent.split('\n').filter(line => line.trim());
        
        const filteredLines = lines.filter(line => {
          try {
            const logEntry = JSON.parse(line);
            const logDate = new Date(logEntry.timestamp);
            return logDate >= cutoffDate;
          } catch {
            return true; // Garder les lignes non-JSON
          }
        });
        
        await fs.writeFile(logPath, filteredLines.join('\n') + '\n');
      } catch (fileError) {
        // Le fichier n'existe pas, continuer
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Logs antérieurs à ${days} jours supprimés`
    });

  } catch (error) {
    console.error('Erreur lors de la suppression des logs:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
