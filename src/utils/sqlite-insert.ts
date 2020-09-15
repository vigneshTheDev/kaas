import { IncomeSourceRecord, Tables } from "./sqlite-model";
import { execInsertStatement, execTransaction } from "./sqlite";

export function addIncomeSource(incomeSource: Omit<IncomeSourceRecord, "id">) {
  return execTransaction([(tx) => execInsertStatement(tx, Tables.incomeSource, incomeSource)]);
}
