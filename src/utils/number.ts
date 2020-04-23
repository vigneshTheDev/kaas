import numeral from "numeral";

export function formatBalance(number: string | number) {
  return numeral(number).format("0,0.00");
}
