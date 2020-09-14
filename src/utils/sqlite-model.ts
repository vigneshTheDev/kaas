import { Currency } from "../models/currency-model";
import { SQLError } from "expo-sqlite";

export type ProgressCallback = (completed: number, failed: number, total: number) => void;
export type TransactionCallback = (err?: SQLError) => void;

export interface AppPreferences {
  defaultCurrency: Currency;
  currencyFormat: string;
  enableGDriveBackup: boolean;
}

export interface IncomeSourceRecord {
  id: number;
  name: string;
  expectedPerMonth: number;
  currency: Currency;
  icon: string;
}

export interface AccountRecord {
  id: number;
  name: string;
  initialBalance: number;
  isDebtAccount: boolean;
  includeInTotal: boolean;
  currency: Currency;
  icon: string;
}

export interface AccountRecordRaw {
  id: number;
  name: string;
  initialBalance: number;
  isDebtAccount: number;
  includeInTotal: number;
  currency: Currency;
  icon: string;
}

export interface ExpenseCategoryRecord {
  id: number;
  name: string;
  expectedPerMonth: number;
  currency: Currency;
  icon: string;
}

export interface IncomeTransactionRecord {
  id: number;
  fromSource: number;
  toAccount: number;
  transactionDate: string;
  recordedTime: number;
  sourceCurrency: Currency;
  targetCurrency: Currency;
  amountInSourceCurrency: number;
  amountInTargetCurrency: number;
  description: string;
}

export interface ExpenseTransactionRecord {
  id: number;
  fromAccount: number;
  toExpense: number;
  transactionDate: string;
  recordedTime: number;
  sourceCurrency: Currency;
  targetCurrency: Currency;
  amountInSourceCurrency: number;
  amountInTargetCurrency: number;
  description: string;
}

export interface TransferTransactionRecord {
  id: number;
  fromAccount: number;
  toAccount: number;
  transactionDate: string;
  recordedTime: number;
  sourceCurrency: Currency;
  targetCurrency: Currency;
  amountInSourceCurrency: number;
  amountInTargetCurrency: number;
  description: string;
}

export interface MonthlyAccountSummaryRecord {
  id: number;
  account: number;
  month: number;
  year: number;
  monthlySubtotal: number;
}

export interface BackupMatadata {
  id: number;
  month: number;
  year: number;
  isBackedup: boolean;
}

export interface BackupMatadataRaw {
  id: number;
  month: number;
  year: number;
  isBackedup: number;
}

export enum Tables {
  incomeSource = "income_source",
  account = "account",
  expenseCategory = "expense_cateogry",
  incomeTransaction = "income_transaction",
  expenseTransaction = "expense_transaction",
  transferTransaction = "transfer_transaction",
  monthlyAccountSummary = "monthly_account_summary",
  backupMetadata = "backup_metadata",
  dbMetadata = "db_metadata",
}
