import { Menu } from './Menu';
import { UI } from './UI';
import { MenuService } from './Menu';
import { BuyCreditMenu, TransferMenu, MvolaCreditMenu, WithdrawMenu, BalanceMenu } from './SubMenus';
import { BankAccount } from '../banking/BankAccount';

export class MainMenu implements Menu {
    private readonly options = [
        'Acheter crédit ou Offre Yas',
        'Transférer argent',
        'Mvola Credit ou Epargne',
        'Retrait argent',
        'Voir solde',
        'Quitter'
    ];

    constructor(
        public menuService: MenuService,
        private account: BankAccount
    ) { }

    public get message(): string {
        return 'MVola - Menu Principal';
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
                this.menuService.navigateTo(new BuyCreditMenu(this.menuService, this.account));
                break;
            case 2:
                this.menuService.navigateTo(new TransferMenu(this.menuService, this.account));
                break;
            case 3:
                this.menuService.navigateTo(new MvolaCreditMenu(this.menuService, this.account));
                break;
            case 4:
                this.menuService.navigateTo(new WithdrawMenu(this.menuService, this.account));
                break;
            case 5:
                this.menuService.navigateTo(new BalanceMenu(this.menuService, this.account));
                break;
            case 6:
                UI.showInfo('Merci d\'avoir utilisé MVola. Au revoir!');
                process.exit(0);
                break;
        }
    }

    public display(): void {
        UI.drawBox(this.message, this.options.map((opt, index) => `${index + 1}. ${opt}`));
    }
} 