import readlineSync from 'readline-sync';
import { MenuService } from './ussd/Menu';
import { MainMenu } from './ussd/MainMenu';
import { UI } from './ussd/UI';
import { BankAccount } from './banking/BankAccount';

class MVolaApp {
  private menuService: MenuService;
  private currentAccount: BankAccount | null = null;

  constructor() {
    // Créer un compte de test pour la démonstration
    this.currentAccount = new BankAccount('1234567890', '1234');
    const mainMenu = new MainMenu(null as any, this.currentAccount); // Initialiser avec null temporairement
    this.menuService = new MenuService(mainMenu);
    mainMenu.menuService = this.menuService; // Mettre à jour la référence
  }

  public async start(): Promise<void> {
    UI.showInfo('Bienvenue sur MVola!');

    // Demander le PIN
    const pin = readlineSync.question('Veuillez entrer votre PIN: ', {
      hideEchoBack: true,
      mask: '*'
    });

    if (!this.currentAccount?.verifyPin(pin)) {
      UI.showError('PIN incorrect. Veuillez réessayer.');
      process.exit(1);
    }

    UI.showSuccess('Connexion réussie!');

    while (true) {
      const currentMenu = this.menuService.getCurrentMenu();
      currentMenu.display();

      const input = readlineSync.question('Votre choix: ');
      this.menuService.handleInput(input);
    }
  }
}

// Démarrer l'application
const app = new MVolaApp();
app.start().catch(error => {
  UI.showError(`Une erreur est survenue: ${error.message}`);
  process.exit(1);
});
