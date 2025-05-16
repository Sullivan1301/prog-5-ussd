import { ITransaction } from './Transaction';

export class BankAccount {
  private _balance: number = 0;
  private _pin: string;
  private _accountNumber: string;
  private _transactions: ITransaction[] = [];
  private _pinAttempts: number = 0;
  private readonly _maxPinAttempts: number = 3;

  public constructor(accountNumber: string, initialPin: string) {
    this._accountNumber = accountNumber;
    this._pin = initialPin;
  }

  public getAccountNumber(): string {
    return this._accountNumber;
  }

  public getBalance(): number {
    return this._balance;
  }

  public getTransactions(): ITransaction[] {
    return [...this._transactions];
  }

  public verifyPin(pin: string): boolean {
    if (this._pinAttempts >= this._maxPinAttempts) {
      throw new Error('Compte bloqué. Trop de tentatives incorrectes.');
    }

    if (this._pin === pin) {
      this._pinAttempts = 0;
      return true;
    }

    this._pinAttempts++;
    return false;
  }

  public deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Le montant doit être supérieur à 0');
    }

    this._balance += amount;
    this._addTransaction({
      id: this._generateTransactionId(),
      type: 'DEPOSIT',
      amount,
      date: new Date(),
      description: 'Dépôt',
    });
  }

  public withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error('Le montant doit être supérieur à 0');
    }

    if (amount > this._balance) {
      throw new Error('Solde insuffisant');
    }

    this._balance -= amount;
    this._addTransaction({
      id: this._generateTransactionId(),
      type: 'WITHDRAWAL',
      amount,
      date: new Date(),
      description: 'Retrait',
    });
  }

  public transfer(amount: number, recipientAccount: string): void {
    if (amount <= 0) {
      throw new Error('Le montant doit être supérieur à 0');
    }

    if (amount > this._balance) {
      throw new Error('Solde insuffisant');
    }

    this._balance -= amount;
    this._addTransaction({
      id: this._generateTransactionId(),
      type: 'TRANSFER',
      amount,
      date: new Date(),
      description: 'Transfert',
      recipientAccount,
    });
  }

  private _addTransaction(transaction: ITransaction): void {
    this._transactions.push(transaction);
  }

  private _generateTransactionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
