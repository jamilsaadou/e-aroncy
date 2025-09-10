const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('🔗 Connexion à PostgreSQL...');
    await prisma.$connect();
    console.log('✅ Connecté à PostgreSQL');

    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('⚠️  Un administrateur existe déjà:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Nom: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      console.log('   Utilisez ces informations pour vous connecter.');
      return;
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash('Admin123!@#', 12);

    // Créer le super admin
    const adminData = {
      email: 'admin@e-aroncy.org',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      organization: 'E-ARONCY',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      twoFactorEnabled: false
    };

    console.log('👤 Création du super administrateur...');
    const admin = await prisma.user.create({
      data: adminData
    });

    console.log('');
    console.log('🎉 SUPER ADMINISTRATEUR CRÉÉ AVEC SUCCÈS !');
    console.log('');
    console.log('📋 INFORMATIONS DE CONNEXION :');
    console.log('================================');
    console.log(`📧 Email    : admin@e-aroncy.org`);
    console.log(`🔐 Password : Admin123!@#`);
    console.log(`👤 Nom      : ${admin.firstName} ${admin.lastName}`);
    console.log(`🏢 Org      : ${admin.organization}`);
    console.log(`⭐ Rôle     : ${admin.role}`);
    console.log(`✅ Statut   : ${admin.status}`);
    console.log('================================');
    console.log('');
    console.log('🔗 URL de connexion: http://localhost:3000/login');
    console.log('');
    console.log('⚠️  IMPORTANT: Changez le mot de passe après la première connexion !');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
    
    if (error.code === 'P2002') {
      console.log('');
      console.log('ℹ️  Un utilisateur avec cet email existe déjà.');
      console.log('   Essayez de vous connecter avec:');
      console.log('   📧 Email: admin@e-aroncy.org');
      console.log('   🔐 Password: Admin123!@#');
    }
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Déconnecté de PostgreSQL');
  }
}

// Exécuter le script
createSuperAdmin();
