# 🔐 Système de Sessions E-ARONCY - Version Améliorée

## Vue d'ensemble

Ce système de sessions robuste et amélioré pour E-ARONCY implémente :
- **Authentification JWT** avec cookies sécurisés
- **Gestion avancée des sessions** avec base de données PostgreSQL
- **Sessions multiples** par utilisateur avec révocation sélective
- **Authentification à deux facteurs (2FA)** intégrée
- **Monitoring et logs** de sécurité complets
- **Protection contre les attaques** (brute force, CSRF, XSS)
- **Auto-save des formulaires** et synchronisation multi-onglets
- **Nettoyage automatique** des sessions expirées
- **API REST complète** pour la gestion des sessions
- **Outils de maintenance** et de monitoring

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration de l'environnement

Copiez le fichier `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

Modifiez les variables d'environnement :

```env
# Base de données PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/e-aroncy

# Clés de sécurité (CHANGEZ CES VALEURS EN PRODUCTION)
JWT_SECRET=votre-cle-jwt-super-secrete-256-bits
SESSION_SECRET=votre-cle-session-super-secrete

# Autres configurations...
```

### 3. Configurer la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Ou en développement
npx prisma migrate dev
```

### 4. Créer les dossiers de logs

```bash
mkdir -p logs
```

### 5. Démarrer l'application

```bash
npm run dev
```

## 📁 Structure des fichiers

```
src/
├── lib/
│   ├── database.ts          # Configuration Prisma/PostgreSQL
│   ├── auth.ts              # Middlewares d'authentification
│   ├── sessionManager.ts    # Gestionnaire de sessions côté client
│   ├── sessionService.ts    # Service de sessions côté serveur (NOUVEAU)
│   └── logger.ts            # Système de logs
├── models/
│   ├── User.ts              # Interfaces TypeScript
│   ├── UserSession.ts       # Interfaces sessions (NOUVEAU)
│   └── UserActivity.ts      # Interfaces activités/logs
├── components/
│   └── SessionProvider.tsx  # Provider React pour les sessions
├── app/api/auth/
│   ├── login/route.ts       # API connexion
│   ├── register/route.ts    # API inscription
│   ├── logout/route.ts      # API déconnexion
│   ├── session/route.ts     # API vérification session
│   └── sessions/route.ts    # API gestion sessions (NOUVEAU)
├── scripts/
│   ├── migrate-sessions.js  # Script de migration (NOUVEAU)
│   └── test-sessions.js     # Tests automatisés (NOUVEAU)
└── prisma/
    └── schema.prisma        # Schéma de base de données
```

## 🔧 Utilisation

### 1. Intégrer le SessionProvider

Dans votre `layout.tsx` principal :

```tsx
import { SessionProvider } from '../components/SessionProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

### 2. Utiliser le nouveau service de sessions

```tsx
import SessionService from '../lib/sessionService';

// Créer une session
const { session, token } = await SessionService.createSession(
  user, 
  ipAddress, 
  userAgent, 
  deviceInfo
);

// Valider une session
const validation = await SessionService.validateSession(token);

// Révoquer une session
await SessionService.revokeSession(sessionId, 'user', 'Déconnexion manuelle');

// Obtenir les sessions actives
const sessions = await SessionService.getUserActiveSessions(userId);
```

### 3. Utiliser les hooks de session

```tsx
import { useSession, useRequireAuth } from '../components/SessionProvider';

function Dashboard() {
  // Protéger la route
  useRequireAuth('/login');
  
  const { user, logout, isLoading } = useSession();

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Bienvenue {user?.firstName}</h1>
      <button onClick={logout}>Se déconnecter</button>
    </div>
  );
}
```

### 4. Protéger les routes par rôle

```tsx
import { useRequireRole } from '../components/SessionProvider';

function AdminPanel() {
  const { user, hasRole } = useRequireRole(['admin'], '/');
  
  if (!hasRole) return <div>Accès refusé</div>;

  return <div>Panel Admin</div>;
}
```

### 5. Formulaire de connexion

```tsx
import { useSession } from '../components/SessionProvider';

function LoginForm() {
  const { login } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required 
      />
      <button type="submit">Se connecter</button>
    </form>
  );
}
```

## 🔒 Sécurité

### Fonctionnalités de sécurité implémentées :

1. **Hachage des mots de passe** : bcrypt avec 12 rounds
2. **Protection contre le brute force** : Verrouillage après 5 tentatives
3. **Cookies sécurisés** : httpOnly, secure, sameSite
4. **Validation des mots de passe** : Complexité requise
5. **Timeout d'inactivité** : 2 heures par défaut
6. **Logs de sécurité** : Toutes les actions sont loggées
7. **2FA** : Support TOTP avec speakeasy
8. **Sessions en base de données** : Révocation immédiate possible
9. **Nettoyage automatique** : Sessions expirées supprimées
10. **Monitoring avancé** : Statistiques et alertes

### Configuration de sécurité recommandée :

```env
# Production uniquement
NODE_ENV=production
JWT_SECRET=cle-aleatoire-256-bits-minimum
SESSION_SECRET=autre-cle-aleatoire-256-bits

# Base de données sécurisée
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require

# HTTPS obligatoire en production
NEXTAUTH_URL=https://votre-domaine.com
```

## 📊 Monitoring et Logs

### Types de logs générés :

1. **Sessions** : Connexions, déconnexions, expirations, révocations
2. **Sécurité** : Tentatives d'intrusion, comptes verrouillés
3. **Erreurs** : Erreurs applicatives avec stack traces
4. **Activités** : Actions utilisateurs importantes
5. **Maintenance** : Nettoyage automatique, statistiques

### Fichiers de logs :

```
logs/
├── combined.log     # Tous les logs
├── error.log        # Erreurs uniquement
└── sessions.log     # Sessions et sécurité
```

### API de monitoring :

```bash
# Obtenir les sessions actives d'un utilisateur
GET /api/auth/sessions

# Révoquer une session spécifique
DELETE /api/auth/sessions?sessionId=SESSION_ID

# Révoquer toutes les autres sessions
DELETE /api/auth/sessions?revokeAll=true

# Prolonger la session courante
POST /api/auth/sessions
```

### Consulter les logs :

```bash
# Logs en temps réel
tail -f logs/sessions.log

# Filtrer les connexions
grep "login" logs/sessions.log

# Erreurs récentes
tail -100 logs/error.log
```

## 🧪 Tests

### Tests automatisés :

```bash
# Exécuter tous les tests de sessions
node scripts/test-sessions.js

# Tests individuels disponibles dans le script
```

### Tests manuels API :

#### Tester l'inscription :

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "organization": "Test ONG",
    "orgType": "ong",
    "country": "ci",
    "position": "Directeur"
  }'
```

#### Tester la connexion :

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

#### Tester la vérification de session :

```bash
curl -X GET http://localhost:3000/api/auth/session \
  -H "Cookie: auth-token=YOUR_TOKEN_HERE"
```

#### Tester la gestion des sessions :

```bash
# Lister les sessions actives
curl -X GET http://localhost:3000/api/auth/sessions \
  -H "Cookie: auth-token=YOUR_TOKEN_HERE"

# Révoquer une session
curl -X DELETE "http://localhost:3000/api/auth/sessions?sessionId=SESSION_ID" \
  -H "Cookie: auth-token=YOUR_TOKEN_HERE"

# Prolonger la session
curl -X POST http://localhost:3000/api/auth/sessions \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=YOUR_TOKEN_HERE" \
  -d '{"hours": 48}'
```

## 🔧 Maintenance

### Scripts de maintenance :

```bash
# Migrer les données de sessions
node scripts/migrate-sessions.js migrate

# Nettoyer les sessions expirées
node scripts/migrate-sessions.js cleanup

# Afficher les statistiques
node scripts/migrate-sessions.js stats
```

### Nettoyage automatique :

Le système nettoie automatiquement :
- Sessions expirées (après 24h d'inactivité)
- Sessions inactives (après 7 jours)
- Anciennes sessions révoquées (après 30 jours)

### Surveillance des métriques :

```bash
# Sessions actives
grep "login" logs/sessions.log | wc -l

# Tentatives d'intrusion
grep "login_failed" logs/sessions.log | wc -l

# Comptes verrouillés
grep "account_locked" logs/sessions.log

# Sessions révoquées
grep "session_revoked" logs/sessions.log | wc -l
```

### Tâches cron recommandées :

```bash
# Nettoyage quotidien des sessions expirées (à 2h du matin)
0 2 * * * cd /path/to/app && node scripts/migrate-sessions.js cleanup

# Statistiques hebdomadaires (dimanche à 6h)
0 6 * * 0 cd /path/to/app && node scripts/migrate-sessions.js stats >> logs/weekly-stats.log
```

## 🚨 Dépannage

### Problèmes courants :

1. **"Cannot connect to database"**
   - Vérifiez que PostgreSQL est démarré
   - Vérifiez l'URL de connexion dans `.env.local`
   - Testez la connexion : `npx prisma db pull`

2. **"JWT token invalid"**
   - Vérifiez que `JWT_SECRET` est défini
   - Effacez les cookies du navigateur
   - Vérifiez les logs de sessions

3. **"Session expired"**
   - Normal après 24h d'inactivité
   - Vérifiez les logs pour plus de détails
   - Utilisez l'API pour prolonger la session

4. **"Session not found"**
   - La session a peut-être été révoquée
   - Vérifiez dans la base de données
   - Reconnectez-vous

5. **Erreurs TypeScript**
   - Régénérez le client Prisma : `npx prisma generate`
   - Installez les dépendances : `npm install`

### Logs de débogage :

```bash
# Activer les logs détaillés
LOG_LEVEL=debug npm run dev

# Vérifier les erreurs récentes
tail -50 logs/error.log

# Déboguer les sessions en base
npx prisma studio
```

### Commandes de diagnostic :

```bash
# Vérifier l'état de la base de données
npx prisma db pull

# Voir les sessions actives
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.userSession.findMany({where: {isActive: true}}).then(console.log);
"

# Tester le service de sessions
node scripts/test-sessions.js
```

## 📈 Performance

### Optimisations implémentées :

1. **Index PostgreSQL** : Sur sessionId, userId, token, expiresAt
2. **Connection pooling** : Réutilisation des connexions DB avec Prisma
3. **Lazy loading** : Chargement à la demande des sessions
4. **Debouncing** : Auto-save des formulaires optimisé
5. **Nettoyage automatique** : Sessions expirées supprimées régulièrement
6. **Requêtes optimisées** : Utilisation de JSON path pour les recherches
7. **Cache de validation** : Réduction des requêtes répétitives

### Métriques recommandées :

- Temps de réponse des API auth < 200ms
- Sessions actives simultanées < 10000
- Taux d'échec de connexion < 5%
- Utilisation mémoire et CPU
- Temps de nettoyage des sessions expirées

### Monitoring de performance :

```bash
# Statistiques de performance
node scripts/migrate-sessions.js stats

# Surveiller les requêtes lentes
# (Configurer PostgreSQL pour logger les requêtes > 100ms)
```

## 🔄 Mise à jour

Pour mettre à jour le système :

1. **Sauvegardez la base de données**
   ```bash
   pg_dump your_database > backup.sql
   ```

2. **Testez en environnement de développement**
   ```bash
   npm run test
   node scripts/test-sessions.js
   ```

3. **Appliquez les migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. **Migrez les données de sessions**
   ```bash
   node scripts/migrate-sessions.js migrate
   ```

5. **Déployez les nouvelles versions**
   ```bash
   npm run build
   npm start
   ```

6. **Surveillez les logs après déploiement**
   ```bash
   tail -f logs/sessions.log
   node scripts/migrate-sessions.js stats
   ```

## 📞 Support

Pour toute question ou problème :

1. Consultez les logs d'erreur
2. Vérifiez la configuration
3. Testez avec les exemples fournis
4. Contactez l'équipe de développement

## 🆕 Nouvelles fonctionnalités

### Version améliorée (2025) :

- ✅ **Base de données PostgreSQL** avec Prisma ORM
- ✅ **Sessions multiples** par utilisateur
- ✅ **Révocation sélective** de sessions
- ✅ **API REST complète** pour la gestion des sessions
- ✅ **Service de sessions** côté serveur
- ✅ **Scripts de maintenance** automatisés
- ✅ **Tests automatisés** complets
- ✅ **Monitoring avancé** avec statistiques
- ✅ **Nettoyage automatique** des sessions expirées
- ✅ **Documentation mise à jour** avec exemples

### Prochaines améliorations :

- 🔄 Interface utilisateur pour la gestion des sessions
- 🔄 Notifications push pour les nouvelles connexions
- 🔄 Géolocalisation des sessions
- 🔄 Détection d'activité suspecte
- 🔄 Export des données de sessions
- 🔄 Intégration avec des services de monitoring externes

---

**⚠️ Important** : 
- Changez toujours les clés secrètes en production
- Utilisez HTTPS obligatoirement
- Configurez PostgreSQL avec SSL
- Surveillez régulièrement les logs de sécurité
- Effectuez des sauvegardes régulières de la base de données
