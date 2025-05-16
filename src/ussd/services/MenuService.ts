import { UssdSessionState } from "../interfaces/Menu";
import { BankAccount } from "../../banking/BankAccount";
import { Formatter } from "../utils/Formatter";
import { drawBox, drawProgressBar, drawSpinner } from "./UssdEngine";

export class MenuService {
  private menuRegistry = new Map<string, UssdMenu>();
  private sessionState: UssdSessionState;

  constructor(private account: BankAccount) {
    this.sessionState = this.initializeSessionState();
    this.registerMenus();
  }

  private initializeSessionState(): UssdSessionState {
    return {
      navigationPath: [],
      temporaryData: {
        clear: () => {
          /* implementation */
        }
      },
      getCurrentPath: () => ""
    };
  }

  private registerMenus(): void {
    this.menuRegistry.set("main", this.createMainMenu());
    // Ajouter d'autres menus ici
  }

  private createMainMenu(): UssdMenu {
    return {
      displayMessage: `Menu Principal:
1. Acheter crédit
2. Transférer argent
3. Voir solde
4. Historique
5. Quitter`,
      handleInput: (input) => {
        switch(input) {
          case '1': /* navigation */ break;
          case '2': this.handleTransfer(); break;
          case '3': this.showBalance(); break;
          case '5': process.exit(0);
        }
      }
    };
  }

  private showBalance(): void {
    const balance = Formatter.formatCurrency(this.account.getBalance());
    drawBox("Solde Actuel", [`Votre solde: ${balance}`]);
  }

  private handleTransfer(): void {
    // Implémentation du flux de transfert
  }
}
