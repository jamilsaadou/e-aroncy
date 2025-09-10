const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  console.log('🔐 Création du Super Administrateur E-ARONCY...');
  
  try {
    const email = 'me.jamilou@gmail.com';
    const password = '123456';
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('⚠️  Utilisateur déjà existant. Mise à jour des informations...');
      
      // Mettre à jour l'utilisateur existant
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'ADMIN', // Utiliser ADMIN car SUPER_ADMIN n'existe pas dans le schéma
          status: 'ACTIVE',
          emailVerified: true,
          isActive: true,
          failedLoginAttempts: 0,
          lockUntil: null,
          lastActivity: new Date()
        }
      });

      console.log('✅ Super Administrateur mis à jour avec succès!');
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   Nom: ${updatedUser.firstName} ${updatedUser.lastName}`);
      console.log(`   Rôle: ${updatedUser.role}`);
      console.log(`   Organisation: ${updatedUser.organization}`);
      
      return updatedUser;
    }

    // Créer un nouvel utilisateur
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const superAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: 'Jamil',
        lastName: 'Saadou',
        organization: 'E-ARONCY Administration',
        role: 'ADMIN', // Utiliser ADMIN car SUPER_ADMIN n'existe pas dans le schéma
        status: 'ACTIVE',
        emailVerified: true,
        isActive: true,
        twoFactorEnabled: false, // Peut être activé plus tard
        failedLoginAttempts: 0,
        lastActivity: new Date()
      }
    });

    console.log('✅ Super Administrateur créé avec succès!');
    console.log(`   ID: ${superAdmin.id}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Nom: ${superAdmin.firstName} ${superAdmin.lastName}`);
    console.log(`   Rôle: ${superAdmin.role}`);
    console.log(`   Organisation: ${superAdmin.organization}`);
    console.log(`   Mot de passe: ${password}`);
    
    console.log('\n🔑 Informations de connexion:');
    console.log(`   URL: http://localhost:3000/login`);
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${password}`);
    
    console.log('\n⚠️  IMPORTANT:');
    console.log('   - Changez le mot de passe après la première connexion');
    console.log('   - Activez la 2FA pour plus de sécurité');
    console.log('   - Ce mot de passe est temporaire et doit être modifié');

    return superAdmin;

  } catch (error) {
    console.error('❌ Erreur lors de la création du super admin:', error);
    
    if (error.code === 'P2002') {
      console.log('💡 L\'utilisateur existe déjà. Utilisez la commande update pour le modifier.');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour mettre à jour le mot de passe
async function updatePassword() {
  console.log('🔄 Mise à jour du mot de passe...');
  
  try {
    const email = 'me.jamilou@gmail.com';
    const newPassword = '123456';
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        failedLoginAttempts: 0,
        lockUntil: null
      }
    });

    console.log('✅ Mot de passe mis à jour avec succès!');
    console.log(`   Email: ${email}`);
    console.log(`   Nouveau mot de passe: ${newPassword}`);

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  }
}

// Fonction pour afficher les informations de l'admin
async function showAdminInfo() {
  console.log('📋 Informations du Super Administrateur:');
  
  try {
    const email = 'me.jamilou@gmail.com';
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        sessions: {
          where: { isActive: true },
          orderBy: { lastActivity: 'desc' }
        },
        activities: {
          orderBy: { timestamp: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      console.log('❌ Super Administrateur non trouvé');
      return;
    }

    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nom: ${user.firstName} ${user.lastName}`);
    console.log(`   Rôle: ${user.role}`);
    console.log(`   Organisation: ${user.organization}`);
    console.log(`   Statut: ${user.status}`);
    console.log(`   Email vérifié: ${user.emailVerified ? 'Oui' : 'Non'}`);
    console.log(`   2FA activé: ${user.twoFactorEnabled ? 'Oui' : 'Non'}`);
    console.log(`   Dernière connexion: ${user.lastLogin || 'Jamais'}`);
    console.log(`   Dernière activité: ${user.lastActivity}`);
    console.log(`   Sessions actives: ${user.sessions.length}`);
    
    if (user.activities.length > 0) {
      console.log('\n📝 Dernières activités:');
      user.activities.forEach(activity => {
        console.log(`   ${activity.timestamp.toISOString()} - ${activity.action}`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'affichage des informations:', error);
  }
}

// Fonction principale
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'create':
      await createSuperAdmin();
      break;
    case 'update-password':
      await updatePassword();
      break;
    case 'info':
      await showAdminInfo();
      break;
    default:
      console.log('Usage: node create-super-admin.js [create|update-password|info]');
      console.log('');
      console.log('Commandes disponibles:');
      console.log('  create          - Créer le super administrateur');
      console.log('  update-password - Mettre à jour le mot de passe');
      console.log('  info           - Afficher les informations de l\'admin');
      break;
  }
}

main().catch(console.error);
