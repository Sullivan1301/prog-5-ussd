import { Menu } from './Menu';
import { MenuService } from './Menu';
import { UI } from './UI';
import { BankAccount } from '../banking/BankAccount';
import readlineSync from 'readline-sync';

export class BuyCreditMenu implements Menu {
    private readonly options = [
        'Acheter crédit',
        'Offre Yas',
        'Retour'
    ];

    constructor(
        private menuService: MenuService,
        private account: BankAccount
    ) { }

    public get message(): string {
        return 'Acheter crédit ou Offre Yas';
    }

    public getOptions(): string[] {
        return this.options;
    }

    public handleInput(input: string): void {
        const choice = parseInt(input, 10);

        if (isNaN(choice) || choice < 1 || choice > this.options.length) {
            UI.showError('Option invalide. Veuillez réessayer.');
            return;
        }

        switch (choice) {
            case 1:
                this.buyCredit();
                break;
            case 2:
                this.buyYasOffer();
                break;
            case 3:
                this.menuService.goBack();
                break;
        }
    }

    private async buyCredit(): Promise<void> {
        const amount = readlineSync.questionInt('Entrez le montant à acheter: ');
        try {
            await UI.drawSpinner('Achat en cours...', 2000);
            this.account.deposit(amount);
            UI.showSuccess(`Crédit de ${UI.formatAmount(amount)} acheté avec succès!`);
        } catch (error) {
            UI.showError('Erreur lors de l\'achat du crédit.');
        }
    }

    private async buyYasOffer(): Promise<void> {
        const offers = [
            'Offre 1: 1000 Ar - 1 Go',
            'Offre 2: 2000 Ar - 2 Go',
            'Offre 3: 5000 Ar - 5 Go'
        ];

        UI.drawBox('Offres Yas disponibles', offers);
        const choice = readlineSync.questionInt('Choisissez une offre (1-3): ');

        if (choice < 1 || choice > 3) {
            UI.showError('Offre invalide.');
            return;
        }

        try {
            await UI.drawSpinner('Activation de l\'offre...', 2000);
            const amount = choice * 1000;
            this.account.deposit(amount);
            UI.showSuccess(`Offre Yas de ${UI.formatAmount(amount)} activée avec succès!`);
        } catch (error) {
            UI.showError('Erreur lors de l\'activation de l\'offre.');
        }
    }

    public display(): void {
        UI.drawBox(this.message, this.options.map((opt, index) => `${index + 1}. ${opt}`));
    }
}

export class TransferMenu implements Menu {
    private readonly options = [
        'Vers un numéro MVola',
        'Vers un compte bancaire',
        'Retour'
    ];

    constructor(
        private menuService: MenuService,
        private account: BankAccount
    ) { }

    public get message(): string {
        return 'Transférer argent';
    }

    public getOptions(): string[] {
        return this.options;
    }

    public handleInput(input: string): void {
        const choice = parseInt(input, 10);

        if (isNaN(choice) || choice < 1 || choice > this.options.length) {
            UI.showError('Option invalide. Veuillez réessayer.');
            return;
        }

        switch (choice) {
            case 1:
                this.transferToMvola();
                break;
            case 2:
                this.transferToBank();
                break;
            case 3:
                this.menuService.goBack();
                break;
        }
    }

    private async transferToMvola(): Promise<void> {
        const recipient = readlineSync.question('Numéro MVola du destinataire: ');
        const amount = readlineSync.questionInt('Montant à transférer: ');

        try {
            await UI.drawSpinner('Transfert en cours...', 2000);
            this.account.transfer(amount, recipient);
            UI.showSuccess(`Transfert de ${UI.formatAmount(amount)} effectué avec succès!`);
        } catch (error) {
            UI.showError('Erreur lors du transfert.');
        }
    }

    private async transferToBank(): Promise<void> {
        const accountNumber = readlineSync.question('Numéro de compte bancaire: ');
        const amount = readlineSync.questionInt('Montant à transférer: ');

        try {
            await UI.drawSpinner('Transfert en cours...', 2000);
            this.account.transfer(amount, accountNumber);
            UI.showSuccess(`Transfert de ${UI.formatAmount(amount)} effectué avec succès!`);
        } catch (error) {
            UI.showError('Erreur lors du transfert.');
        }
    }

    public display(): void {
        UI.drawBox(this.message, this.options.map((opt, index) => `${index + 1}. ${opt}`));
    }
}

export class MvolaCreditMenu implements Menu {
    private readonly options = [
        'Demander un crédit',
        'Rembourser un crédit',
        'Voir mes crédits',
        'Retour'
    ];

    constructor(
        private menuService: MenuService,
        private account: BankAccount
    ) { }

    public get message(): string {
        return 'Mvola Credit ou Epargne';
    }

    public getOptions(): string[] {
        return this.options;
    }

    public handleInput(input: string): void {
        const choice = parseInt(input, 10);

        if (isNaN(choice) || choice < 1 || choice > this.options.length) {
            UI.showError('Option invalide. Veuillez réessayer.');
            return;
        }

        switch (choice) {
            case 1:
                this.requestCredit();
                break;
            case 2:
                this.repayCredit();
                break;
            case 3:
                this.viewCredits();
                break;
            case 4:
                this.menuService.goBack();
                break;
        }
    }

    private async requestCredit(): Promise<void> {
        const amount = readlineSync.questionInt('Montant du crédit souhaité: ');
        try {
            await UI.drawSpinner('Demande de crédit en cours...', 2000);
            this.account.deposit(amount);
            UI.showSuccess(`Crédit de ${UI.formatAmount(amount)} accordé avec succès!`);
        } catch (error) {
            UI.showError('Erreur lors de la demande de crédit.');
        }
    }

    private async repayCredit(): Promise<void> {
        const amount = readlineSync.questionInt('Montant à rembourser: ');
        try {
            await UI.drawSpinner('Remboursement en cours...', 2000);
            this.account.withdraw(amount);
            UI.showSuccess(`Remboursement de ${UI.formatAmount(amount)} effectué avec succès!`);
        } catch (error) {
            UI.showError('Erreur lors du remboursement.');
        }
    }

    private viewCredits(): void {
        const balance = this.account.getBalance();
        const content = [
            `Solde actuel: ${UI.formatAmount(balance)}`,
            '',
            '1. Retour'
        ];
        UI.drawBox('Mes crédits', content);
    }

    public display(): void {
        UI.drawBox(this.message, this.options.map((opt, index) => `${index + 1}. ${opt}`));
    }
}

export class WithdrawMenu implements Menu {
    private readonly options = [
        'Retrait auprès d\'un agent',
        'Retrait auprès d\'un distributeur',
        'Retour'
    ];

    constructor(
        private menuService: MenuService,
        private account: BankAccount
    ) { }

    public get message(): string {
        return 'Retrait argent';
    }

    public getOptions(): string[] {
        return this.options;
    }

    public handleInput(input: string): void {
        const choice = parseInt(input, 10);

        if (isNaN(choice) || choice < 1 || choice > this.options.length) {
            UI.showError('Option invalide. Veuillez réessayer.');
            return;
        }

        switch (choice) {
            case 1:
                this.withdrawFromAgent();
                break;
            case 2:
                this.withdrawFromATM();
                break;
            case 3:
                this.menuService.goBack();
                break;
        }
    }

    private async withdrawFromAgent(): Promise<void> {
        const amount = readlineSync.questionInt('Montant à retirer: ');
        const agentCode = readlineSync.question('Code de l\'agent: ');

        try {
            await UI.drawSpinner('Retrait en cours...', 2000);
            this.account.withdraw(amount);
            UI.showSuccess(`Retrait de ${UI.formatAmount(amount)} effectué avec succès auprès de l'agent ${agentCode}!`);
        } catch (error) {
            UI.showError('Erreur lors du retrait.');
        }
    }

    private async withdrawFromATM(): Promise<void> {
        const amount = readlineSync.questionInt('Montant à retirer: ');
        const atmCode = readlineSync.question('Code du distributeur: ');

        try {
            await UI.drawSpinner('Retrait en cours...', 2000);
            this.account.withdraw(amount);
            UI.showSuccess(`Retrait de ${UI.formatAmount(amount)} effectué avec succès au distributeur ${atmCode}!`);
        } catch (error) {
            UI.showError('Erreur lors du retrait.');
        }
    }

    public display(): void {
        UI.drawBox(this.message, this.options.map((opt, index) => `${index + 1}. ${opt}`));
    }
}

export class BalanceMenu implements Menu {
    constructor(
        private menuService: MenuService,
        private account: BankAccount
    ) { }

    public get message(): string {
        return 'Voir solde';
    }

    public getOptions(): string[] {
        return ['Retour'];
    }

    public handleInput(input: string): void {
        if (input === '1') {
            this.menuService.goBack();
        } else {
            UI.showError('Option invalide. Veuillez réessayer.');
        }
    }

    public display(): void {
        const balance = this.account.getBalance();
        const transactions = this.account.getTransactions();

        const content = [
            `Solde actuel: ${UI.formatAmount(balance)}`,
            '',
            'Dernières transactions:',
            ...transactions.slice(-5).map(t =>
                `${UI.formatDate(t.date)} - ${t.description}: ${UI.formatAmount(t.amount)}`
            ),
            '',
            '1. Retour'
        ];

        UI.drawBox(this.message, content);
    }
} 