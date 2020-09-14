CREATE TABLE IF NOT EXISTS income_source (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(16) NOT NULL,
	expected_per_month NUMERIC,
	currency VARCHAR(5) NOT NULL,
	icon VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS account (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(16) NOT NULL,
	initial_balance NUMERIC NOT NULL,
	isDebtAccount INTEGER NOT NULL,
	includeInTotal INTEGER NOT NULL,
	currency VARCHAR(5) NOT NULL,
	icon VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS expense_category (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name VARCHAR(16) NOT NULL,
	expected_per_month NUMERIC,
	currency VARCHAR(5) NOT NULL,
	icon VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS income_transaction (
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
);

CREATE TABLE IF NOT EXISTS expense_transaction (
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
);

CREATE TABLE IF NOT EXISTS transfer_transaction (
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
);

CREATE TABLE IF NOT EXISTS monthly_account_summary (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	account INTEGER NOT NULL,
	month INTEGER NOT NULL,
	year INTEGER NOT NULL,
	monthly_subtotal NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS backup_metadata (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	month INTEGER NOT NULL,
	year INTEGER NOT NULL,
	is_backedup INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS db_metadata (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  table_name VARCHAR(25) NOT NULL,
  restore_complete INTEGER NOT NULL,
);
