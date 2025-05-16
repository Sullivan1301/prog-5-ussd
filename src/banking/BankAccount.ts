import { TransactionRecord, TransactionType } from "./Transaction";

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  date: Date;
  description: string;
  recipientAccount?: string;
}

export class BankAccount {
  private balance: number = 0;
  private pin: string;
  private accountNumber: string;
  private transactions: Transaction[] = [];
  private pinAttempts: number = 0;
  private readonly MAX_PIN_ATTEMPTS: number = 3;

  constructor(accountNumber: string, initialPin: string) {
    this.accountNumber = accountNumber;
    this.pin = initialPin;
  }

  public getAccountNumber(): string {
    return this.accountNumber;
  }

  public getBalance(): number {
    return this.balance;
  }

  public getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  public verifyPin(pin: string): boolean {
    if (this.pinAttempts >= this.MAX_PIN_ATTEMPTS) {
      throw new Error('Compte bloqué. Trop de tentatives incorrectes.');
    }

    if (this.pin === pin) {
      this.pinAttempts = 0;
      return true;
    }

    this.pinAttempts++;
    return false;
  }

  public deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Le montant doit être supérieur à 0');
    }

    this.balance += amount;
    this.addTransaction({
      id: this.generateTransactionId(),
      type: 'DEPOSIT',
      amount,
      date: new Date(),
      description: 'Dépôt'
    });
  }

  public withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error('Le montant doit être supérieur à 0');
    }

    if (amount > this.balance) {
      throw new Error('Solde insuffisant');
    }

    this.balance -= amount;
    this.addTransaction({
      id: this.generateTransactionId(),
      type: 'WITHDRAWAL',
      amount,
      date: new Date(),
      description: 'Retrait'
    });
  }

  public transfer(amount: number, recipientAccount: string): void {
    if (amount <= 0) {
      throw new Error('Le montant doit être supérieur à 0');
    }

    if (amount > this.balance) {
      throw new Error('Solde insuffisant');
    }

    this.balance -= amount;
    this.addTransaction({
      id: this.generateTransactionId(),
      type: 'TRANSFER',
      amount,
      date: new Date(),
      description: 'Transfert',
      recipientAccount
    });
  }

  private addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  private generateTransactionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
