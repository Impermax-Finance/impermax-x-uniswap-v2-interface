export interface Currency {
  name: string,
  icon: string 
}

export const DAI: Currency = {
  name: "DAI",
  icon: "/assets/icons/dai.svg"
};

export const ETH: Currency = {
  name: "ETH",
  icon: "/assets/icons/eth.svg"
};


export enum Currencies { DAI, ETH };
