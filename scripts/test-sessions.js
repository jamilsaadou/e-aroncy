const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Configuration de test
const TEST_USER = {
  email: 'test-sessions@example.com',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'Sessions',
  organization: 'Test Org'
};

const JWT_SECRET = process.env.JWT_SECRET || 'e-aroncy-jwt-secret-key';

// Fonction utilitaire pour créer un token JWT
function generateTestToken(user, sessionId) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    sessionId
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'e-aroncy',
    audience: 'e-aroncy-users'
  });
}

// Fonction utilitaire pour créer un utilisateur de test
async function createTestUser() {
  console.log('👤 Création de l\'utilisateur de test...');
  
  try {
    // Supprimer l'utilisateur s'il existe déjà
    await prisma.user.deleteMany({
      where: { email: TEST_USER.email }
    });

    // Créer le nouvel utilisateur
    const hashedPassword = await bcrypt.hash(TEST_USER.password, 12);
    
    const user = await prisma.user.create({
      data: {
        email: TEST_USER.email,
        password: hashedPassword,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
        organization: TEST_USER.organization,
        role: 'STUDENT',
        status: 'ACTIVE',
        emailVerified: true
      }
    });

    console.log(`✅ Utilisateur créé: ${user.email} (ID: ${user.id})`);
    return user;

  } catch (error) {
    console.error('❌ Erreur création utilisateur:', error);
    throw error;
  }
}

// Test 1: Création de session
async function testCreateSession(user) {
  console.log('\n🧪 Test 1: Création de session');
  
  try {
    const sessionId = `${user.id}_${Date.now()}_test`;
    const token = generateTestToken(user, sessionId);
    const deviceInfo = {
      browser: 'Chrome',
      os: 'Windows 10',
      device: 'Desktop'
    };

    const sessionData = {
      token,
      deviceInfo
    };

    const session = await prisma.userSession.create({
      data: {
        sessionId,
        data: sessionData,
        userId: user.id,
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Test Browser)',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isActive: true,
        lastActivity: new Date()
      }
    });

    console.log(`✅ Session créée: ${session.sessionId}`);
    return { session, token };

  } catch (error) {
    console.error('❌ Erreur création session:', error);
    throw error;
  }
}

// Test 2: Validation de session
async function testValidateSession(token) {
  console.log('\n🧪 Test 2: Validation de session');
  
  try {
    // Rechercher la session par token
    const session = await prisma.userSession.findFirst({
      where: {
        data: {
          path: ['token'],
          equals: token
        }
      },
      include: { user: true }
    });

    if (!session) {
      throw new Error('Session non trouvée');
    }

    if (!session.isActive) {
      throw new Error('Session inactive');
    }

    if (session.expiresAt < new Date()) {
      throw new Error('Session expirée');
    }

    console.log(`✅ Session valide: ${session.sessionId}`);
    console.log(`   Utilisateur: ${session.user.email}`);
    console.log(`   Expire le: ${session.expiresAt.toISOString()}`);
    
    return session;

  } catch (error) {
    console.error('❌ Erreur validation session:', error);
    throw error;
  }
}

// Test 3: Prolongation de session
async function testExtendSession(sessionId) {
  console.log('\n🧪 Test 3: Prolongation de session');
  
  try {
    const newExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h
    
    await prisma.userSession.update({
      where: { sessionId },
      data: { 
        expiresAt: newExpiresAt,
        lastActivity: new Date()
      }
    });

    console.log(`✅ Session prolongée jusqu'au: ${newExpiresAt.toISOString()}`);

  } catch (error) {
    console.error('❌ Erreur prolongation session:', error);
    throw error;
  }
}

// Test 4: Révocation de session
async function testRevokeSession(sessionId) {
  console.log('\n🧪 Test 4: Révocation de session');
  
  try {
    const session = await prisma.userSession.findUnique({
      where: { sessionId }
    });

    if (!session) {
      throw new Error('Session non trouvée');
    }

    const sessionData = session.data;
    sessionData.revokedAt = new Date();
    sessionData.revokedBy = 'test: Révocation de test';

    await prisma.userSession.update({
      where: { sessionId },
      data: {
        isActive: false,
        data: sessionData
      }
    });

    console.log(`✅ Session révoquée: ${sessionId}`);

  } catch (error) {
    console.error('❌ Erreur révocation session:', error);
    throw error;
  }
}

// Test 5: Sessions multiples
async function testMultipleSessions(user) {
  console.log('\n🧪 Test 5: Gestion de sessions multiples');
  
  try {
    const sessions = [];
    
    // Créer 3 sessions
    for (let i = 1; i <= 3; i++) {
      const sessionId = `${user.id}_${Date.now()}_multi_${i}`;
      const token = generateTestToken(user, sessionId);
      
      const sessionData = {
        token,
        deviceInfo: {
          browser: `Browser${i}`,
          os: 'Test OS',
          device: `Device${i}`
        }
      };

      const session = await prisma.userSession.create({
        data: {
          sessionId,
          data: sessionData,
          userId: user.id,
          ipAddress: `192.168.1.${i}`,
          userAgent: `TestAgent${i}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          isActive: true,
          lastActivity: new Date()
        }
      });

      sessions.push(session);
    }

    console.log(`✅ ${sessions.length} sessions créées`);

    // Récupérer toutes les sessions actives de l'utilisateur
    const activeSessions = await prisma.userSession.findMany({
      where: {
        userId: user.id,
        isActive: true,
        expiresAt: { gt: new Date() }
      },
      orderBy: { lastActivity: 'desc' }
    });

    console.log(`✅ ${activeSessions.length} sessions actives trouvées`);

    // Révoquer toutes les sessions sauf la première
    const sessionsToRevoke = activeSessions.slice(1);
    
    for (const session of sessionsToRevoke) {
      const sessionData = session.data;
      sessionData.revokedAt = new Date();
      sessionData.revokedBy = 'test: Révocation multiple';

      await prisma.userSession.update({
        where: { id: session.id },
        data: {
          isActive: false,
          data: sessionData
        }
      });
    }

    console.log(`✅ ${sessionsToRevoke.length} sessions révoquées`);

    return sessions[0]; // Retourner la session restante

  } catch (error) {
    console.error('❌ Erreur gestion sessions multiples:', error);
    throw error;
  }
}

// Test 6: Nettoyage des sessions expirées
async function testCleanupExpiredSessions() {
  console.log('\n🧪 Test 6: Nettoyage des sessions expirées');
  
  try {
    // Créer une session expirée
    const expiredSessionId = `expired_${Date.now()}`;
    const expiredToken = generateTestToken({ id: 'test' }, expiredSessionId);
    
    const expiredSessionData = {
      token: expiredToken,
      deviceInfo: { browser: 'Expired Browser' }
    };

    await prisma.userSession.create({
      data: {
        sessionId: expiredSessionId,
        data: expiredSessionData,
        userId: 'test-user-id',
        ipAddress: '127.0.0.1',
        userAgent: 'Expired Agent',
        expiresAt: new Date(Date.now() - 60 * 60 * 1000), // Expirée il y a 1h
        isActive: true,
        lastActivity: new Date(Date.now() - 60 * 60 * 1000)
      }
    }).catch(() => {}); // Ignorer les erreurs de clé étrangère

    // Nettoyer les sessions expirées
    const expiredSessions = await prisma.userSession.findMany({
      where: {
        expiresAt: { lt: new Date() },
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

    console.log(`✅ ${expiredSessions.length} sessions expirées nettoyées`);

  } catch (error) {
    console.error('❌ Erreur nettoyage sessions expirées:', error);
    throw error;
  }
}

// Test 7: Statistiques des sessions
async function testSessionStats(userId) {
  console.log('\n🧪 Test 7: Statistiques des sessions');
  
  try {
    const totalActive = await prisma.userSession.count({
      where: { userId, isActive: true, expiresAt: { gt: new Date() } }
    });
    
    const totalExpired = await prisma.userSession.count({
      where: { userId, expiresAt: { lt: new Date() } }
    });
    
    const totalRevoked = await prisma.userSession.count({
      where: { userId, isActive: false }
    });

    console.log(`✅ Statistiques pour l'utilisateur ${userId}:`);
    console.log(`   Sessions actives: ${totalActive}`);
    console.log(`   Sessions expirées: ${totalExpired}`);
    console.log(`   Sessions révoquées: ${totalRevoked}`);
    console.log(`   Total: ${totalActive + totalExpired + totalRevoked}`);

  } catch (error) {
    console.error('❌ Erreur statistiques sessions:', error);
    throw error;
  }
}

// Nettoyage après les tests
async function cleanup(userId) {
  console.log('\n🧹 Nettoyage après les tests...');
  
  try {
    // Supprimer toutes les sessions de test
    const deletedSessions = await prisma.userSession.deleteMany({
      where: { userId }
    });
    
    // Supprimer l'utilisateur de test
    await prisma.user.delete({
      where: { id: userId }
    });

    console.log(`✅ ${deletedSessions.count} sessions supprimées`);
    console.log('✅ Utilisateur de test supprimé');

  } catch (error) {
    console.error('❌ Erreur nettoyage:', error);
  }
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 Démarrage des tests du système de sessions\n');
  
  let user = null;
  
  try {
    // Créer l'utilisateur de test
    user = await createTestUser();
    
    // Test 1: Création de session
    const { session: session1, token: token1 } = await testCreateSession(user);
    
    // Test 2: Validation de session
    await testValidateSession(token1);
    
    // Test 3: Prolongation de session
    await testExtendSession(session1.sessionId);
    
    // Test 4: Révocation de session
    await testRevokeSession(session1.sessionId);
    
    // Test 5: Sessions multiples
    const remainingSession = await testMultipleSessions(user);
    
    // Test 6: Nettoyage des sessions expirées
    await testCleanupExpiredSessions();
    
    // Test 7: Statistiques des sessions
    await testSessionStats(user.id);
    
    console.log('\n🎉 Tous les tests sont passés avec succès!');

  } catch (error) {
    console.error('\n💥 Échec des tests:', error);
    process.exit(1);
  } finally {
    // Nettoyage
    if (user) {
      await cleanup(user.id);
    }
    await prisma.$disconnect();
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  createTestUser,
  testCreateSession,
  testValidateSession,
  testExtendSession,
  testRevokeSession,
  testMultipleSessions,
  testCleanupExpiredSessions,
  testSessionStats
};
