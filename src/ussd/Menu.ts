export interface IMenu {
  readonly message: string;
  getOptions(): string[];
  handleInput(input: string): void;
  display(): void;
}

export interface IMenuOption {
  id: number;
  label: string;
  action: () => void;
}

export class MenuService {
  private _currentMenu: IMenu;
  private _menuStack: IMenu[] = [];

  public constructor(initialMenu: IMenu) {
    this._currentMenu = initialMenu;
    this._menuStack.push(initialMenu);
  }

  public getCurrentMenu(): IMenu {
    return this._currentMenu;
  }

  public navigateTo(menu: IMenu): void {
    this._menuStack.push(menu);
    this._currentMenu = menu;
  }

  public goBack(): void {
    if (this._menuStack.length > 1) {
      this._menuStack.pop();
      this._currentMenu = this._menuStack[this._menuStack.length - 1];
    }
  }

  public handleInput(input: string): void {
    this._currentMenu.handleInput(input);
  }
}
