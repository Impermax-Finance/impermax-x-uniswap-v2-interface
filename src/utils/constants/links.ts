
const PARAMETERS = Object.freeze({
  ACCOUNT: 'account',
  UNISWAP_V2_PAIR_ADDRESS: 'uniswapV2PairAddress'
});

const PAGES = Object.freeze({
  HOME: '/',
  LENDING_POOL: `/lending-pool/:${PARAMETERS.UNISWAP_V2_PAIR_ADDRESS}`,
  ACCOUNT: `/account/:${PARAMETERS.ACCOUNT}`,
  CREATE_NEW_PAIR: '/create-new-pair',
  RISKS: '/risks',
  CLAIM: '/claim',
  USER_GUIDE: '/user-guide'
});

export {
  PARAMETERS,
  PAGES
};
