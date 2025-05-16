export interface ITransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  date: Date;
  description: string;
  recipientAccount?: string;
}
