import readlineSync from 'readline-sync';
import { MenuService } from './ussd/Menu';
import { MainMenu } from './ussd/MainMenu';
import { UI } from './ussd/UI';
import { BankAccount } from './banking/BankAccount';
import { SessionManager, InputValidator } from './ussd/SessionManager';

class MVolaApp {
  private _menuService: MenuService;
  private _currentAccount: BankAccount | null = null;
  private _sessionManager: SessionManager;

  public constructor() {
    this._sessionManager = new SessionManager();
    this._currentAccount = new BankAccount('1234567890', '1234');
    const mainMenu = new MainMenu(null as unknown as MenuService, this._currentAccount);
    this._menuService = new MenuService(mainMenu);
    mainMenu.menuService = this._menuService;
  }

  public async start(): Promise<void> {
    UI.showInfo('Bienvenue sur MVola!');

    let pin: string;
    do {
      pin = readlineSync.question('Veuillez entrer votre PIN: ', {
        hideEchoBack: true,
        mask: '*',
      });
    } while (!InputValidator.validatePin(pin));

    if (!this._currentAccount?.verifyPin(pin)) {
      UI.showError('PIN incorrect. Veuillez réessayer.');
      process.exit(1);
    }

    UI.showSuccess('Connexion réussie!');

    let isRunning = true;
    while (isRunning) {
      if (!this._sessionManager.checkSession()) {
        isRunning = false;
        break;
      }

      const currentMenu = this._menuService.getCurrentMenu();
      currentMenu.display();

      const input = readlineSync.question('Votre choix: ');
      this._sessionManager.updateActivity();
      this._menuService.handleInput(input);
    }
  }
}

// Démarrer l'application
const app = new MVolaApp();
app.start().catch((error: Error) => {
  UI.showError(`Une erreur est survenue: ${error.message}`);
  process.exit(1);
});
