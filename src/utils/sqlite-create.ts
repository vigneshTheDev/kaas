import { execCreateStatement, execTransaction, TransactionExecutor } from "./sqlite";
import { Tables, TransactionCallback } from "./sqlite-model";
import { SQLTransaction } from "expo-sqlite";

const tableCreators: TableCreator[] = [
  {
    tableName: Tables.incomeSource,
    create: createIncomeSourceTable,
  },
  {
    tableName: Tables.incomeSource,
    create: createIncomeSourceTable,
  },
  {
    tableName: Tables.account,
    create: createAccountTable,
  },
  {
    tableName: Tables.expenseCategory,
    create: createExpenseCategoryTable,
  },
  {
    tableName: Tables.incomeTransaction,
    create: createIncomeTransactionTable,
  },
  {
    tableName: Tables.expenseTransaction,
    create: createExpenseTransactionTable,
  },
  {
    tableName: Tables.transferTransaction,
    create: createTransferTransactionTable,
  },
  {
    tableName: Tables.monthlyAccountSummary,
    create: createMonthlyAccountSummaryTable,
  },
  {
    tableName: Tables.backupMetadata,
    create: createBackupMetadataTable,
  },
];

interface TableCreator {
  tableName: string;
  create: TransactionExecutor;
}

export function createAllTables(progressCallback: (completed: number, failed: number, total: number) => void) {
  let total = tableCreators.length;
  let completed = 0;
  let failed = 0;

  return execTransaction(
    tableCreators.map((t) => (tx) => {
      t.create(tx, (err) => {
        if (err) {
          failed++;
          console.log(`Create failed: ${t.tableName}`);
        } else {
          completed++;
          console.log(`Create success: ${t.tableName}`);
        }
        progressCallback(completed, failed, total);
      });
    })
  );
}

function createIncomeSourceTable(tx: SQLTransaction, cb?: TransactionCallback): void {
  execCreateStatement(
    tx,
    Tables.incomeSource,
    `
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(16) NOT NULL UNIQUE,
      expectedPerMonth NUMERIC,
      currency VARCHAR(5) NOT NULL,
      icon VARCHAR(10)
    `,
    cb
  );
}

function createAccountTable(tx: SQLTransaction, cb?: TransactionCallback): void {
  execCreateStatement(
    tx,
    Tables.account,
    `
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(16) NOT NULL,
      initialBalance NUMERIC NOT NULL,
      isDebtAccount INTEGER NOT NULL,
      includeInTotal INTEGER NOT NULL,
      currency VARCHAR(5) NOT NULL,
      icon VARCHAR(10)
    `,
    cb
  );
}

function createExpenseCategoryTable(tx: SQLTransaction, cb?: TransactionCallback): void {
  execCreateStatement(
    tx,
    Tables.expenseCategory,
    `
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(16) NOT NULL,
      expectedPerMonth NUMERIC,
      currency VARCHAR(5) NOT NULL,
      icon VARCHAR(10)
    `,
    cb
  );
}

function createIncomeTransactionTable(tx: SQLTransaction, cb?: TransactionCallback): void {
  execCreateStatement(
    tx,
    Tables.incomeTransaction,
    `
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      fromSource INTEGER NOT NULL,
      toAccount INTEGER NOT NULL,
      transactionDate VARCHAR(10) NOT NULL,
      recordedTime INTEGER NOT NULL,
      sourceCurrency VARCHAR(10) NOT NULL,
      targetCurrency VARCHAR(10) NOT NULL,
      amountInSourceCurrency NUMERIC NOT NULL,
      amountInTargetCurrency NUMERIC NOT NULL,
      description VARCHAR(100)
    `,
    cb
  );
}
function createExpenseTransactionTable(tx: SQLTransaction, cb?: TransactionCallback): void {
  execCreateStatement(
    tx,
    Tables.expenseTransaction,
    `
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      fromAccount INTEGER NOT NULL,
      toExpense INTEGER NOT NULL,
      transactionDate VARCHAR(10) NOT NULL,
      recordedTime INTEGER NOT NULL,
      sourceCurrency VARCHAR(10) NOT NULL,
      targetCurrency VARCHAR(10) NOT NULL,
      amountInSourceCurrency NUMERIC NOT NULL,
      amountInTargetCurrency NUMERIC NOT NULL,
      description VARCHAR(100)
    `,
    cb
  );
}
function createTransferTransactionTable(tx: SQLTransaction, cb?: TransactionCallback): void {
  execCreateStatement(
    tx,
    Tables.transferTransaction,
    `
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      fromAccount INTEGER NOT NULL,
      toAccount INTEGER NOT NULL,
      transactionDate VARCHAR(10) NOT NULL,
      recordedTime INTEGER NOT NULL,
      sourceCurrency VARCHAR(10) NOT NULL,
      targetCurrency VARCHAR(10) NOT NULL,
      amountInSourceCurrency NUMERIC NOT NULL,
      amountInTargetCurrency NUMERIC NOT NULL,
      description VARCHAR(100)
    `,
    cb
  );
}
function createMonthlyAccountSummaryTable(tx: SQLTransaction, cb?: TransactionCallback): void {
  execCreateStatement(
    tx,
    Tables.monthlyAccountSummary,
    `
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      account INTEGER NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      monthlySubtotal NUMERIC NOT NULL
    `,
    cb
  );
}
function createBackupMetadataTable(tx: SQLTransaction, cb?: TransactionCallback): void {
  execCreateStatement(
    tx,
    Tables.backupMetadata,
    `
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      isBackedup INTEGER NOT NULL
    `,
    cb
  );
}
function createDbMetadataTable(tx: SQLTransaction, cb?: TransactionCallback): void {
  execCreateStatement(
    tx,
    Tables.dbMetadata,
    `
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      tableName VARCHAR(25) NOT NULL,
      restoreComplete INTEGER NOT NULL
    `,
    cb
  );
}
