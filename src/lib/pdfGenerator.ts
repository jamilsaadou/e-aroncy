import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface ChecklistItem {
  id: number;
  category: string;
  mesure: string;
  type: string;
  responsable: string;
  frequence: string;
  indicateur: string;
  completed?: boolean;
}

export async function generateChecklistPDF(
  checklistItems: ChecklistItem[],
  checkedItems: {[key: number]: boolean},
  organizationName?: string
) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  // Générer le code QR pour E-ARONCY
  const qrCodeDataURL = await QRCode.toDataURL('https://e-aroncy.com', {
    width: 100,
    margin: 1,
    color: {
      dark: '#6366f1', // Couleur indigo
      light: '#ffffff'
    }
  });

  // Page de couverture
  pdf.setFillColor(99, 102, 241); // Couleur indigo
  pdf.rect(0, 0, pageWidth, 60, 'F');
  
  // Logo/Titre E-ARONCY
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('E-ARONCY', margin, 35);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Plateforme collaborative pour la cybersécurité', margin, 45);
  
  // Titre du document
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Checklist opérationnelle', margin, 85);
  pdf.text('cybersécurité ONG', margin, 100);
  
  // Informations du rapport
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  pdf.text(`Date de génération: ${currentDate}`, margin, 125);
  if (organizationName) {
    pdf.text(`Organisation: ${organizationName}`, margin, 135);
  }
  
  // Statistiques
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = checklistItems.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Résumé de l\'évaluation:', margin, 155);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Mesures complétées: ${completedCount}/${totalCount} (${progressPercentage}%)`, margin, 170);
  
  const fondamentalesCount = checklistItems.filter(item => item.type === 'Fondamentale').length;
  const executablesCount = checklistItems.filter(item => item.type === 'Exécutable').length;
  const fondamentalesCompleted = checklistItems.filter(item => 
    item.type === 'Fondamentale' && checkedItems[item.id]
  ).length;
  const executablesCompleted = checklistItems.filter(item => 
    item.type === 'Exécutable' && checkedItems[item.id]
  ).length;
  
  pdf.text(`Mesures fondamentales: ${fondamentalesCompleted}/${fondamentalesCount}`, margin, 180);
  pdf.text(`Mesures exécutables: ${executablesCompleted}/${executablesCount}`, margin, 190);
  
  // Barre de progression visuelle
  const barWidth = 100;
  const barHeight = 8;
  const barX = margin;
  const barY = 200;
  
  // Fond de la barre
  pdf.setFillColor(229, 231, 235); // gray-200
  pdf.rect(barX, barY, barWidth, barHeight, 'F');
  
  // Progression
  pdf.setFillColor(34, 197, 94); // green-500
  pdf.rect(barX, barY, (barWidth * progressPercentage) / 100, barHeight, 'F');
  
  // Cadre de la barre
  pdf.setDrawColor(156, 163, 175); // gray-400
  pdf.rect(barX, barY, barWidth, barHeight);
  
  // Code QR et cachet E-ARONCY en bas de page
  const qrSize = 25;
  pdf.addImage(qrCodeDataURL, 'PNG', pageWidth - margin - qrSize, pageHeight - margin - qrSize - 10, qrSize, qrSize);
  
  // Cachet E-ARONCY
  pdf.setFontSize(8);
  pdf.setTextColor(99, 102, 241);
  pdf.text('Généré par E-ARONCY', pageWidth - margin - qrSize, pageHeight - margin - 5, { align: 'right' });
  pdf.text('© 2025 E-ARONCY. Tous droits réservés.', pageWidth - margin - qrSize, pageHeight - margin, { align: 'right' });
  
  // Nouvelle page pour les détails
  pdf.addPage();
  
  let yPosition = margin;
  
  // Titre de la section détaillée
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Détail des mesures de cybersécurité', margin, yPosition);
  yPosition += 15;
  
  // Grouper par catégorie
  const categories = [...new Set(checklistItems.map(item => item.category))];
  
  categories.forEach(category => {
    const categoryItems = checklistItems.filter(item => item.category === category);
    
    // Vérifier si on a assez de place pour la catégorie
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }
    
    // Titre de catégorie
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(99, 102, 241); // indigo
    pdf.text(category, margin, yPosition);
    yPosition += 10;
    
    categoryItems.forEach(item => {
      // Vérifier si on a assez de place pour l'item
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }
      
      const isCompleted = checkedItems[item.id];
      
      // Checkbox
      pdf.setDrawColor(0, 0, 0);
      pdf.rect(margin, yPosition - 3, 4, 4);
      
      if (isCompleted) {
        pdf.setFillColor(34, 197, 94); // green-500
        pdf.rect(margin + 0.5, yPosition - 2.5, 3, 3, 'F');
      }
      
      // Badge de type
      const badgeX = margin + 8;
      if (item.type === 'Fondamentale') {
        pdf.setFillColor(239, 68, 68); // red-500
      } else if (item.type === 'Exécutable') {
        pdf.setFillColor(59, 130, 246); // blue-500
      } else {
        pdf.setFillColor(245, 158, 11); // amber-500
      }
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      const badgeWidth = pdf.getTextWidth(item.type) + 4;
      pdf.rect(badgeX, yPosition - 4, badgeWidth, 6, 'F');
      pdf.text(item.type, badgeX + 2, yPosition);
      
      // Mesure
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', isCompleted ? 'normal' : 'bold');
      const measureText = isCompleted ? `✓ ${item.mesure}` : item.mesure;
      pdf.text(measureText, badgeX + badgeWidth + 5, yPosition);
      yPosition += 8;
      
      // Détails
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(75, 85, 99); // gray-600
      
      const details = [
        `Responsable: ${item.responsable}`,
        `Fréquence: ${item.frequence}`,
        `Indicateur: ${item.indicateur}`
      ];
      
      details.forEach(detail => {
        pdf.text(detail, margin + 10, yPosition);
        yPosition += 5;
      });
      
      yPosition += 3; // Espacement entre les items
    });
    
    yPosition += 5; // Espacement entre les catégories
  });
  
  // Ajouter le cachet et code QR sur chaque page
  const totalPages = pdf.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Code QR
    pdf.addImage(qrCodeDataURL, 'PNG', pageWidth - margin - qrSize, pageHeight - margin - qrSize - 10, qrSize, qrSize);
    
    // Cachet
    pdf.setFontSize(8);
    pdf.setTextColor(99, 102, 241);
    pdf.text('Généré par E-ARONCY', pageWidth - margin - qrSize, pageHeight - margin - 5, { align: 'right' });
    pdf.text('© 2025 E-ARONCY', pageWidth - margin - qrSize, pageHeight - margin, { align: 'right' });
    
    // Numéro de page
    pdf.setTextColor(156, 163, 175);
    pdf.text(`Page ${i}/${totalPages}`, pageWidth / 2, pageHeight - margin, { align: 'center' });
  }
  
  // Télécharger le PDF
  const fileName = organizationName 
    ? `checklist-cybersecurite-${organizationName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
    : `checklist-cybersecurite-${new Date().toISOString().split('T')[0]}.pdf`;
    
  pdf.save(fileName);
}

export async function generatePlanActionPDF() {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  
  // Générer le code QR pour E-ARONCY
  const qrCodeDataURL = await QRCode.toDataURL('https://e-aroncy.com', {
    width: 100,
    margin: 1,
    color: {
      dark: '#3b82f6', // Couleur blue
      light: '#ffffff'
    }
  });

  // Page de couverture
  pdf.setFillColor(59, 130, 246); // Couleur blue-500
  pdf.rect(0, 0, pageWidth, 80, 'F');
  
  // Logo/Titre E-ARONCY
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.text('E-ARONCY', margin, 35);
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Plateforme collaborative pour la cybersécurité', margin, 50);
  pdf.text('en Afrique de l\'Ouest et du Centre', margin, 65);
  
  // Titre du document
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Plan d\'Action Cybersécurité', margin, 105);
  pdf.text('pour les ONG', margin, 125);
  
  // Sous-titre
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(75, 85, 99);
  pdf.text('Renforcer la résilience des ONG en Afrique', margin, 145);
  pdf.text('Basé sur les frameworks NIST et CIS Controls', margin, 160);
  
  // Date de génération
  pdf.setFontSize(12);
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  pdf.text(`Date de génération: ${currentDate}`, margin, 180);
  
  // Badges des frameworks
  const badges = ['Framework NIST', 'CIS Controls', 'RGPD'];
  let badgeY = 200;
  badges.forEach((badge, index) => {
    pdf.setFillColor(59, 130, 246);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    const badgeWidth = pdf.getTextWidth(badge) + 8;
    pdf.rect(margin + (index * (badgeWidth + 5)), badgeY, badgeWidth, 8, 'F');
    pdf.text(badge, margin + (index * (badgeWidth + 5)) + 4, badgeY + 5);
  });
  
  // Code QR et copyright sur la page de couverture
  const qrSize = 30;
  pdf.addImage(qrCodeDataURL, 'PNG', pageWidth - margin - qrSize, pageHeight - margin - qrSize - 15, qrSize, qrSize);
  
  pdf.setFontSize(10);
  pdf.setTextColor(59, 130, 246);
  pdf.text('Généré par E-ARONCY', pageWidth - margin - qrSize, pageHeight - margin - 10, { align: 'right' });
  pdf.text('© 2025 E-ARONCY. Tous droits réservés.', pageWidth - margin - qrSize, pageHeight - margin - 5, { align: 'right' });
  
  // Nouvelle page pour le contenu
  pdf.addPage();
  let yPosition = margin;
  
  // Table des matières
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Table des matières', margin, yPosition);
  yPosition += 15;
  
  const tableOfContents = [
    'Introduction',
    'Objectifs stratégiques', 
    'Approche méthodologique',
    'Mesures de protection fondamentales',
    'Mesures de protection exécutables',
    'Gouvernance et conformité',
    'Protection des données personnelles',
    'Plan opérationnel résumé'
  ];
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  tableOfContents.forEach((item, index) => {
    pdf.text(`${index + 1}. ${item}`, margin + 5, yPosition);
    yPosition += 8;
  });
  
  // Introduction
  pdf.addPage();
  yPosition = margin;
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text('1. Introduction', margin, yPosition);
  yPosition += 15;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  const introText = [
    'La cybersécurité est aujourd\'hui un enjeu stratégique pour toutes les organisations,',
    'y compris les ONG. Les attaques informatiques, qu\'il s\'agisse de rançongiciels,',
    'de phishing, de malwares ou d\'intrusions ciblées, représentent un risque direct',
    'pour la continuité des activités et la protection des données sensibles des bénéficiaires.',
    '',
    'Dans ce contexte, le projet ARONCY propose un plan d\'action structuré pour',
    'renforcer la résilience des ONG en Afrique de l\'Ouest et du Centre.'
  ];
  
  introText.forEach(line => {
    pdf.text(line, margin, yPosition);
    yPosition += 6;
  });
  
  yPosition += 10;
  
  // Principes du plan
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Ce plan repose sur :', margin, yPosition);
  yPosition += 10;
  
  const principles = [
    'Les principes du cadre NIST (Identification, Protection, Détection, Intervention, Récupération)',
    'La cyberhygiène essentielle, accessible à toutes les ONG',
    'Une approche progressive et priorisée, combinant mesures fondamentales et exécutables',
    'La conformité aux normes internationales (RGPD, CIS, NIST) et aux réglementations locales'
  ];
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  principles.forEach(principle => {
    pdf.text('• ' + principle, margin + 5, yPosition);
    yPosition += 8;
  });
  
  // Ajouter plus de contenu sur les pages suivantes...
  // (Pour la démonstration, je vais ajouter quelques sections clés)
  
  // Objectifs stratégiques
  pdf.addPage();
  yPosition = margin;
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text('2. Objectifs stratégiques', margin, yPosition);
  yPosition += 15;
  
  const objectives = [
    'Protéger les données et systèmes informatiques des ONG contre toutes formes de cybermenaces',
    'Développer la cyber-hygiène du personnel, des partenaires et des bénévoles',
    'Garantir la continuité des opérations en cas d\'incident informatique',
    'Mettre en place des procédures claires et opérationnelles de gestion des incidents',
    'Favoriser une approche évolutive, adaptable à chaque ONG'
  ];
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  objectives.forEach((objective, index) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${index + 1}. `, margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(objective, margin + 8, yPosition);
    yPosition += 12;
  });
  
  // Plan opérationnel
  pdf.addPage();
  yPosition = margin;
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text('Plan opérationnel en 5 phases', margin, yPosition);
  yPosition += 20;
  
  const phases = [
    { title: 'Phase 1 - Identification', description: 'Inventaires, analyse des risques' },
    { title: 'Phase 2 - Protection fondamentale', description: 'Configurations sécurisées, gestion des accès, sensibilisation' },
    { title: 'Phase 3 - Protection avancée', description: 'AMF, correctifs automatisés, filtrage DNS, antimalware' },
    { title: 'Phase 4 - Intervention & récupération', description: 'Procédures incidents, sauvegardes isolées et tests' },
    { title: 'Phase 5 - Suivi & audit', description: 'Audit régulier, ajustements et mise à jour continue' }
  ];
  
  phases.forEach((phase, index) => {
    // Numéro de phase
    pdf.setFillColor(59, 130, 246);
    pdf.circle(margin + 5, yPosition - 2, 5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text((index + 1).toString(), margin + 5, yPosition + 1, { align: 'center' });
    
    // Titre et description
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(phase.title, margin + 15, yPosition);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(75, 85, 99);
    pdf.text(phase.description, margin + 15, yPosition + 8);
    
    yPosition += 25;
  });
  
  // Ajouter le code QR et copyright sur toutes les pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Code QR plus petit sur les pages de contenu
    const smallQrSize = 20;
    pdf.addImage(qrCodeDataURL, 'PNG', pageWidth - margin - smallQrSize, pageHeight - margin - smallQrSize - 10, smallQrSize, smallQrSize);
    
    // Copyright
    pdf.setFontSize(8);
    pdf.setTextColor(59, 130, 246);
    pdf.text('E-ARONCY', pageWidth - margin - smallQrSize, pageHeight - margin - 5, { align: 'right' });
    pdf.text('© 2025 E-ARONCY', pageWidth - margin - smallQrSize, pageHeight - margin, { align: 'right' });
    
    // Numéro de page
    pdf.setTextColor(156, 163, 175);
    pdf.text(`Page ${i}/${totalPages}`, pageWidth / 2, pageHeight - margin, { align: 'center' });
  }
  
  // Télécharger le PDF
  const fileName = `plan-action-cybersecurite-ong-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}
