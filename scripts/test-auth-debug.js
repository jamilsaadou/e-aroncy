#!/usr/bin/env node

/**
 * Script de diagnostic d'authentification
 * Usage: node scripts/test-auth-debug.js
 */

const BASE_URL = 'http://localhost:3001';

// Fonction utilitaire pour faire des requêtes
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

// Test complet d'authentification
async function testAuthentication() {
  console.log('🔐 === TEST AUTHENTIFICATION COMPLET ===\n');
  
  // Étape 1: Tenter de se connecter
  console.log('1️⃣ Test de connexion...');
  const loginResult = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@e-aroncy.org',
      password: 'Admin123!@#'
    })
  });
  
  console.log('📊 Résultat login:', {
    status: loginResult.status,
    success: loginResult.ok,
    hasToken: !!loginResult.data?.token
  });
  
  if (!loginResult.ok) {
    console.log('❌ Échec de connexion:', loginResult.data);
    console.log('\n💡 Suggestions:');
    console.log('- Vérifiez que l\'utilisateur admin existe');
    console.log('- Utilisez: node scripts/create-admin.js');
    console.log('- Vérifiez la base de données');
    return;
  }
  
  const token = loginResult.data?.token;
  if (!token) {
    console.log('❌ Pas de token dans la réponse');
    return;
  }
  
  console.log('✅ Token reçu:', `${token.substring(0, 30)}...`);
  console.log('🔍 Format token:', token.split('.').length === 3 ? 'JWT valide' : 'Format invalide');
  
  // Étape 2: Vérifier le token
  console.log('\n2️⃣ Test de vérification du token...');
  const verifyResult = await makeRequest(`${BASE_URL}/api/auth/verify`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  console.log('📊 Résultat vérification:', {
    status: verifyResult.status,
    valid: verifyResult.data?.valid,
    user: verifyResult.data?.user?.email
  });
  
  if (!verifyResult.ok) {
    console.log('❌ Token invalide:', verifyResult.data);
    return;
  }
  
  console.log('✅ Token valide pour:', verifyResult.data.user.email);
  
  // Étape 3: Tester la route publish avec debug
  console.log('\n3️⃣ Test de publication avec debug...');
  const testArticleId = '123e4567-e89b-12d3-a456-426614174000';
  
  const publishResult = await makeRequest(`${BASE_URL}/api/articles/${testArticleId}/publish`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  console.log('📊 Résultat publication:', {
    status: publishResult.status,
    success: publishResult.data?.success,
    message: publishResult.data?.message,
    debug: publishResult.data?.debug
  });
  
  if (publishResult.ok) {
    console.log('✅ Authentification fonctionne !');
    console.log('🎯 Debug info:', publishResult.data.debug);
  } else {
    console.log('❌ Problème d\'authentification:', publishResult.data);
  }
  
  // Étape 4: Tests avec différents formats de headers
  console.log('\n4️⃣ Test avec X-Auth-Token header...');
  const altHeaderResult = await makeRequest(`${BASE_URL}/api/articles/${testArticleId}/publish`, {
    method: 'POST',
    headers: {
      'X-Auth-Token': token
    }
  });
  
  console.log('📊 Résultat X-Auth-Token:', {
    status: altHeaderResult.status,
    success: altHeaderResult.data?.success
  });
  
  // Étape 5: Test sans token
  console.log('\n5️⃣ Test sans token (doit échouer)...');
  const noTokenResult = await makeRequest(`${BASE_URL}/api/articles/${testArticleId}/publish`, {
    method: 'POST'
  });
  
  console.log('📊 Résultat sans token:', {
    status: noTokenResult.status,
    error: noTokenResult.data?.error,
    debug: noTokenResult.data?.debug
  });
  
  // Résumé
  console.log('\n🎉 === RÉSUMÉ DU DIAGNOSTIC ===');
  console.log(`✅ Login: ${loginResult.ok ? 'OK' : 'ÉCHEC'}`);
  console.log(`✅ Token: ${token ? 'REÇU' : 'MANQUANT'}`);
  console.log(`✅ Vérification: ${verifyResult.ok ? 'OK' : 'ÉCHEC'}`);
  console.log(`✅ Publication: ${publishResult.ok ? 'OK' : 'ÉCHEC'}`);
  console.log(`✅ Alt Header: ${altHeaderResult.ok ? 'OK' : 'ÉCHEC'}`);
  console.log(`✅ Sans Token: ${!noTokenResult.ok ? 'OK (échec attendu)' : 'PROBLÈME'}`);
  
  if (loginResult.ok && verifyResult.ok && publishResult.ok) {
    console.log('\n🎯 DIAGNOSTIC: L\'authentification fonctionne correctement !');
    console.log('💡 Le problème vient probablement du frontend qui n\'envoie pas le token.');
  } else {
    console.log('\n🚨 DIAGNOSTIC: Problème d\'authentification côté serveur.');
    console.log('💡 Vérifiez les logs serveur pour plus de détails.');
  }
}

// Fonction pour tester avec un token hardcodé
async function testWithHardcodedToken() {
  console.log('\n🧪 === TEST AVEC TOKEN HARDCODÉ ===');
  
  // Générer un token de test (vous devrez remplacer par un vrai token)
  const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.TEST.SIGNATURE";
  
  console.log('⚠️  Utilisez un vrai token généré par votre système');
  console.log('💡 Copiez un token depuis les logs de connexion');
}

// Exécuter les tests
console.log('🚀 Démarrage du diagnostic d\'authentification...\n');

testAuthentication()
  .then(() => {
    console.log('\n✅ Diagnostic terminé !');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Vérifiez les logs serveur dans le terminal Next.js');
    console.log('2. Si l\'auth serveur fonctionne, vérifiez le frontend');
    console.log('3. Utilisez les DevTools pour voir les headers envoyés');
  })
  .catch(console.error);
