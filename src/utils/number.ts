import numeral from "numeral";

export function formatBalance(number: string | number) {
  return numeral(number).format("0,0.00");
}

export function cleanNumber(number: string, numberFormat: NumberFormat) {
  const thousandSeparator = new RegExp(numberFormat.thousandSeparator, "g");
  const decimalSeparator = new RegExp(numberFormat.decimalSeparator, "g");
  return Number(number.replace(thousandSeparator, "").replace(decimalSeparator, "."));
}

export interface NumberFormat {
  thousandSeparator: RegExp;
  decimalSeparator: RegExp;
}
