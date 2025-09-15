const fetch = require('node-fetch');

async function testFormationCreation() {
  try {
    const formationData = {
      title: "Formation complète ChatGPT & IA génératives",
      description: "Formation complète ChatGPT & IA génératives : Cette formation vous permettra de maîtriser les outils d'IA générative",
      shortDescription: "Formation complète ChatGPT & IA génératives : Apprenez à utiliser efficacement les outils d'IA",
      category: "SENSIBILISATION",
      level: "", // Test avec niveau vide pour vérifier la transformation
      instructor: "Ali",
      duration: "1",
      price: 0,
      language: "fr",
      tags: [],
      prerequisites: [],
      objectives: [],
      status: "DRAFT",
      featured: false,
      certificateEnabled: true,
      allowDiscussions: true
    };

    console.log('Données à envoyer:', JSON.stringify(formationData, null, 2));

    const response = await fetch('http://localhost:3000/api/formations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: En production, il faudrait un token d'authentification valide
      },
      body: JSON.stringify(formationData)
    });

    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Formation créée avec succès!');
    } else {
      console.log('❌ Erreur lors de la création de la formation');
    }

  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

testFormationCreation();
