import winston from 'winston';

// Configuration du logger Winston
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'e-aroncy-auth' },
  transports: [
    // Logs d'erreur dans un fichier séparé
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Tous les logs dans un fichier général
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 10
    }),
    
    // Logs de session dans un fichier dédié
    new winston.transports.File({ 
      filename: 'logs/sessions.log',
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 7
    })
  ],
});

// En développement, ajouter les logs dans la console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;

// Types pour les logs structurés
export interface SessionLogData {
  userId?: string;
  sessionId?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  duration?: number;
  details?: any;
  errorMessage?: string;
}

export interface SecurityLogData {
  userId?: string;
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ipAddress?: string;
  userAgent?: string;
  details?: any;
  blocked?: boolean;
}

// Fonctions utilitaires pour les logs
export const logSession = (data: SessionLogData) => {
  logger.info('SESSION_EVENT', {
    type: 'session',
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const logSecurity = (data: SecurityLogData) => {
  const level = data.severity === 'critical' ? 'error' : 
                data.severity === 'high' ? 'warn' : 'info';
  
  logger[level]('SECURITY_EVENT', {
    type: 'security',
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const logError = (error: Error, context?: any) => {
  logger.error('APPLICATION_ERROR', {
    type: 'error',
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

export const logInfo = (message: string, data?: any) => {
  logger.info(message, {
    type: 'info',
    data,
    timestamp: new Date().toISOString()
  });
};
