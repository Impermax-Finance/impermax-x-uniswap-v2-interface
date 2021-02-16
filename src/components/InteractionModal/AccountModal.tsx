import React, { useState } from "react";
import InteractionModal, { InteractionModalHeader, InteractionModalBody } from ".";
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
  return (
    <InteractionModal show={show} onHide={() => toggleShow(false)}>
      <>
        <InteractionModalHeader value="Transactions" />
        <InteractionModalBody>
          { pending.length > 0 ? (
            <div>{ 
              pending.map((tx: TransactionDetails, key: any) => <Transaction tx={tx} key={key} pending={true} />)
            }</div>
          ) : null }
          { confirmed.length > 0 ? (
            <div>{ 
              confirmed
                .slice(0, MAX_TRANSACTION_HISTORY)
                .map((tx: TransactionDetails, key: any) => <Transaction tx={tx} key={key} />)
            }</div>
          ) : null }
          { pending.length == 0 && confirmed.length == 0 ? (
            <div>You have no recent transaction</div>
          ) : null }
        </InteractionModalBody>
      </>
    </InteractionModal>
  );
}