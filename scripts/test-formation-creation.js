const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'e-aroncy-jwt-secret-key';

// Créer un token de test pour un admin
const testUser = {
  userId: 'test-admin-id',
  email: 'admin@e-aroncy.org',
  role: 'ADMIN'
};

const token = jwt.sign(testUser, JWT_SECRET, {
  expiresIn: '1h',
  issuer: 'e-aroncy',
  audience: 'e-aroncy-users'
});

console.log('Token de test généré:');
console.log(token);

// Test de création de formation
const testFormation = {
  title: "Formation Test Cybersécurité",
  description: "Une formation complète sur les bases de la cybersécurité pour les débutants",
  shortDescription: "Formation cybersécurité débutant",
  category: "CYBERSECURITE",
  level: "DEBUTANT",
  instructor: "Expert Cyber",
  duration: "4 heures",
  price: 0,
  tags: ["cybersécurité", "débutant", "sécurité"],
  prerequisites: [],
  objectives: [
    "Comprendre les bases de la cybersécurité",
    "Identifier les menaces courantes",
    "Appliquer les bonnes pratiques"
  ]
};

console.log('\nDonnées de formation de test:');
console.log(JSON.stringify(testFormation, null, 2));

console.log('\nCommande curl pour tester:');
console.log(`curl -X POST http://localhost:3000/api/formations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -d '${JSON.stringify(testFormation)}'`);
