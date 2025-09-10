// scripts/debug-jwt.js - Script pour diagnostiquer les problèmes JWT

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

// 1. Générer un token de test valide
function generateTestToken() {
  console.log('🎫 Génération d\'un token de test...\n');
  
  const payload = {
    userId: 'test-user-123',
    email: 'admin@e-aroncy.org',
    role: 'admin',
    sessionId: 'session-123'
  };

  const token = jwt.sign(
    {
      ...payload,
      iss: 'e-aroncy',
      aud: 'e-aroncy-users'
    },
    JWT_SECRET,
    {
      expiresIn: '24h',
      issuer: 'e-aroncy',
      audience: 'e-aroncy-users'
    }
  );

  console.log('✅ Token généré:');
  console.log(token);
  console.log('');
  console.log('📏 Longueur:', token.length);
  console.log('🔧 Parties:', token.split('.').length);
  console.log('');

  return token;
}

// 2. Tester différents formats de token
function testTokenFormats() {
  console.log('🧪 Test de différents formats de token...\n');
  
  const validToken = generateTestToken();
  
  const testCases = [
    {
      name: 'Token valide',
      token: validToken,
      expected: true
    },
    {
      name: 'Token avec Bearer prefix',
      token: `Bearer ${validToken}`,
      expected: false // Devrait être nettoyé avant vérification
    },
    {
      name: 'Token avec espaces',
      token: `  ${validToken}  `,
      expected: true // Devrait être nettoyé
    },
    {
      name: 'Token avec retours ligne',
      token: `${validToken}\n`,
      expected: true // Devrait être nettoyé
    },
    {
      name: 'Token tronqué',
      token: validToken.substring(0, 50),
      expected: false
    },
    {
      name: 'Token vide',
      token: '',
      expected: false
    },
    {
      name: 'Token null',
      token: null,
      expected: false
    },
    {
      name: 'Token undefined',
      token: undefined,
      expected: false
    },
    {
      name: 'Token avec caractères bizarres',
      token: validToken + '###',
      expected: false
    }
  ];

  testCases.forEach(testCase => {
    console.log(`\n🔍 Test: ${testCase.name}`);
    console.log(`Token: "${testCase.token}"`);
    
    try {
      // Nettoyer le token comme dans notre fonction
      let cleanToken = testCase.token;
      if (typeof cleanToken === 'string') {
        if (cleanToken.startsWith('Bearer ')) {
          cleanToken = cleanToken.substring(7);
        }
        cleanToken = cleanToken.trim().replace(/[\r\n]/g, '');
      }
      
      // Vérifier le format
      const isValidFormat = cleanToken && 
        typeof cleanToken === 'string' && 
        cleanToken.split('.').length === 3;
      
      console.log(`Format valide: ${isValidFormat}`);
      
      if (isValidFormat) {
        // Essayer de vérifier
        const decoded = jwt.verify(cleanToken, JWT_SECRET, {
          issuer: 'e-aroncy',
          audience: 'e-aroncy-users'
        });
        console.log('✅ Vérification réussie:', decoded.email);
      } else {
        console.log('❌ Format invalide');
      }
      
    } catch (error) {
      console.log('❌ Erreur:', error.message);
    }
  });
}

// 3. Simuler des requêtes avec différents headers
function testHeaderExtractions() {
  console.log('\n\n🌐 Test d\'extraction depuis différents headers...\n');
  
  const validToken = generateTestToken();
  
  const headerTests = [
    {
      name: 'Authorization: Bearer token',
      headers: {
        'authorization': `Bearer ${validToken}`
      }
    },
    {
      name: 'Authorization: token direct',
      headers: {
        'authorization': validToken
      }
    },
    {
      name: 'Cookie avec token',
      headers: {
        'cookie': `session=abc123; token=${validToken}; other=xyz`
      }
    },
    {
      name: 'X-Auth-Token header',
      headers: {
        'x-auth-token': validToken
      }
    },
    {
      name: 'Aucun header',
      headers: {}
    },
    {
      name: 'Headers vides',
      headers: {
        'authorization': '',
        'cookie': '',
        'x-auth-token': ''
      }
    }
  ];

  // Simuler extractTokenFromHeaders
  function extractToken(headers) {
    // Authorization header
    if (headers.authorization) {
      if (headers.authorization.startsWith('Bearer ')) {
        return headers.authorization.substring(7);
      }
      if (headers.authorization.length > 20 && headers.authorization.includes('.')) {
        return headers.authorization;
      }
    }

    // Cookie
    if (headers.cookie) {
      const tokenMatch = headers.cookie.match(/token=([^;]+)/);
      if (tokenMatch) {
        return tokenMatch[1];
      }
    }

    // Custom header
    if (headers['x-auth-token']) {
      return headers['x-auth-token'];
    }

    return null;
  }

  headerTests.forEach(test => {
    console.log(`\n🔍 Test: ${test.name}`);
    console.log('Headers:', JSON.stringify(test.headers, null, 2));
    
    const extractedToken = extractToken(test.headers);
    console.log('Token extrait:', extractedToken ? `${extractedToken.substring(0, 30)}...` : 'null');
    
    if (extractedToken && extractedToken === validToken) {
      console.log('✅ Extraction réussie');
    } else if (extractedToken) {
      console.log('⚠️ Token extrait mais différent');
    } else {
      console.log('❌ Aucun token extrait');
    }
  });
}

// 4. Tester avec les mêmes paramètres que l'erreur
function debugSpecificError() {
  console.log('\n\n🔍 Debug de l\'erreur spécifique...\n');
  
  // Recréer le contexte de l'erreur
  console.log('JWT_SECRET utilisé:', JWT_SECRET ? 'Défini' : 'Non défini');
  console.log('Longueur JWT_SECRET:', JWT_SECRET.length);
  
  // Simuler un token potentiellement malformé
  const malformedTokens = [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', // Header seulement
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.', // Header + point
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..signature', // Payload vide
    'not.a.jwt', // Pas du base64 valide
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0In0.signature', // Avec Bearer
    '   ' + generateTestToken() + '   ', // Avec espaces
  ];

  malformedTokens.forEach((token, index) => {
    console.log(`\n🧪 Test token malformé ${index + 1}:`);
    console.log(`Token: "${token}"`);
    console.log(`Longueur: ${token.length}`);
    console.log(`Parties: ${token.split('.').length}`);
    
    try {
      // Nettoyer comme dans notre fonction
      let cleanToken = token;
      if (cleanToken.startsWith('Bearer ')) {
        cleanToken = cleanToken.substring(7);
      }
      cleanToken = cleanToken.trim().replace(/[\r\n]/g, '');
      
      console.log(`Token nettoyé: "${cleanToken}"`);
      
      const decoded = jwt.verify(cleanToken, JWT_SECRET, {
        issuer: 'e-aroncy',
        audience: 'e-aroncy-users'
      });
      console.log('✅ Succès (inattendu):', decoded);
    } catch (error) {
      console.log(`❌ Erreur attendue: ${error.constructor.name}: ${error.message}`);
    }
  });
}

// 5. Fonction principale
function main() {
  console.log('🚀 Diagnostic JWT pour E-ARONCY\n');
  console.log('=====================================\n');
  
  try {
    generateTestToken();
    testTokenFormats();
    testHeaderExtractions();
    debugSpecificError();
    
    console.log('\n✅ Diagnostic terminé !');
    console.log('\n💡 Solutions recommandées:');
    console.log('1. Vérifiez que JWT_SECRET est bien défini');
    console.log('2. Assurez-vous que le token est extrait correctement des headers');
    console.log('3. Nettoyez le token avant vérification (espaces, Bearer prefix)');
    console.log('4. Vérifiez le format JWT avant vérification');
    console.log('5. Ajoutez des logs pour diagnostiquer le problème en production');
    
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  }
}

// Exporter pour utilisation en module ou exécuter directement
if (require.main === module) {
  main();
}

module.exports = {
  generateTestToken,
  testTokenFormats,
  testHeaderExtractions,
  debugSpecificError,
  main
};
