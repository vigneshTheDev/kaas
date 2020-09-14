SELECT id, name, expected_per_month, currency, icon
FROM income_source;


SELECT id, name, initial_balance, isDebtAccount, includeInTotal, currency, icon
FROM account;


SELECT id, name, expected_per_month, currency, icon
FROM expense;


SELECT id, from_source, to_account, amount, description
FROM income_transaction;


SELECT id, from_account, to_expense, amount, description
FROM expense_transaction;
