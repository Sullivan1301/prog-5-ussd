# Standards de Code - MVola USSD Application

## Conventions de Nommage

### Général
- Utiliser l'anglais pour tous les noms de variables, fonctions, classes et fichiers
- Éviter les abréviations non standard
- Utiliser des noms descriptifs et explicites

### Fichiers
- Utiliser le format `kebab-case` pour les noms de fichiers
- Les fichiers de composants doivent avoir l'extension `.ts`
- Les fichiers de test doivent avoir l'extension `.test.ts`

### Variables et Fonctions
- Utiliser `camelCase` pour les variables et les fonctions
- Les variables constantes doivent utiliser `UPPER_SNAKE_CASE`
- Les paramètres de fonction peuvent commencer par un underscore (`_`) s'ils sont inutilisés

### Classes et Interfaces
- Utiliser `PascalCase` pour les noms de classes
- Les interfaces doivent être préfixées par `I` et utiliser `PascalCase`
- Les énumérations doivent utiliser `PascalCase`

### Membres de Classe
- Les membres privés doivent être préfixés par un underscore (`_`)
- Les membres publics n'ont pas de préfixe
- Les getters et setters doivent utiliser `camelCase`

## Bonnes Pratiques

### Types
- Toujours définir les types de retour des fonctions
- Éviter l'utilisation de `any`
- Utiliser des interfaces pour définir la structure des objets
- Préférer les types union aux enums quand c'est possible

### Fonctions
- Les fonctions doivent avoir une seule responsabilité
- Limiter le nombre de paramètres (max 3)
- Utiliser des paramètres nommés pour les objets complexes
- Documenter les fonctions avec des commentaires JSDoc

### Classes
- Déclarer explicitement la visibilité des membres
- Utiliser des constructeurs pour l'initialisation
- Implémenter des interfaces quand c'est approprié
- Éviter l'héritage quand la composition est possible

### Gestion des Erreurs
- Utiliser des types d'erreur spécifiques
- Gérer les erreurs de manière appropriée
- Éviter les blocs try/catch vides
- Logger les erreurs de manière appropriée

### Tests
- Écrire des tests unitaires pour chaque fonctionnalité
- Utiliser des noms descriptifs pour les tests
- Suivre le pattern AAA (Arrange, Act, Assert)
- Maintenir une bonne couverture de tests

## Outils

### ESLint
- Utiliser ESLint pour la vérification du code
- Exécuter `npm run lint` avant chaque commit
- Corriger toutes les erreurs de lint avant de soumettre du code

### Prettier
- Utiliser Prettier pour le formatage du code
- Configurer l'éditeur pour formater à la sauvegarde
- Maintenir la configuration Prettier dans le projet

### Git
- Utiliser des messages de commit descriptifs
- Suivre les conventions de commit conventionnels
- Créer des branches pour chaque fonctionnalité
- Faire des revues de code avant de merger

## CI/CD

### GitHub Actions
- Exécuter les tests automatiquement à chaque push
- Vérifier le linting à chaque pull request
- Maintenir une couverture de tests minimale
- Automatiser le déploiement quand c'est possible 