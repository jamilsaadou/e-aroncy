export interface UserSession {
  id: string;
  userId: string;
  sessionId: string;
  token: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  lastActivity: Date;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;
  revokedBy?: string;
  deviceInfo?: {
    browser?: string;
    os?: string;
    device?: string;
  };
}

export interface SessionActivity {
  sessionId: string;
  action: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  details?: any;
}

export interface ActiveSession {
  id: string;
  sessionId: string;
  deviceInfo: string;
  location: string;
  lastActivity: Date;
  isCurrentSession: boolean;
}
