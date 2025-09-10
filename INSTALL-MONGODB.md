# 🗄️ Guide d'Installation MongoDB pour E-ARONCY

## 🐳 Méthode 1 : Docker (Recommandée - Plus Simple)

### Installation avec Docker :

```bash
# 1. Installer Docker (si pas déjà fait)
# Aller sur https://www.docker.com/products/docker-desktop

# 2. Démarrer MongoDB avec Docker
docker run -d \
  --name mongodb-earoncy \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -v mongodb_data:/data/db \
  mongo:latest

# 3. Vérifier que MongoDB fonctionne
docker ps

# 4. Se connecter à MongoDB (optionnel)
docker exec -it mongodb-earoncy mongosh
```

### Commandes Docker utiles :
```bash
# Démarrer MongoDB
docker start mongodb-earoncy

# Arrêter MongoDB
docker stop mongodb-earoncy

# Voir les logs
docker logs mongodb-earoncy

# Supprimer le conteneur (attention aux données !)
docker rm mongodb-earoncy
```

## 💻 Méthode 2 : Installation Native

### Sur macOS :
```bash
# Avec Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Démarrer MongoDB
brew services start mongodb/brew/mongodb-community

# Arrêter MongoDB
brew services stop mongodb/brew/mongodb-community
```

### Sur Ubuntu/Debian :
```bash
# 1. Importer la clé GPG
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# 2. Ajouter le repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 3. Mettre à jour et installer
sudo apt-get update
sudo apt-get install -y mongodb-org

# 4. Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 5. Vérifier le statut
sudo systemctl status mongod
```

### Sur Windows :
```bash
# 1. Télécharger MongoDB Community Server
# https://www.mongodb.com/try/download/community

# 2. Installer le fichier .msi téléchargé

# 3. Démarrer MongoDB comme service Windows
# (Coché par défaut lors de l'installation)

# 4. Ou démarrer manuellement
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

### Sur CentOS/RHEL :
```bash
# 1. Créer le fichier repository
sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo << EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
EOF

# 2. Installer MongoDB
sudo yum install -y mongodb-org

# 3. Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 🔧 Configuration pour E-ARONCY

### 1. Mettre à jour .env.local :

Si vous utilisez Docker avec authentification :
```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/e-aroncy?authSource=admin
```

Si vous utilisez MongoDB sans authentification (développement) :
```env
MONGODB_URI=mongodb://localhost:27017/e-aroncy
```

### 2. Tester la connexion :
```bash
# Avec mongosh (MongoDB Shell)
mongosh "mongodb://localhost:27017/e-aroncy"

# Ou avec Docker
docker exec -it mongodb-earoncy mongosh "mongodb://localhost:27017/e-aroncy"
```

## 🚀 Démarrage Rapide E-ARONCY

Une fois MongoDB installé :

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le dossier logs
mkdir -p logs

# 3. Créer le super admin
npm run create-admin

# 4. Démarrer l'application
npm run dev
```

## 🔍 Vérification de l'Installation

### Test de connexion MongoDB :
```javascript
// test-mongodb.js
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/e-aroncy');
    console.log('✅ MongoDB connecté avec succès !');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
  }
}

testConnection();
```

```bash
# Exécuter le test
node test-mongodb.js
```

## 🛠️ Outils Utiles

### MongoDB Compass (Interface Graphique) :
- Télécharger : https://www.mongodb.com/products/compass
- Se connecter à : `mongodb://localhost:27017`

### Commandes MongoDB utiles :
```javascript
// Dans mongosh
show dbs                    // Lister les bases de données
use e-aroncy               // Utiliser la base e-aroncy
show collections           // Lister les collections
db.users.find()           // Voir tous les utilisateurs
db.users.countDocuments() // Compter les utilisateurs
```

## 🚨 Dépannage

### Problèmes courants :

1. **Port 27017 déjà utilisé :**
```bash
# Voir qui utilise le port
sudo lsof -i :27017

# Tuer le processus
sudo kill -9 <PID>
```

2. **Permissions sur macOS/Linux :**
```bash
# Créer le dossier data
sudo mkdir -p /data/db
sudo chown -R $(whoami) /data/db
```

3. **MongoDB ne démarre pas :**
```bash
# Vérifier les logs
tail -f /var/log/mongodb/mongod.log

# Ou avec Docker
docker logs mongodb-earoncy
```

4. **Erreur de connexion dans E-ARONCY :**
- Vérifier que MongoDB est démarré
- Vérifier l'URL dans `.env.local`
- Vérifier les permissions/authentification

## 📋 Checklist Installation

- [ ] MongoDB installé et démarré
- [ ] Port 27017 accessible
- [ ] `.env.local` configuré avec la bonne URL
- [ ] Test de connexion réussi
- [ ] Super admin créé (`npm run create-admin`)
- [ ] Application E-ARONCY démarrée (`npm run dev`)
- [ ] Connexion admin testée sur http://localhost:3000/login

## 🔐 Sécurité Production

Pour la production, configurez :
- [ ] Authentification MongoDB
- [ ] Chiffrement des connexions (TLS)
- [ ] Firewall pour le port 27017
- [ ] Sauvegardes automatiques
- [ ] Monitoring des performances

---

**Une fois MongoDB installé, vous pourrez utiliser E-ARONCY avec toutes ses fonctionnalités !**
