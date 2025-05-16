import { IMenu, MenuService } from './Menu';
import { UI } from './UI';
import { BankAccount } from '../banking/BankAccount';
import { InputValidator } from './SessionManager';
import readlineSync from 'readline-sync';

export class BuyCreditMenu implements IMenu {
  private readonly _options = ['Acheter crédit', 'Offre Yas', 'Retour'];

  public constructor(
    private readonly _menuService: MenuService,
    private readonly _account: BankAccount
  ) {}

  public get message(): string {
    return 'Acheter crédit ou Offre Yas';
  }

  public getOptions(): string[] {
    return this._options;
  }

  public handleInput(input: string): void {
    const choice = parseInt(input, 10);

    if (isNaN(choice) || choice < 1 || choice > this._options.length) {
      UI.showError('Option invalide. Veuillez réessayer.');
      return;
    }

    switch (choice) {
      case 1:
        this._buyCredit();
        break;
      case 2:
        this._buyYasOffer();
        break;
      case 3:
        this._menuService.goBack();
        break;
    }
  }

  private async _buyCredit(): Promise<void> {
    let amount: number;
    do {
      amount = readlineSync.questionInt('Entrez le montant à acheter: ');
    } while (!InputValidator.validateAmount(amount));

    try {
      await UI.drawSpinner('Achat en cours...', 2000);
      this._account.deposit(amount);
      UI.showSuccess(`Crédit de ${UI.formatAmount(amount)} acheté avec succès!`);
    } catch (error) {
      UI.showError("Erreur lors de l'achat du crédit.");
    }
  }

  private async _buyYasOffer(): Promise<void> {
    const offers = [
      'Offre 1: 1000 Ar - 1 Go',
      'Offre 2: 2000 Ar - 2 Go',
      'Offre 3: 5000 Ar - 5 Go',
    ];

    UI.drawBox('Offres Yas disponibles', offers);
    let choice: number;
    do {
      choice = readlineSync.questionInt('Choisissez une offre (1-3): ');
    } while (choice < 1 || choice > 3);

    try {
      await UI.drawSpinner("Activation de l'offre...", 2000);
      const amount = choice * 1000;
      this._account.deposit(amount);
      UI.showSuccess(`Offre Yas de ${UI.formatAmount(amount)} activée avec succès!`);
    } catch (error) {
      UI.showError("Erreur lors de l'activation de l'offre.");
    }
  }

  public display(): void {
    UI.drawBox(
      this.message,
      this._options.map((opt, index) => `${index + 1}. ${opt}`)
    );
  }
}

export class TransferMenu implements IMenu {
  private readonly _options = ['Vers un numéro MVola', 'Vers un compte bancaire', 'Retour'];

  public constructor(
    private readonly _menuService: MenuService,
    private readonly _account: BankAccount
  ) {}

  public get message(): string {
    return 'Transférer argent';
  }

  public getOptions(): string[] {
    return this._options;
  }

  public handleInput(input: string): void {
    const choice = parseInt(input, 10);

    if (isNaN(choice) || choice < 1 || choice > this._options.length) {
      UI.showError('Option invalide. Veuillez réessayer.');
      return;
    }

    switch (choice) {
      case 1:
        this._transferToMvola();
        break;
      case 2:
        this._transferToBank();
        break;
      case 3:
        this._menuService.goBack();
        break;
    }
  }

  private async _transferToMvola(): Promise<void> {
    let recipient: string;
    do {
      recipient = readlineSync.question('Numéro MVola du destinataire: ');
    } while (!InputValidator.validatePhoneNumber(recipient));

    let amount: number;
    do {
      amount = readlineSync.questionInt('Montant à transférer: ');
    } while (!InputValidator.validateAmount(amount));

    try {
      await UI.drawSpinner('Transfert en cours...', 2000);
      this._account.transfer(amount, recipient);
      UI.showSuccess(`Transfert de ${UI.formatAmount(amount)} effectué avec succès!`);
    } catch (error) {
      UI.showError('Erreur lors du transfert.');
    }
  }

  private async _transferToBank(): Promise<void> {
    let accountNumber: string;
    do {
      accountNumber = readlineSync.question('Numéro de compte bancaire: ');
    } while (!InputValidator.validateAccountNumber(accountNumber));

    let amount: number;
    do {
      amount = readlineSync.questionInt('Montant à transférer: ');
    } while (!InputValidator.validateAmount(amount));

    try {
      await UI.drawSpinner('Transfert en cours...', 2000);
      this._account.transfer(amount, accountNumber);
      UI.showSuccess(`Transfert de ${UI.formatAmount(amount)} effectué avec succès!`);
    } catch (error) {
      UI.showError('Erreur lors du transfert.');
    }
  }

  public display(): void {
    UI.drawBox(
      this.message,
      this._options.map((opt, index) => `${index + 1}. ${opt}`)
    );
  }
}

export class MvolaCreditMenu implements IMenu {
  private readonly _options = [
    'Demander un crédit',
    'Rembourser un crédit',
    'Voir mes crédits',
    'Retour',
  ];

  public constructor(
    private readonly _menuService: MenuService,
    private readonly _account: BankAccount
  ) {}

  public get message(): string {
    return 'Mvola Credit ou Epargne';
  }

  public getOptions(): string[] {
    return this._options;
  }

  public handleInput(input: string): void {
    const choice = parseInt(input, 10);

    if (isNaN(choice) || choice < 1 || choice > this._options.length) {
      UI.showError('Option invalide. Veuillez réessayer.');
      return;
    }

    switch (choice) {
      case 1:
        this._requestCredit();
        break;
      case 2:
        this._repayCredit();
        break;
      case 3:
        this._viewCredits();
        break;
      case 4:
        this._menuService.goBack();
        break;
    }
  }

  private async _requestCredit(): Promise<void> {
    let amount: number;
    do {
      amount = readlineSync.questionInt('Montant du crédit souhaité: ');
    } while (!InputValidator.validateAmount(amount));

    try {
      await UI.drawSpinner('Demande de crédit en cours...', 2000);
      this._account.deposit(amount);
      UI.showSuccess(`Crédit de ${UI.formatAmount(amount)} accordé avec succès!`);
    } catch (error) {
      UI.showError('Erreur lors de la demande de crédit.');
    }
  }

  private async _repayCredit(): Promise<void> {
    let amount: number;
    do {
      amount = readlineSync.questionInt('Montant à rembourser: ');
    } while (!InputValidator.validateAmount(amount));

    try {
      await UI.drawSpinner('Remboursement en cours...', 2000);
      this._account.withdraw(amount);
      UI.showSuccess(`Remboursement de ${UI.formatAmount(amount)} effectué avec succès!`);
    } catch (error) {
      UI.showError('Erreur lors du remboursement.');
    }
  }

  private _viewCredits(): void {
    const balance = this._account.getBalance();
    UI.showInfo(`Solde actuel: ${UI.formatAmount(balance)}`);
  }

  public display(): void {
    UI.drawBox(
      this.message,
      this._options.map((opt, index) => `${index + 1}. ${opt}`)
    );
  }
}

export class WithdrawMenu implements IMenu {
  private readonly _options = ['Retrait chez un agent', 'Retrait à un ATM', 'Retour'];

  public constructor(
    private readonly _menuService: MenuService,
    private readonly _account: BankAccount
  ) {}

  public get message(): string {
    return 'Retrait argent';
  }

  public getOptions(): string[] {
    return this._options;
  }

  public handleInput(input: string): void {
    const choice = parseInt(input, 10);

    if (isNaN(choice) || choice < 1 || choice > this._options.length) {
      UI.showError('Option invalide. Veuillez réessayer.');
      return;
    }

    switch (choice) {
      case 1:
        this._withdrawFromAgent();
        break;
      case 2:
        this._withdrawFromATM();
        break;
      case 3:
        this._menuService.goBack();
        break;
    }
  }

  private async _withdrawFromAgent(): Promise<void> {
    let amount: number;
    do {
      amount = readlineSync.questionInt('Montant à retirer: ');
    } while (!InputValidator.validateAmount(amount));

    try {
      await UI.drawSpinner('Retrait en cours...', 2000);
      this._account.withdraw(amount);
      UI.showSuccess(`Retrait de ${UI.formatAmount(amount)} effectué avec succès!`);
    } catch (error) {
      UI.showError('Erreur lors du retrait.');
    }
  }

  private async _withdrawFromATM(): Promise<void> {
    let amount: number;
    do {
      amount = readlineSync.questionInt('Montant à retirer: ');
    } while (!InputValidator.validateAmount(amount));

    try {
      await UI.drawSpinner('Retrait en cours...', 2000);
      this._account.withdraw(amount);
      UI.showSuccess(`Retrait de ${UI.formatAmount(amount)} effectué avec succès!`);
    } catch (error) {
      UI.showError('Erreur lors du retrait.');
    }
  }

  public display(): void {
    UI.drawBox(
      this.message,
      this._options.map((opt, index) => `${index + 1}. ${opt}`)
    );
  }
}

export class BalanceMenu implements IMenu {
  public constructor(
    private readonly _menuService: MenuService,
    private readonly _account: BankAccount
  ) {}

  public get message(): string {
    return 'Voir solde';
  }

  public getOptions(): string[] {
    return ['Retour'];
  }

  public handleInput(input: string): void {
    if (input === '1') {
      this._menuService.goBack();
    } else {
      UI.showError('Option invalide. Veuillez réessayer.');
    }
  }

  public display(): void {
    const balance = this._account.getBalance();
    UI.drawBox(this.message, [`Solde actuel: ${UI.formatAmount(balance)}`, '1. Retour']);
  }
}
