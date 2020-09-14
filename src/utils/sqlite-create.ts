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
      name VARCHAR(16) NOT NULL,
      expected_per_month NUMERIC,
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
      initial_balance NUMERIC NOT NULL,
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
      expected_per_month NUMERIC,
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
      from_source INTEGER NOT NULL,
      to_account INTEGER NOT NULL,
      transaction_date VARCHAR(10) NOT NULL,
      recorded_time INTEGER NOT NULL,
      source_currency VARCHAR(10) NOT NULL,
      target_currency VARCHAR(10) NOT NULL,
      amount_in_source_currency NUMERIC NOT NULL,
      amount_in_target_currency NUMERIC NOT NULL,
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
      from_account INTEGER NOT NULL,
      to_expense INTEGER NOT NULL,
      transaction_date VARCHAR(10) NOT NULL,
      recorded_time INTEGER NOT NULL,
      source_currency VARCHAR(10) NOT NULL,
      target_currency VARCHAR(10) NOT NULL,
      amount_in_source_currency NUMERIC NOT NULL,
      amount_in_target_currency NUMERIC NOT NULL,
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
      from_account INTEGER NOT NULL,
      to_account INTEGER NOT NULL,
      transaction_date VARCHAR(10) NOT NULL,
      recorded_time INTEGER NOT NULL,
      source_currency VARCHAR(10) NOT NULL,
      target_currency VARCHAR(10) NOT NULL,
      amount_in_source_currency NUMERIC NOT NULL,
      amount_in_target_currency NUMERIC NOT NULL,
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
      monthly_subtotal NUMERIC NOT NULL
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
      is_backedup INTEGER NOT NULL
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
      table_name VARCHAR(25) NOT NULL,
      restore_complete INTEGER NOT NULL
    `,
    cb
  );
}
