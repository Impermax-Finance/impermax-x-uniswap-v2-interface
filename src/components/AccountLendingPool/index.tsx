import React, { useContext, useState, useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useWallet } from 'use-wallet';
import Button from 'react-bootstrap/Button';
import './index.scss';
import { useRouterAccount } from '../../hooks/useImpermaxRouter';
import { PoolTokenType } from '../../impermax-router/interfaces';
import AccountLendingPoolDetails from './AccountLendingPoolDetails';
import AccountLendingPoolLPRow from './AccountLendingPoolLPRow';
import AccountLendingPoolRow from './AccountLendingPoolRow';
import PairAddressContext from '../../contexts/PairAddress';
import PoolTokenContext from '../../contexts/PoolToken';
import usePairAddress from '../../hooks/usePairAddress';
import AccountLendingPoolPageSelector from './AccountLendingPoolPageSelector';

export enum AccountLendingPoolPage {
  LEVERAGE,
  EARN_INTEREST,
}

interface AccountLendingPoolContainerProps {
  children: any;
}

function AccountLendingPoolContainer({ children }: AccountLendingPoolContainerProps) {
  return (<div className="account-lending-pool">
    <Card>
      <Card.Body>
        { children }
      </Card.Body>
    </Card>
  </div>);
}

/**
 * Generate the Account Lending Pool card, giving details about the particular user's equity in the pool.
 * @params AccountLendingPoolProps
 */
export default function AccountLendingPool() {
  const { connect, account } = useWallet();
  const routerAccount = useRouterAccount();

  if (!account || !routerAccount) return (
    <AccountLendingPoolContainer>
      <div className="text-center py-5">
        <Button onClick={() => {connect('injected')}} className="button-green">Connect to use the App</Button>
      </div>
    </AccountLendingPoolContainer>
  );

  const [pageSelected, setPageSelected] = useState<AccountLendingPoolPage>(AccountLendingPoolPage.LEVERAGE);

  return (
    <AccountLendingPoolContainer>
      <AccountLendingPoolPageSelector pageSelected={pageSelected} setPageSelected={setPageSelected} />
      { pageSelected === AccountLendingPoolPage.LEVERAGE ? (<>
        <AccountLendingPoolDetails />
        <PoolTokenContext.Provider value={PoolTokenType.Collateral}>
          <AccountLendingPoolLPRow />
        </PoolTokenContext.Provider>
        <PoolTokenContext.Provider value={PoolTokenType.BorrowableA}>
          <AccountLendingPoolRow />
        </PoolTokenContext.Provider>
        <PoolTokenContext.Provider value={PoolTokenType.BorrowableB}>
          <AccountLendingPoolRow />
        </PoolTokenContext.Provider>
      </>) : (
        <>Ciao</>
      ) }
    </AccountLendingPoolContainer>
  );
}