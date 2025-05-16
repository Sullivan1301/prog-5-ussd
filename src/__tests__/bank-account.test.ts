import { BankAccount } from '../index';

describe('BankAccount', () => {
    let account: BankAccount;

    beforeEach(() => {
        account = new BankAccount('123456', 1000);
    });

    it('should create a new account with initial balance', () => {
        expect(account.getBalance()).toBe(1000);
    });

    it('should deposit money correctly', () => {
        expect(account.deposit(500)).toBe(true);
        expect(account.getBalance()).toBe(1500);
    });

    it('should not deposit negative amount', () => {
        expect(account.deposit(-100)).toBe(false);
        expect(account.getBalance()).toBe(1000);
    });

    it('should withdraw money correctly', () => {
        expect(account.withdraw(500)).toBe(true);
        expect(account.getBalance()).toBe(500);
    });

    it('should not withdraw more than balance', () => {
        expect(account.withdraw(1500)).toBe(false);
        expect(account.getBalance()).toBe(1000);
    });
}); 