/**
 * Type Map Union of valid ethereum networks.
 */
export enum Networks {
  Kovan = 'kovan',
  Mainnet = 'mainnet',
}

/**
 * Interface of valid chain detail information.
 */
export interface ChainDetails {
  networkId: number;
  networkName: Networks;
}

/**
 * Type Definition of chain details, indexed by network names.
 * @see Networks
 * @see ChainDetails
 */
export type ChainDetailsMap = {
  [key in Networks]: ChainDetails;
}

/**
 * A map of chain connection details, indexed by network names.
 * @see Networks
 * @see ChainDetails
 * @see ChainDetailsMap
 */
export const chainDetailsMap: ChainDetailsMap = {
  [Networks.Kovan]: {
    networkId: 42,
    networkName: Networks.Kovan,
  },
  [Networks.Mainnet]: {
    networkId: 1,
    networkName: Networks.Kovan,
  }
}