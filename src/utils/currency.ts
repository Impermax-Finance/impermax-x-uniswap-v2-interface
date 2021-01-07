export interface Currency {
  name: string;
  fullName: string;
  icon: string;
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


export enum Currencies { DAI, ETH };
