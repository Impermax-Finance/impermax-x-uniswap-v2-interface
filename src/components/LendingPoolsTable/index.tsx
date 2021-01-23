import React, { useContext, useEffect, useState } from 'react';
import {
  Link
} from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { LanguageContext } from '../../contexts/Language';
import phrases from './translations';
import { Currency, DAI, ETH } from './../../utils/currency';
import useContracts, { ContractInstances, AvailableContracts } from '../../hooks/useContracts';
import './index.scss';
import { UniswapPairs } from '../../utils/contracts';
import { pipe, compose, map } from 'ramda';

interface BorrowableData {
  currency: Currency;
  supply: string;
  borrowed: string;
  supplyAPY: string;
  borrowAPY: string;
  //farmingAPY: string;
}

interface LendingPoolsRowProps {
  tokenA: BorrowableData;
  tokenB: BorrowableData;
  uniswapV2PairAddress: string;
}

/**
 * Component for a single Lending Pool row.
 */
export function LendingPoolsRow(props: LendingPoolsRowProps) {

  const { tokenA, tokenB, uniswapV2PairAddress } = props;

  return (<tr className="lending-pools-row">
    <td>
      <div className="currency-name">
        <div className="combined">
          <div className="currency-overlapped">
            <img src={tokenA.currency.icon} />
            <img src={tokenB.currency.icon} />
          </div>
          <Link to={uniswapV2PairAddress}>{tokenA.currency.name}/{tokenB.currency.name}</Link>
        </div>
        <div>
          <div>
            <img className="currency-icon" src={tokenA.currency.icon} />
            {tokenA.currency.name}
          </div>
          <div>
            <img className="currency-icon" src={tokenB.currency.icon} />
            {tokenB.currency.name}
          </div>
        </div>
      </div>
    </td>
    <td className="text-center">
      <div>
        {tokenA.supply}
      </div>
      <div>
        {tokenB.supply}
      </div>
    </td>
    <td className="text-center">
      <div>
        {tokenA.borrowed}
      </div>
      <div>
        {tokenB.borrowed}
      </div>
    </td>
    <td className="text-center">
      <div>
        {tokenA.supplyAPY}
      </div>
      <div>
        {tokenB.supplyAPY}
      </div>
    </td>
    <td className="text-center">
      <div>
        {tokenA.borrowAPY}
      </div>
      <div>
        {tokenB.borrowAPY}
      </div>
    </td>
    {/*<td className="text-center">
      <div>
        {tokenA.farmingAPY}
      </div>
      <div>
        {tokenB.farmingAPY}
      </div>
    </td>*/}
  </tr>);
}

/**
 * Generate a searchable lending pools table.
 */
export function LendingPoolsTable() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const contracts = useContracts();

  const [lendingPoolRows, setLendingPoolRows] = useState([]);

  const setData = async (availableContracts: AvailableContracts) => {
  }
  
  useEffect(() => {

    
    
    
    
  }, [contracts]);

  const DaiBorrowableData: BorrowableData = {
    currency: DAI,
    supply: "$12.38M",
    borrowed: "$12.38M",
    supplyAPY: "8.34%",
    borrowAPY: "12.06%",
    //farmingAPY: "15.23%"
  };

  const EthBorrowableData: BorrowableData = {
    currency: ETH,
    supply: "$12.38M",
    borrowed: "$2.72M",
    supplyAPY: "8.34%",
    borrowAPY: "12.06%",
    //farmingAPY: "15.23%"
  }

  const t = (s: string) => (phrases[s][language]);
  return (<div className="lending-pools-table">
    <Table>
      <thead>
        <tr>
          <th>{t("Market")}</th>
          <th className="text-center">{t("Total Supply")}</th>
          <th className="text-center">{t("Total Borrowed")}</th>
          <th className="text-center">{t("Supply APY")}</th>
          <th className="text-center">{t("Borrow APY")}</th>
          {/*<th className="text-center">{t("Farming APY")}</th>*/}
        </tr>
      </thead>
      <tbody>
        <LendingPoolsRow
          uniswapV2PairAddress={'farming/eth-dai'}
          tokenA={DaiBorrowableData}
          tokenB={EthBorrowableData} />
      </tbody>
    </Table>
  </div>)
}