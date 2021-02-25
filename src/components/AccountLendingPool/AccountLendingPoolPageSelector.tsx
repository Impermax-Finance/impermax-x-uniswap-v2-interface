import React, { useContext, useState } from "react";
import { LanguageContext } from "../../contexts/Language";
import phrases from './translations';
import { Row, Col, Button, Card } from "react-bootstrap";
import { PoolTokenType } from "../../impermax-router/interfaces";
import InlineAccountTokenInfo from "./InlineAccountTokenInfo";
import DepositInteractionModal from "../InteractionModal/DepositInteractionModal";
import BorrowInteractionModal from "../InteractionModal/BorrowInteractionModal";
import RepayInteractionModal from "../InteractionModal/RepayInteractionModal";
import WithdrawInteractionModal from "../InteractionModal/WithdrawInteractionModal";
import { useBorrowed, useSymbol, useDeposited, useDepositedUSD, useBorrowedUSD, useBorrowerList, useMaxBorrowable, useMaxWithdrawable } from "../../hooks/useData";
import { useTokenIcon } from "../../hooks/useUrlGenerator";
import DisabledButtonHelper from "../DisabledButtonHelper";
import { text } from "@fortawesome/fontawesome-svg-core";
import { AccountLendingPoolPage } from ".";

export interface AccountLendingPoolPageSelectorProps {
  pageSelected: AccountLendingPoolPage;
  setPageSelected: Function;
}

export default function AccountLendingPoolPageSelector({pageSelected, setPageSelected}: AccountLendingPoolPageSelectorProps) {
  return (
    <div className="account-lending-pool-page-selector">
      { pageSelected === AccountLendingPoolPage.LEVERAGE ? (
        <div className="selected">Leverage</div>
      ) : (
        <div onClick={() => setPageSelected(AccountLendingPoolPage.LEVERAGE) }>Leverage</div>
      ) }
      { pageSelected === AccountLendingPoolPage.EARN_INTEREST ? (
        <div className="selected">Earn Interest</div>
      ) : (
         <div onClick={() => setPageSelected(AccountLendingPoolPage.EARN_INTEREST) }>Earn Interest</div>
     ) }
    </div>
  );
}