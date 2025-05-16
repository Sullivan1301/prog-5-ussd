import { TransactionRecord, TransactionType } from "./Transaction";

export class BankAccount {
  private balance: number;
  private readonly accountNumber: string;
  private readonly pinCode: string;
  private transactionHistory: TransactionRecord[] = [];

  constructor(
    accountNumber: string,
    initialBalance: number = 0,
    pinCode: string = "1234"
  ) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
    this.pinCode = pinCode;
  }

  public getBalance(): number {
    return this.balance;
  }

  public verifyPin(pin: string): boolean {
    return this.pinCode === pin;
  }

  public deposit(amount: number): boolean {
    if (amount <= 0) return false;

    this.balance += amount;
    this.recordTransaction("DEPOSIT", amount);
    return true;
  }

  public withdraw(amount: number): boolean {
    if (amount <= 0 || amount > this.balance) return false;

    this.balance -= amount;
    this.recordTransaction("WITHDRAWAL", -amount);
    return true;
  }

  public transfer(amount: number, recipient: BankAccount): boolean {
    if (amount <= 0 || amount > this.balance) return false;

    this.balance -= amount;
    recipient.deposit(amount);
    this.recordTransaction("TRANSFER", -amount);
    return true;
  }

  public getTransactionHistory(): TransactionRecord[] {
    return [...this.transactionHistory];
  }

  private recordTransaction(type: TransactionType, amount: number): void {
    this.transactionHistory.push({
      date: new Date(),
      type,
      amount,
      balance: this.balance
    });
  }
}
