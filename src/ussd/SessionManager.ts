import { UI } from './UI';

export class SessionManager {
  private readonly _sessionTimeout: number = 300000; // 5 minutes
  private _lastActivity: number = Date.now();
  private _isActive: boolean = true;

  public constructor() {
    this._startTimeoutCheck();
  }

  public checkSession(): boolean {
    if (!this._isActive) {
      return false;
    }

    const now = Date.now();
    if (now - this._lastActivity > this._sessionTimeout) {
      this._endSession();
      return false;
    }

    return true;
  }

  public updateActivity(): void {
    this._lastActivity = Date.now();
  }

  private _endSession(): void {
    this._isActive = false;
    UI.showError('Session expirée. Veuillez vous reconnecter.');
    process.exit(0);
  }

  private _startTimeoutCheck(): void {
    setInterval(() => {
      if (!this.checkSession()) {
        process.exit(0);
      }
    }, 1000);
  }
}

export class InputValidator {
  public static validatePin(pin: string): boolean {
    return /^\d{4}$/.test(pin);
  }

  public static validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 1000000;
  }

  public static validatePhoneNumber(phone: string): boolean {
    return /^\d{10}$/.test(phone);
  }

  public static validateAccountNumber(account: string): boolean {
    return /^\d{10}$/.test(account);
  }

  public static validateAgentCode(code: string): boolean {
    const codeRegex = /^[A-Z0-9]{6}$/;
    if (!codeRegex.test(code)) {
      UI.showError('Code agent invalide. Format attendu: 6 caractères alphanumériques');
      return false;
    }
    return true;
  }
}
