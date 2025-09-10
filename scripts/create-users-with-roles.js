const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'e-aroncy-jwt-secret-key';

async function createUsersWithRoles() {
  try {
    console.log('🚀 Création des utilisateurs avec différents rôles...\n');

    // Utilisateurs à créer
    const users = [
      {
        firstName: 'Admin',
        lastName: 'System',
        email: 'admin@e-aroncy.com',
        password: 'Admin123!@#',
        role: 'ADMIN',
        organization: 'E-ARONCY Platform',
        orgType: 'INSTITUTION',
        country: 'ci',
        position: 'Administrateur Système'
      },
      {
        firstName: 'Jean',
        lastName: 'Instructor',
        email: 'instructor@e-aroncy.com',
        password: 'Instructor123!@#',
        role: 'INSTRUCTOR',
        organization: 'Centre de Formation Cyber',
        orgType: 'INSTITUTION',
        country: 'bf',
        position: 'Formateur Expert'
      },
      {
        firstName: 'Marie',
        lastName: 'Student',
        email: 'student@e-aroncy.com',
        password: 'Student123!@#',
        role: 'STUDENT',
        organization: 'ONG Sécurité Numérique',
        orgType: 'ONG',
        country: 'ne',
        position: 'Responsable IT'
      }
    ];

    const createdUsers = [];

    for (const userData of users) {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⚠️  L'utilisateur ${userData.email} existe déjà`);
        createdUsers.push(existingUser);
        continue;
      }

      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Créer l'utilisateur
      const newUser = await prisma.user.create({
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          organization: userData.organization,
          status: 'ACTIVE', // Activer directement
          emailVerified: true,
          isActive: true,
          lastActivity: new Date()
        }
      });

      console.log(`✅ Utilisateur créé: ${newUser.email} (${newUser.role})`);
      createdUsers.push(newUser);
    }

    console.log('\n� Résumé des utilisateurs créés:');
    console.log('=====================================');

    for (const user of createdUsers) {
      // Générer un token JWT pour chaque utilisateur
      const token = jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role
      }, JWT_SECRET, {
        expiresIn: '24h',
        issuer: 'e-aroncy',
        audience: 'e-aroncy-users'
      });

      console.log(`\n👤 ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rôle: ${user.role}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Token JWT: ${token}`);
    }

    console.log('\n🧪 Commandes de test pour créer une formation:');
    console.log('===============================================');

    // Générer des commandes de test pour l'admin et l'instructeur
    const adminUser = createdUsers.find(u => u.role === 'ADMIN');
    const instructorUser = createdUsers.find(u => u.role === 'INSTRUCTOR');

    if (adminUser) {
      const adminToken = jwt.sign({
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      }, JWT_SECRET, {
        expiresIn: '24h',
        issuer: 'e-aroncy',
        audience: 'e-aroncy-users'
      });

      console.log('\n🔑 Test avec ADMIN:');
      console.log(`curl -X POST http://localhost:3000/api/formations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${adminToken}" \\
  -d '{
    "title": "Formation Cybersécurité Avancée",
    "description": "Formation complète sur la cybersécurité pour les professionnels",
    "shortDescription": "Cybersécurité avancée",
    "category": "CYBERSECURITE",
    "level": "AVANCE",
    "instructor": "Expert Cybersécurité",
    "duration": "8 heures",
    "price": 0,
    "tags": ["cybersécurité", "avancé", "professionnel"],
    "prerequisites": ["Connaissances de base en informatique"],
    "objectives": ["Maîtriser les techniques avancées", "Détecter les menaces", "Mettre en place des défenses"]
  }'`);
    }

    if (instructorUser) {
      const instructorToken = jwt.sign({
        userId: instructorUser.id,
        email: instructorUser.email,
        role: instructorUser.role
      }, JWT_SECRET, {
        expiresIn: '24h',
        issuer: 'e-aroncy',
        audience: 'e-aroncy-users'
      });

      console.log('\n👨‍🏫 Test avec INSTRUCTOR:');
      console.log(`curl -X POST http://localhost:3000/api/formations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${instructorToken}" \\
  -d '{
    "title": "Sensibilisation Phishing",
    "description": "Formation de sensibilisation aux attaques de phishing",
    "shortDescription": "Anti-phishing",
    "category": "SENSIBILISATION",
    "level": "DEBUTANT",
    "instructor": "Jean Instructor",
    "duration": "2 heures",
    "price": 0,
    "tags": ["phishing", "sensibilisation", "email"],
    "prerequisites": [],
    "objectives": ["Reconnaître le phishing", "Réagir correctement", "Protéger ses données"]
  }'`);
    }

    console.log('\n✨ Utilisateurs créés avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
createUsersWithRoles();
