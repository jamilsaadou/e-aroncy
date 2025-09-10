const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateSessionsData() {
  console.log('🔄 Migration des données de sessions...');
  
  try {
    // Nettoyer les anciennes sessions inactives
    console.log('📝 Nettoyage des anciennes sessions...');
    const deletedCount = await prisma.userSession.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { 
            lastActivity: { 
              lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 jours
            }
          }
        ]
      }
    });
    console.log(`✅ ${deletedCount.count} anciennes sessions supprimées`);

    // Vérifier les statistiques
    const stats = await prisma.userSession.groupBy({
      by: ['isActive'],
      _count: {
        id: true
      }
    });

    console.log('📊 Statistiques des sessions:');
    stats.forEach(stat => {
      console.log(`   ${stat.isActive ? 'Actives' : 'Inactives'}: ${stat._count.id}`);
    });

    console.log('✅ Migration terminée avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour nettoyer les sessions expirées
async function cleanupExpiredSessions() {
  console.log('🧹 Nettoyage des sessions expirées...');
  
  try {
    const expiredSessions = await prisma.userSession.findMany({
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

    console.log(`📝 ${expiredSessions.length} sessions expirées trouvées`);

    for (const session of expiredSessions) {
      const sessionData = session.data;
      sessionData.revokedAt = new Date();
      sessionData.revokedBy = 'system: Nettoyage automatique';

      await prisma.userSession.update({
        where: { id: session.id },
        data: {
          isActive: false,
          data: sessionData
        }
      });
    }

    console.log(`✅ ${expiredSessions.length} sessions nettoyées`);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Fonction pour afficher les statistiques détaillées
async function showDetailedStats() {
  console.log('📊 Statistiques détaillées des sessions:');
  
  try {
    const totalSessions = await prisma.userSession.count();
    const activeSessions = await prisma.userSession.count({
      where: { isActive: true, expiresAt: { gt: new Date() } }
    });
    const expiredSessions = await prisma.userSession.count({
      where: { expiresAt: { lt: new Date() } }
    });
    const revokedSessions = await prisma.userSession.count({
      where: { isActive: false }
    });

    console.log(`   Total: ${totalSessions}`);
    console.log(`   Actives: ${activeSessions}`);
    console.log(`   Expirées: ${expiredSessions}`);
    console.log(`   Révoquées: ${revokedSessions}`);

    // Sessions par utilisateur
    const sessionsByUser = await prisma.userSession.groupBy({
      by: ['userId'],
      where: { isActive: true },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    console.log('\n👥 Top 5 utilisateurs avec le plus de sessions actives:');
    for (const userStat of sessionsByUser) {
      const user = await prisma.user.findUnique({
        where: { id: userStat.userId },
        select: { email: true, firstName: true, lastName: true }
      });
      
      if (user) {
        console.log(`   ${user.firstName} ${user.lastName} (${user.email}): ${userStat._count.id} sessions`);
      }
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'affichage des statistiques:', error);
  }
}

// Fonction principale
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'migrate':
      await migrateSessionsData();
      break;
    case 'cleanup':
      await cleanupExpiredSessions();
      break;
    case 'stats':
      await showDetailedStats();
      break;
    default:
      console.log('Usage: node migrate-sessions.js [migrate|cleanup|stats]');
      console.log('');
      console.log('Commandes disponibles:');
      console.log('  migrate  - Migrer les données de sessions');
      console.log('  cleanup  - Nettoyer les sessions expirées');
      console.log('  stats    - Afficher les statistiques détaillées');
      break;
  }
}

main().catch(console.error);
