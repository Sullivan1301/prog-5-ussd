export interface Menu {
    message: string;
    handleInput(input: string): void;
    getOptions(): string[];
    display(): void;
}

export interface MenuOption {
    label: string;
    action: () => void;
}

export class MenuService {
    private currentMenu: Menu;
    private menuStack: Menu[] = [];

    constructor(initialMenu: Menu) {
        this.currentMenu = initialMenu;
    }

    public navigateTo(menu: Menu): void {
        this.menuStack.push(this.currentMenu);
        this.currentMenu = menu;
    }

    public goBack(): void {
        const previousMenu = this.menuStack.pop();
        if (previousMenu) {
            this.currentMenu = previousMenu;
        }
    }

    public getCurrentMenu(): Menu {
        return this.currentMenu;
    }

    public handleInput(input: string): void {
        this.currentMenu.handleInput(input);
    }
} 