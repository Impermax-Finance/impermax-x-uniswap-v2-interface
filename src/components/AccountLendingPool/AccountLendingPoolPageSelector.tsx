import React, { useContext, useState } from "react";
import { AccountLendingPoolPage } from ".";

export interface AccountLendingPoolPageSelectorProps {
  pageSelected: AccountLendingPoolPage;
  setPageSelected: Function;
}

export default function AccountLendingPoolPageSelector({pageSelected, setPageSelected}: AccountLendingPoolPageSelectorProps) {
  return (
    <div className="account-lending-pool-page-selector">
      { pageSelected === AccountLendingPoolPage.LEVERAGE ? (
        <div className="selected">Leverage LP</div>
      ) : (
        <div onClick={() => setPageSelected(AccountLendingPoolPage.LEVERAGE) }>Leverage LP</div>
      ) }
      { pageSelected === AccountLendingPoolPage.EARN_INTEREST ? (
        <div className="selected">Earn Interest</div>
      ) : (
         <div onClick={() => setPageSelected(AccountLendingPoolPage.EARN_INTEREST) }>Earn Interest</div>
     ) }
    </div>
  );
}