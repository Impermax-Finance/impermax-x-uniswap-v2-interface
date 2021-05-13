
const PAGES = Object.freeze({
  home: {
    value: 'Markets',
    to: '/'
  },
  lendingPool: {
    value: 'LendingPool',
    to: '/lending-pool/:uniswapV2PairAddress'
  },
  account: {
    value: 'Account',
    to: '/account/:account'
  },
  createNewPair: {
    value: 'Create New Pair',
    to: '/create-new-pair'
  },
  risks: {
    value: 'Risks',
    to: '/risks'
  },
  claim: {
    value: 'Claim',
    to: '/claim'
  },
  userGuide: {
    value: 'User Guide',
    to: '/user-guide'
  }
});

export {
  PAGES
};
