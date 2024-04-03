import numeral from 'numeral';

export const CurrencyFormatter = (amount) => {
  const currencySymbol = ' ₫';
  // Sử dụng `numeral` để định dạng số tiền
  const formattedCurrency = numeral(amount).format('0,0');

  return formattedCurrency + currencySymbol;
};
