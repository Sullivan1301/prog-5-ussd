# Application USSD Bancaire

Une application terminal simulant un service USSD bancaire, écrite en TypeScript.

## Fonctionnalités

- Consultation du solde
- Dépôt d'argent
- Retrait d'argent (sécurisé par code PIN)
- Transfert entre comptes (sécurisé par code PIN)
- Historique des transactions (sécurisé par code PIN)
- Interface utilisateur avec barres de progression et effets visuels
- Timeout de session après 5 secondes d'inactivité

## Prérequis

- Node.js (v20 ou supérieur)
- npm ou yarn

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-nom/ussd-banking-app.git
cd ussd-banking-app

# Installer les dépendances
npm install
# ou
yarn install
```

## Utilisation

```bash
# Démarrer l'application
npm start
# ou
yarn start
```

## Développement

### Scripts disponibles

```bash
# Lancer l'application en mode développement
npm run dev

# Exécuter les tests
npm test

# Exécuter les tests en mode watch
npm run test:watch

# Vérifier le code avec ESLint
npm run lint

# Corriger automatiquement les erreurs de style
npm run lint:fix
```

### Conventions de code

#### Nommage

- **Variables et fonctions** : camelCase
  ```typescript
  const userAccount = new BankAccount();
  function calculateBalance() {}
  ```

- **Classes et Interfaces** : PascalCase
  ```typescript
  class BankAccount {}
  interface Transaction {}
  ```

- **Constantes** : UPPER_SNAKE_CASE
  ```typescript
  const MAX_ATTEMPTS = 3;
  ```

- **Membres privés** : camelCase avec underscore préfixé
  ```typescript
  private _balance: number;
  ```

#### Style de code

- Indentation : 4 espaces
- Guillemets : simples ('')
- Point-virgule : obligatoire
- Types : explicites
- Accessibilité des membres : explicite (public/private)

#### Structure des fichiers

```
src/
├── __tests__/          # Tests unitaires
├── models/            # Classes et interfaces
├── services/          # Services métier
├── utils/             # Fonctions utilitaires
└── BankAccount.ts           # Point d'entrée
```

### Tests

Les tests sont écrits avec Jest et doivent être placés dans le dossier `__tests__` ou avoir l'extension `.test.ts` ou `.spec.ts`.

```typescript
describe('BankAccount', () => {
    it('should create a new account', () => {
        // Test code
    });
});
```

### Intégration Continue

Le projet utilise GitHub Actions pour l'intégration continue. À chaque push sur la branche principale :

1. Le linter (ESLint) vérifie le style du code
2. Les tests unitaires sont exécutés
3. Les rapports de couverture sont générés

## Code PIN par défaut

Le code PIN par défaut pour toutes les opérations sécurisées est : `1234`

## Navigation

- Utilisez les numéros (1-6) pour naviguer dans le menu principal
- Utilisez `0` pour revenir au menu principal depuis n'importe quel sous-menu
- La session expire automatiquement après 5 secondes d'inactivité

## Licence

MIT
