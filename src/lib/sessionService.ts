import { UserSession } from '@prisma/client';
import prisma from './database';
import { generateToken, verifyToken, JWTPayload } from './auth';
import { User } from '@prisma/client';

export interface SessionInfo {
  id: string;
  sessionId: string;
  deviceInfo: string;
  location: string;
  lastActivity: Date;
  isCurrentSession: boolean;
  createdAt: Date;
}

export interface DeviceInfo {
  browser?: string;
  os?: string;
  device?: string;
  platform?: string;
}

export interface SessionData {
  token: string;
  deviceInfo?: DeviceInfo;
  revokedAt?: Date;
  revokedBy?: string;
  [key: string]: any;
}

export class SessionService {
  
  // Créer une nouvelle session
  static async createSession(
    user: User,
    ipAddress: string,
    userAgent: string,
    deviceInfo?: DeviceInfo
  ): Promise<{ session: UserSession; token: string }> {
    const sessionId = `${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const token = generateToken(user, sessionId);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const sessionData: SessionData = {
      token,
      deviceInfo
    };

    const session = await prisma.userSession.create({
      data: {
        sessionId,
        data: sessionData,
        userId: user.id,
        ipAddress,
        userAgent,
        expiresAt,
        isActive: true,
        lastActivity: new Date()
      }
    });

    return { session, token };
  }

  // Valider une session
  static async validateSession(token: string): Promise<{
    isValid: boolean;
    session?: UserSession;
    user?: User;
    error?: string;
  }> {
    try {
      // Vérifier le token JWT
      const payload = verifyToken(token);
      if (!payload) {
        return { isValid: false, error: 'Token JWT invalide' };
      }

      // Rechercher la session dans la base de données par sessionId
      const session = await prisma.userSession.findFirst({
        where: {
          data: {
            path: ['token'],
            equals: token
          }
        },
        include: { user: true }
      });

      if (!session) {
        return { isValid: false, error: 'Session non trouvée' };
      }

      if (!session.isActive) {
        const sessionData = session.data as SessionData;
        const reason = sessionData.revokedBy || 'Session révoquée';
        return { isValid: false, error: reason };
      }

      if (session.expiresAt < new Date()) {
        // Marquer la session comme expirée
        await this.revokeSession(session.sessionId, 'system', 'Session expirée');
        return { isValid: false, error: 'Session expirée' };
      }

      // Vérifier l'inactivité (2 heures)
      const inactiveTime = (Date.now() - session.lastActivity.getTime()) / 1000 / 60; // minutes
      if (inactiveTime > 120) {
        await this.revokeSession(session.sessionId, 'system', 'Inactivité prolongée');
        return { isValid: false, error: 'Session expirée par inactivité' };
      }

      // Mettre à jour la dernière activité
      await this.updateSessionActivity(session.sessionId);

      return {
        isValid: true,
        session,
        user: session.user
      };

    } catch (error) {
      console.error('Erreur validation session:', error);
      return { isValid: false, error: 'Erreur de validation' };
    }
  }

  // Mettre à jour l'activité de la session
  static async updateSessionActivity(sessionId: string): Promise<void> {
    try {
      await prisma.userSession.update({
        where: { sessionId },
        data: { lastActivity: new Date() }
      });
    } catch (error) {
      console.error('Erreur mise à jour activité session:', error);
    }
  }

  // Prolonger une session
  static async extendSession(sessionId: string, hours: number = 24): Promise<boolean> {
    try {
      const newExpiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
      
      await prisma.userSession.update({
        where: { sessionId },
        data: { 
          expiresAt: newExpiresAt,
          lastActivity: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error('Erreur prolongation session:', error);
      return false;
    }
  }

  // Révoquer une session spécifique
  static async revokeSession(
    sessionId: string, 
    revokedBy: string = 'user',
    reason?: string
  ): Promise<boolean> {
    try {
      const session = await prisma.userSession.findUnique({
        where: { sessionId }
      });

      if (!session) return false;

      const sessionData = session.data as SessionData;
      sessionData.revokedAt = new Date();
      sessionData.revokedBy = `${revokedBy}${reason ? `: ${reason}` : ''}`;

      await prisma.userSession.update({
        where: { sessionId },
        data: {
          isActive: false,
          data: sessionData
        }
      });

      return true;
    } catch (error) {
      console.error('Erreur révocation session:', error);
      return false;
    }
  }

  // Révoquer toutes les sessions d'un utilisateur sauf la session courante
  static async revokeAllUserSessions(
    userId: string, 
    exceptSessionId?: string,
    revokedBy: string = 'user'
  ): Promise<number> {
    try {
      const whereClause: any = {
        userId,
        isActive: true
      };

      if (exceptSessionId) {
        whereClause.sessionId = { not: exceptSessionId };
      }

      // Récupérer toutes les sessions à révoquer
      const sessions = await prisma.userSession.findMany({
        where: whereClause
      });

      let count = 0;
      for (const session of sessions) {
        const sessionData = session.data as SessionData;
        sessionData.revokedAt = new Date();
        sessionData.revokedBy = `${revokedBy}: Révocation multiple`;

        await prisma.userSession.update({
          where: { id: session.id },
          data: {
            isActive: false,
            data: sessionData
          }
        });
        count++;
      }

      return count;
    } catch (error) {
      console.error('Erreur révocation sessions utilisateur:', error);
      return 0;
    }
  }

  // Obtenir les sessions actives d'un utilisateur
  static async getUserActiveSessions(userId: string): Promise<SessionInfo[]> {
    try {
      const sessions = await prisma.userSession.findMany({
        where: {
          userId,
          isActive: true,
          expiresAt: { gt: new Date() }
        },
        orderBy: { lastActivity: 'desc' }
      });

      return sessions.map(session => {
        const sessionData = session.data as SessionData;
        return {
          id: session.id,
          sessionId: session.sessionId,
          deviceInfo: this.parseDeviceInfo(session.userAgent, sessionData.deviceInfo),
          location: this.parseLocation(session.ipAddress),
          lastActivity: session.lastActivity,
          isCurrentSession: false, // À déterminer par l'appelant
          createdAt: session.createdAt
        };
      });

    } catch (error) {
      console.error('Erreur récupération sessions utilisateur:', error);
      return [];
    }
  }

  // Nettoyer les sessions expirées
  static async cleanupExpiredSessions(): Promise<number> {
    try {
      const sessions = await prisma.userSession.findMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { 
              lastActivity: { 
                lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 jours
              }
            }
          ],
          isActive: true
        }
      });

      let count = 0;
      for (const session of sessions) {
        const sessionData = session.data as SessionData;
        sessionData.revokedAt = new Date();
        sessionData.revokedBy = 'system: Nettoyage automatique';

        await prisma.userSession.update({
          where: { id: session.id },
          data: {
            isActive: false,
            data: sessionData
          }
        });
        count++;
      }

      return count;
    } catch (error) {
      console.error('Erreur nettoyage sessions expirées:', error);
      return 0;
    }
  }

  // Supprimer définitivement les anciennes sessions
  static async deleteOldSessions(daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      
      const result = await prisma.userSession.deleteMany({
        where: {
          OR: [
            { 
              expiresAt: { lt: cutoffDate },
              isActive: false
            },
            {
              createdAt: { lt: cutoffDate },
              isActive: false
            }
          ]
        }
      });

      return result.count;
    } catch (error) {
      console.error('Erreur suppression anciennes sessions:', error);
      return 0;
    }
  }

  // Obtenir les statistiques des sessions
  static async getSessionStats(userId?: string): Promise<{
    totalActive: number;
    totalExpired: number;
    totalRevoked: number;
    userSessions?: number;
  }> {
    try {
      const baseWhere = userId ? { userId } : {};

      const [totalActive, totalExpired, totalRevoked] = await Promise.all([
        prisma.userSession.count({
          where: { ...baseWhere, isActive: true, expiresAt: { gt: new Date() } }
        }),
        prisma.userSession.count({
          where: { ...baseWhere, expiresAt: { lt: new Date() } }
        }),
        prisma.userSession.count({
          where: { ...baseWhere, isActive: false }
        })
      ]);

      const stats: any = { totalActive, totalExpired, totalRevoked };
      
      if (userId) {
        stats.userSessions = totalActive + totalExpired + totalRevoked;
      }

      return stats;
    } catch (error) {
      console.error('Erreur statistiques sessions:', error);
      return { totalActive: 0, totalExpired: 0, totalRevoked: 0 };
    }
  }

  // Parser les informations de device
  private static parseDeviceInfo(userAgent: string, deviceInfo?: DeviceInfo): string {
    try {
      if (deviceInfo) {
        return `${deviceInfo.browser || 'Navigateur inconnu'} sur ${deviceInfo.os || 'OS inconnu'}`;
      }

      // Parser basique du User-Agent
      if (userAgent.includes('Chrome')) return 'Chrome';
      if (userAgent.includes('Firefox')) return 'Firefox';
      if (userAgent.includes('Safari')) return 'Safari';
      if (userAgent.includes('Edge')) return 'Edge';
      
      return 'Navigateur inconnu';
    } catch {
      return 'Informations indisponibles';
    }
  }

  // Parser la localisation (basique)
  private static parseLocation(ipAddress: string): string {
    // Pour une implémentation complète, utiliser un service de géolocalisation IP
    if (ipAddress === '127.0.0.1' || ipAddress === '::1') {
      return 'Local';
    }
    return 'Localisation inconnue';
  }

  // Créer un token de session temporaire pour 2FA
  static async createTempSession(
    userId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<string> {
    const tempSessionId = `temp_${userId}_${Date.now()}`;
    const tempToken = generateToken({ id: userId } as User, tempSessionId);
    
    const sessionData: SessionData = {
      token: tempToken,
      temporary: true
    };
    
    // Stocker temporairement (expire en 10 minutes)
    await prisma.userSession.create({
      data: {
        sessionId: tempSessionId,
        data: sessionData,
        userId,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        isActive: false // Pas encore active
      }
    });

    return tempToken;
  }

  // Activer une session temporaire après validation 2FA
  static async activateTempSession(tempToken: string): Promise<boolean> {
    try {
      const session = await prisma.userSession.findFirst({
        where: {
          data: {
            path: ['token'],
            equals: tempToken
          }
        }
      });

      if (!session || session.isActive || session.expiresAt < new Date()) {
        return false;
      }

      const sessionData = session.data as SessionData;
      delete sessionData.temporary;

      await prisma.userSession.update({
        where: { id: session.id },
        data: {
          isActive: true,
          data: sessionData,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
        }
      });

      return true;
    } catch (error) {
      console.error('Erreur activation session temporaire:', error);
      return false;
    }
  }
}

export default SessionService;
