# MVola - Application USSD

Une application de simulation de service bancaire mobile USSD, similaire à MVola, développée en TypeScript.

## 🚀 Fonctionnalités

- **Authentification sécurisée** avec PIN
- **Gestion de compte** avec solde et transactions
- **Services disponibles** :
  - Achat de crédit et offres Yas
  - Transfert d'argent (vers MVola ou compte bancaire)
  - Service de crédit et épargne
  - Retrait d'argent (agent ou ATM)
  - Consultation de solde

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm (généralement installé avec Node.js)

## 🛠️ Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Sullivan1301/prog-5-ussd.git
   cd prog-5-ussd
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## 🚀 Utilisation

1. Démarrez l'application :
   ```bash
   npm start
   ```

2. Suivez les instructions à l'écran :
   - Entrez le PIN (par défaut : 1234)
   - Naviguez dans les menus avec les numéros correspondants
   - Suivez les instructions pour chaque opération

## 🎯 Structure du Projet

```
src/
├── banking/           # Logique bancaire
│   ├── BankAccount.ts # Gestion du compte
│   └── Transaction.ts # Types de transactions
├── ussd/             # Interface USSD
│   ├── Menu.ts       # Gestion des menus
│   ├── MainMenu.ts   # Menu principal
│   ├── SubMenus.ts   # Sous-menus
│   ├── UI.ts         # Interface utilisateur
│   └── SessionManager.ts # Gestion de session
└── index.ts          # Point d'entrée
```

## 🛡️ Sécurité

- Session limitée à 5 minutes d'inactivité
- Limite de tentatives de PIN (3 essais)
- Validation des entrées utilisateur
- Gestion sécurisée des transactions

## 🧪 Tests

Pour exécuter les tests :
```bash
npm test
```

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.
