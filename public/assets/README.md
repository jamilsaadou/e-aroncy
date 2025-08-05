# Assets Directory

Ce dossier contient toutes les ressources statiques de la plateforme.

## Structure

- **`images/`** - Images générales (PNG, JPG, JPEG, WebP, etc.)
  - Photos de profil
  - Images de contenu
  - Illustrations

- **`logos/`** - Logos et marques
  - Logo principal de la plateforme
  - Logos partenaires
  - Variantes de logos (couleur, monochrome, etc.)

- **`icons/`** - Icônes et fichiers SVG
  - Icônes d'interface utilisateur
  - Pictogrammes
  - Illustrations vectorielles

## Utilisation dans Next.js

Pour utiliser ces ressources dans votre application Next.js :

```jsx
// Pour une image
import Image from 'next/image'

<Image 
  src="/assets/images/mon-image.jpg" 
  alt="Description" 
  width={500} 
  height={300} 
/>

// Pour un logo
<Image 
  src="/assets/logos/logo-principal.png" 
  alt="Logo" 
  width={200} 
  height={100} 
/>

// Pour un SVG/icône
<img src="/assets/icons/mon-icone.svg" alt="Icône" />
```

## Bonnes pratiques

1. **Nommage** : Utilisez des noms descriptifs en kebab-case (ex: `logo-principal.png`)
2. **Optimisation** : Compressez les images avant de les uploader
3. **Formats** : Privilégiez WebP pour les images et SVG pour les icônes
4. **Tailles** : Fournissez plusieurs tailles si nécessaire (@1x, @2x, @3x)
