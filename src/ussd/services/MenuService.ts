import { UssdSessionState } from '../interfaces/Menu';
import { BankAccount } from '../../banking/BankAccount';
import { Formatter } from '../utils/Formatter';
import { drawBox } from './UssdEngine';

export class MenuService {
  private _menuRegistry = new Map<string, UssdMenu>();
  private _sessionState: UssdSessionState;

  public constructor(private readonly _account: BankAccount) {
    this._sessionState = this._initializeSessionState();
    this._registerMenus();
  }

  private _initializeSessionState(): UssdSessionState {
    return {
      navigationPath: [],
      temporaryData: {
        clear: (): void => {
          /* implementation */
        },
      },
      getCurrentPath: () => '',
    };
  }

  private _registerMenus(): void {
    this._menuRegistry.set('main', this._createMainMenu());
    // Ajouter d'autres menus ici
  }

  private _createMainMenu(): UssdMenu {
    return {
      displayMessage: `Menu Principal:
1. Acheter crédit
2. Transférer argent
3. Voir solde
4. Historique
5. Quitter`,
      handleInput: (input: string): void => {
        switch (input) {
          case '1':
            /* navigation */ break;
          case '2':
            this._handleTransfer();
            break;
          case '3':
            this._showBalance();
            break;
          case '5':
            process.exit(0);
        }
      },
    };
  }

  private _showBalance(): void {
    const balance = Formatter.formatCurrency(this._account.getBalance());
    drawBox('Solde Actuel', [`Votre solde: ${balance}`]);
  }

  private _handleTransfer(): void {
    // Implémentation du flux de transfert
  }
}
