import React, { useContext, useState, useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useWallet } from 'use-wallet';
import Button from 'react-bootstrap/Button';
import './index.scss';
import useImpermaxRouter, { useRouterAccount } from '../../hooks/useImpermaxRouter';
import { AccountData } from '../../impermax-router';
import AccountLendingPoolDetails from './AccountLendingPoolDetails';
import AccountLendingPoolLPRow from './AccountLendingPoolLPRow';
import AccountLendingPoolRow from './AccountLendingPoolRow';

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

interface AccountLendingPoolProps {
  uniswapV2PairAddress: string;
}

/**
 * Generate the Account Lending Pool card, giving details about the particular user's equity in the pool.
 * @params AccountLendingPoolProps
 */
export default function AccountLendingPool({ uniswapV2PairAddress }: AccountLendingPoolProps) {
  const { connect, account } = useWallet();
  const [accountData, setAccountData] = useState<AccountData>();
  const impermaxRouter = useImpermaxRouter();
  const routerAccount = useRouterAccount();
  
  useEffect(() => {
    if (!impermaxRouter || !routerAccount) return;
    impermaxRouter.getAccountData(uniswapV2PairAddress).then((data) => {
      setAccountData(data);
    });
  }, [impermaxRouter, routerAccount]);

  if (!accountData) return (
    <AccountLendingPoolContainer>
      <div className="text-center py-5">
        <Button onClick={() => {connect('injected')}}>Connect to use the App</Button>
      </div>
    </AccountLendingPoolContainer>
  );

  return (
    <AccountLendingPoolContainer>
      <AccountLendingPoolDetails />
      <AccountLendingPoolLPRow accountCollateralData={accountData.accountCollateralData}/>
      <AccountLendingPoolRow accountBorrowableData={accountData.accountBorrowableAData} />
      <AccountLendingPoolRow accountBorrowableData={accountData.accountBorrowableBData} />
    </AccountLendingPoolContainer>
  );
}