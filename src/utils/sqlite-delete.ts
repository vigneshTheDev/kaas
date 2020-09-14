import { execDropStatement, execTransaction } from "./sqlite";
import { ProgressCallback, Tables } from "./sqlite-model";

export function dropAllTables(progressCallback: ProgressCallback) {
  const tables = [
    Tables.incomeSource,
    Tables.account,
    Tables.expenseCategory,
    Tables.incomeTransaction,
    Tables.expenseTransaction,
    Tables.transferTransaction,
    Tables.monthlyAccountSummary,
    Tables.backupMetadata,
    Tables.dbMetadata,
  ];
  let total = tables.length;
  let completed = 0;
  let failed = 0;

  return execTransaction(
    tables.map((t) => (tx) => {
      execDropStatement(tx, t, (err) => {
        err ? failed++ : completed++;

        progressCallback(completed, failed, total);
      });
    })
  );
}
