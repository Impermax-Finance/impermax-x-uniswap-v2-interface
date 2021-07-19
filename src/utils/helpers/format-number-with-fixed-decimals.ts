
// TODO: should use some good library
// - https://formatjs.io/docs/react-intl/
// - https://github.com/adamwdraper/Numeral-js
const formatNumberWithFixedDecimals = (value: number, numberOfDecimals: number): number => {
  const helper = Math.pow(10, numberOfDecimals);
  const formattedValue = Math.floor((value + Number.EPSILON) * helper) / helper;

  return formattedValue;
};

export default formatNumberWithFixedDecimals;
