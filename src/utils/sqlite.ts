import * as SQLite from "expo-sqlite";
import { SQLError, SQLResultSet, SQLTransaction } from "expo-sqlite";
import { TransactionCallback } from "./sqlite-model";

let _db: SQLite.WebSQLDatabase;

function getDB() {
  _db = _db || SQLite.openDatabase("kaas");
  return _db;
}

function getTransactionErrorCallback(cb: (err: SQLError) => void): (_tx: SQLTransaction, err: SQLError) => boolean {
  return function (tx, err: SQLError) {
    cb(err);
    return true;
  };
}

export type TransactionExecutor = (tx: SQLTransaction, cb?: TransactionCallback) => void;

export function execReadTransaction(sqlStatement: string, args?: any[]) {
  return new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    const db = getDB();
    db.readTransaction(
      (tx) => {
        tx.executeSql(sqlStatement, args, (transaction, resultSet) => {
          resolve(resultSet);
        });
      },
      (error) => {
        console.log(`Error executing: ${sqlStatement}`, error);
        reject(error);
      }
    );
  });
}

export function execTransaction(executors: TransactionExecutor[]) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    db.transaction(
      (tx) => {
        executors.forEach((executor) => executor(tx));
      },

      (error) => {
        reject(error);
        console.error(`Error executing transactions`, error);
      },

      () => {
        resolve();
      }
    );
  });
}

/**
 * @param tx
 * @param sql
 * @param args
 * @param callback
 */
export function execWriteQuery(tx: SQLTransaction, sql: string, args?: any[], callback?: TransactionCallback) {
  tx.executeSql(sql, args, callback && (() => callback()), callback && getTransactionErrorCallback(callback));
}

export function queryAll(tableName: string): Promise<SQLite.SQLResultSet> {
  const sqlStatement = `SELECT * from ${tableName}`;

  return execReadTransaction(sqlStatement);
}

export function execInsertStatement(
  tx: SQLTransaction,
  tableName: string,
  record: any,
  callback?: TransactionCallback
) {
  const { cols, values } = recordToInsertable(record);
  const sqlStatement = `INSERT INTO ${tableName} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`;
  return execWriteQuery(tx, sqlStatement, values, callback);
}

/**
 * Creates a Table if not exists already
 * @param tx
 * @param tableName - Name of the table
 * @param columns - Column description. Should be in the format: id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, firstName VARCHAR(30)
 * @param callback
 */
export function execCreateStatement(
  tx: SQLTransaction,
  tableName: string,
  columns: string,
  callback?: TransactionCallback
) {
  let sqlStatement = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
  execWriteQuery(tx, sqlStatement, [], callback);
}

export function execDropStatement(tx: SQLTransaction, tableName: string, callback?: TransactionCallback) {
  const sqlStatement = `DROP TABLE IF EXISTS ${tableName}`;
  execWriteQuery(tx, sqlStatement, [], callback);
}

function recordToInsertable(record: any) {
  const cols = Object.keys(record);
  const values = cols.map((key) => record[key]);

  return { cols, values };
}

export function resultRowsToArray<T>(rows: SQLite.SQLResultSetRowList): T[] {
  const length = rows.length;
  const parsedRows: T[] = [];
  for (let i = 0; i < length; i++) {
    parsedRows.push(rows.item(i));
  }

  return parsedRows;
}

/**
 * @deprecated
 * @param query
 */
export function execQuery(query: string) {
  return new Promise<SQLResultSet>((resolve, reject) => {
    const db = getDB();
    db.transaction(
      (tx) => {
        tx.executeSql(query, [], (_tx, result) => resolve(result));
      },
      (error) => {
        console.error("Error executing the query", error.message);
        reject(error);
        return true;
      }
    );
  });
}
