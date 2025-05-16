import { UI } from './UI';

export class SessionManager {
    private static readonly SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
    private lastActivity: number;
    private isActive: boolean;

    constructor() {
        this.lastActivity = Date.now();
        this.isActive = true;
        this.startTimeoutCheck();
    }

    public updateActivity(): void {
        this.lastActivity = Date.now();
    }

    public checkSession(): boolean {
        if (!this.isActive) {
            return false;
        }

        const now = Date.now();
        if (now - this.lastActivity > SessionManager.SESSION_TIMEOUT) {
            this.endSession();
            return false;
        }

        return true;
    }

    private endSession(): void {
        this.isActive = false;
        UI.showError('Session expirée. Veuillez vous reconnecter.');
        process.exit(0);
    }

    private startTimeoutCheck(): void {
        setInterval(() => {
            if (!this.checkSession()) {
                this.endSession();
            }
        }, 1000);
    }
}

export class InputValidator {
    public static validateAmount(amount: number): boolean {
        if (isNaN(amount) || amount <= 0) {
            UI.showError('Le montant doit être un nombre positif.');
            return false;
        }
        return true;
    }

    public static validatePhoneNumber(phone: string): boolean {
        const phoneRegex = /^0[3-9][0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            UI.showError('Numéro de téléphone invalide. Format attendu: 0XXXXXXXXX');
            return false;
        }
        return true;
    }

    public static validateAccountNumber(account: string): boolean {
        const accountRegex = /^[0-9]{10}$/;
        if (!accountRegex.test(account)) {
            UI.showError('Numéro de compte invalide. Format attendu: 10 chiffres');
            return false;
        }
        return true;
    }

    public static validatePin(pin: string): boolean {
        const pinRegex = /^[0-9]{4}$/;
        if (!pinRegex.test(pin)) {
            UI.showError('PIN invalide. Format attendu: 4 chiffres');
            return false;
        }
        return true;
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