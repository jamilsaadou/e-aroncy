# 🔧 GUIDE DE RÉPARATION BASE DE DONNÉES E-ARONCY

## 🚨 PROBLÈME IDENTIFIÉ
```
The column `users.name` does not exist in the current database.
```

La base de données actuelle n'a pas la colonne `name` dans la table `users`, mais le nouveau schéma Prisma l'attend.

## 🚀 SOLUTION RAPIDE (Recommandée)

### Méthode 1: Reset complet avec Prisma
```bash
# 1. Générer le client Prisma avec le nouveau schéma
npx prisma generate

# 2. Forcer la synchronisation de la base de données
npx prisma db push --force-reset --accept-data-loss

# 3. Optionnel: Seed des données initiales
npx prisma db seed
```

### Méthode 2: Migration progressive
```bash
# 1. Créer une migration pour ajouter la colonne manquante
npx prisma migrate dev --name add_user_name_column

# 2. Appliquer la migration
npx prisma migrate deploy
```

## 🔍 DIAGNOSTIC DÉTAILLÉ

### Vérifier l'état actuel de la base de données
```bash
# Vérifier la structure de la table users
npx prisma db pull

# Voir les différences entre le schéma et la base
npx prisma migrate status

# Inspecter la base de données directement
npx prisma studio
```

### Vérifier le schéma Prisma
Le fichier `prisma/schema.prisma` doit contenir :
```prisma
model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  password              String
  name                  String    // ← Cette colonne doit être présente !
  organization          String?
  role                  Role      @default(STUDENT)
  
  // ... autres champs
  
  @@map("users")
}
```

## 🛠️ SOLUTIONS ALTERNATIVES

### Solution A: Migration manuelle SQL
```sql
-- Se connecter à la base de données et exécuter :
ALTER TABLE users ADD COLUMN name VARCHAR(255) NOT NULL DEFAULT '';

-- Optionnel: Migrer les données existantes
UPDATE users SET name = CONCAT(firstName, ' ', lastName) WHERE firstName IS NOT NULL;
```

### Solution B: Mise à jour du schéma existant
Si vous voulez garder les données existantes, modifiez temporairement le schéma :
```prisma
model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  password              String
  firstName             String    // Garder l'ancien champ
  lastName              String    // Garder l'ancien champ
  name                  String?   // Nouveau champ optionnel
  // ... autres champs
}
```

## 🔧 SCRIPT DE RÉPARATION AUTOMATIQUE

Utilisez le script fourni :
```bash
# Rendre le script exécutable
chmod +x fix-database.sh

# Lancer la réparation
./fix-database.sh
```

## ✅ VÉRIFICATIONS POST-RÉPARATION

### 1. Vérifier que Prisma fonctionne
```bash
npx prisma generate
npx prisma db pull
```

### 2. Tester la connexion à la base
```bash
# Test simple
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findMany().then(users => {
  console.log('✅ Base de données accessible');
  console.log('Utilisateurs trouvés:', users.length);
}).catch(err => {
  console.error('❌ Erreur:', err.message);
}).finally(() => prisma.$disconnect());
"
```

### 3. Vérifier l'API
```bash
# Démarrer le serveur
npm run dev

# Tester l'endpoint de login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🎯 ACTIONS RECOMMANDÉES

1. **Immédiat** : Lancez `npx prisma db push --force-reset`
2. **Vérification** : Testez la connexion sur http://localhost:3000
3. **Données** : Recréez un utilisateur admin si nécessaire
4. **Test** : Vérifiez que l'authentification fonctionne

## 📋 COMMANDES DE MAINTENANCE

### Créer un utilisateur admin
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@earoncy.org',
      password: hashedPassword,
      name: 'Administrateur E-ARONCY',
      role: 'ADMIN',
      emailVerified: true,
      isActive: true
    }
  });
  console.log('✅ Admin créé:', admin.email);
}

createAdmin().catch(console.error).finally(() => prisma.$disconnect());
"
```

### Vérifier les données
```bash
# Compter les utilisateurs
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  console.log('Nombre d\'utilisateurs:', count);
}).finally(() => prisma.$disconnect());
"
```

## 🚨 EN CAS D'ÉCHEC

Si rien ne fonctionne :

1. **Sauvegardez vos données importantes**
2. **Supprimez complètement la base de données**
3. **Recréez tout depuis le début**

```bash
# Suppression complète
rm -rf node_modules/.prisma
rm -rf prisma/migrations
npm install
npx prisma generate
npx prisma db push --force-reset
```

## 📞 SUPPORT

Si le problème persiste :
- Vérifiez les logs détaillés avec `npm run dev`
- Consultez la documentation Prisma : https://prisma.io/docs
- Vérifiez la configuration de votre base de données dans `.env`

---

**Note** : Cette réparation va synchroniser votre base de données avec le nouveau schéma Prisma que nous avons implémenté.
