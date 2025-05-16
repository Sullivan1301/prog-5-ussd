import readlineSync from 'readline-sync';
import { MenuService } from './ussd/Menu';
import { MainMenu } from './ussd/MainMenu';
import { UI } from './ussd/UI';
import { BankAccount } from './banking/BankAccount';
import { SessionManager, InputValidator } from './ussd/SessionManager';

class MVolaApp {
  private menuService: MenuService;
  private currentAccount: BankAccount | null = null;
  private sessionManager: SessionManager;

  constructor() {
    this.sessionManager = new SessionManager();
    this.currentAccount = new BankAccount('1234567890', '1234');
    const mainMenu = new MainMenu(null as any, this.currentAccount);
    this.menuService = new MenuService(mainMenu);
    mainMenu.menuService = this.menuService;
  }

  public async start(): Promise<void> {
    UI.showInfo('Bienvenue sur MVola!');

    let pin: string;
    do {
      pin = readlineSync.question('Veuillez entrer votre PIN: ', {
        hideEchoBack: true,
        mask: '*'
      });
    } while (!InputValidator.validatePin(pin));

    if (!this.currentAccount?.verifyPin(pin)) {
      UI.showError('PIN incorrect. Veuillez réessayer.');
      process.exit(1);
    }

    UI.showSuccess('Connexion réussie!');

    while (true) {
      if (!this.sessionManager.checkSession()) {
        break;
      }

      const currentMenu = this.menuService.getCurrentMenu();
      currentMenu.display();

      const input = readlineSync.question('Votre choix: ');
      this.sessionManager.updateActivity();
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
