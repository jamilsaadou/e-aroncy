const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserFields() {
  try {
    console.log('🔍 Vérification des champs utilisateur...');
    
    const user = await prisma.user.findFirst();
    
    if (user) {
      console.log('✅ Champs disponibles:', Object.keys(user));
      console.log('\n📋 Exemple d\'utilisateur:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('❌ Aucun utilisateur trouvé dans la base de données');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserFields();
