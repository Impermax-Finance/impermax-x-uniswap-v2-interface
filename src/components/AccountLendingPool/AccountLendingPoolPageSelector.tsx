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
        <div className="selected">Borrowing</div>
      ) : (
        <div onClick={() => setPageSelected(AccountLendingPoolPage.LEVERAGE) }>Borrowing</div>
      ) }
      { pageSelected === AccountLendingPoolPage.EARN_INTEREST ? (
        <div className="selected">Lending</div>
      ) : (
         <div onClick={() => setPageSelected(AccountLendingPoolPage.EARN_INTEREST) }>Lending</div>
     ) }
    </div>
  );
}