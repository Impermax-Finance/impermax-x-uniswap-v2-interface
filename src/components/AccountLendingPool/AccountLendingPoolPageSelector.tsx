import React, { useContext, useState } from "react";
import { AccountLendingPoolPage } from ".";
import { PoolTokenType } from "../../impermax-router/interfaces";
import { useFarmingAPY, useHasFarming } from "../../hooks/useData";

export interface AccountLendingPoolPageSelectorProps {
  pageSelected: AccountLendingPoolPage;
  setPageSelected: Function;
}

export default function AccountLendingPoolPageSelector({pageSelected, setPageSelected}: AccountLendingPoolPageSelectorProps) {
  const hasFarmingA = useHasFarming(PoolTokenType.BorrowableA);
  const hasFarmingB = useHasFarming(PoolTokenType.BorrowableA);
  return (
    <div className="account-lending-pool-page-selector">
      { pageSelected === AccountLendingPoolPage.LEVERAGE ? (
        <div className="selected">Borrowing</div>
      ) : (
        <div onClick={() => setPageSelected(AccountLendingPoolPage.LEVERAGE) }>Borrowing</div>
      ) }
      { pageSelected === AccountLendingPoolPage.EARN_INTEREST ? (
        <div className="selected">Lending</div>
      ) : (
         <div onClick={() => setPageSelected(AccountLendingPoolPage.EARN_INTEREST) }>Lending</div>
     ) }
     { (hasFarmingA || hasFarmingB) && (<>
      { pageSelected === AccountLendingPoolPage.FARMING ? (
        <div className="selected">IMX Farming</div>
      ) : (
         <div onClick={() => setPageSelected(AccountLendingPoolPage.FARMING) }>IMX Farming</div>
      ) }
     </>)}
    </div>
  );
}