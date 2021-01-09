export interface Currency {
  name: string;
  fullName: string;
  icon: string;
}

export interface LPTokenPair {
  currency1: Currency;
  currency2: Currency;
  address: string;
}

export const DAI: Currency = {
  name: "DAI",
  fullName: "Dai",
  icon: "/assets/icons/dai.svg"
};

export const ETH: Currency = {
  name: "ETH",
  fullName: "Ethereum",
  icon: "/assets/icons/eth.svg"
};

export const DaiEthLP: LPTokenPair = {
  currency1: DAI,
  currency2: ETH,
  address: 'eth-dai'
}

export const SupportedLPs = {
  [DaiEthLP.address]: DaiEthLP
};


export enum Currencies { DAI, ETH };
