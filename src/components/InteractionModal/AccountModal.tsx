import React, { useState, useCallback } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody, InteractionModalContainer } from ".";
import { InputGroup, Button, FormControl, Row, Col, Spinner } from "react-bootstrap";
import NumericalInput from "../NumericalInput";
import { PoolTokenType, ApprovalType } from "../../impermax-router/interfaces";
import RiskMetrics from "../RiskMetrics";
import { formatFloat, formatToDecimals } from "../../utils/format";
import InputAmount, { InputAmountMini } from "../InputAmount";
import InteractionButton, { ButtonState } from "../InteractionButton";
import useDeleverage from "../../hooks/useDeleverage";
import { decimalToBalance } from "../../utils/ether-utils";
import useApprove from "../../hooks/useApprove";
import { useSymbol, useDecimals, useDeposited, useBorrowed, useExchangeRate, useDeleverageAmounts, useToBigNumber, useToTokens } from "../../hooks/useData";
import { TransactionDetails } from "../../state/transactions/reducer";
import { useTransactionUrl } from "../../hooks/useUrlGenerator";
import { useChainId } from "../../hooks/useNetwork";
import { clearAllTransactions } from "../../state/transactions/actions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state";

const MAX_TRANSACTION_HISTORY = 10;

export interface TransactionProps {
  tx: TransactionDetails;
  pending?: boolean
}

function Transaction({tx, pending}: TransactionProps) {
  const transactionUrl = useTransactionUrl(tx.hash);
  return (
    <div className="transaction-row">
      <a href={transactionUrl} target="_blank">
        { tx.summary }
        { pending ? (
          <Spinner animation="border" size="sm" />
        ) : null }
      </a>
    </div>
  );
}

export interface AccountModalProps {
  show: boolean;
  toggleShow(s: boolean): void;
  pending: Array<TransactionDetails>;
  confirmed: Array<TransactionDetails>;
}

export default function AccountModal({show, toggleShow, pending, confirmed}: AccountModalProps) {
  const chainId = useChainId();
  const dispatch = useDispatch<AppDispatch>()
  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <InteractionModalContainer title="Transactions" show={show} toggleShow={toggleShow}><>
      { pending.length == 0 && confirmed.length == 0 ? (
        <div>You have no recent transaction</div>
      ) : (<>
        <span onClick={clearAllTransactionsCallback} className="clear-all-transactions">Clear all transactions</span>
        { pending.length > 0 && (
          <div>{ 
            pending.map((tx: TransactionDetails, key: any) => <Transaction tx={tx} key={key} pending={true} />)
          }</div>
        ) }
        { confirmed.length > 0 && (
          <div>{ 
            confirmed
              .slice(0, MAX_TRANSACTION_HISTORY)
              .map((tx: TransactionDetails, key: any) => <Transaction tx={tx} key={key} />)
          }</div>
        ) }
      </>) }
    </></InteractionModalContainer>
  );
}