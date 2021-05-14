import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'use-wallet';
import { AppDispatch, AppState } from '../index';
import { checkedTransaction, finalizeTransaction } from './actions';
import useInterval from 'use-interval';
import useWeb3 from '../../hooks/useWeb3';

export function shouldCheck(
  lastBlockNumber: number,
  // eslint-disable-next-line @typescript-eslint/ban-types
  tx: { addedTime: number; receipt?: {}; lastCheckedBlockNumber?: number }
): boolean {
  if (tx.receipt) return false;
  if (!tx.lastCheckedBlockNumber) return true;
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber;
  if (blocksSinceCheck < 1) return false;
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60;
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9;
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2;
  } else {
    // otherwise every block
    return true;
  }
}

export default function Updater(): null {
  const { chainId, ethereum } = useWallet();

  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector<AppState, AppState['transactions']>(state => state.transactions);

  const transactions = chainId ? state[chainId] ?? {} : {};

  const web3 = useWeb3();
  const [lastBlockNumber, setBlockNumber] = useState<number>();
  useInterval(() => {
    if (!web3) return;
    web3.eth.getBlockNumber().then((data: any) => setBlockNumber(data));
  }, 3000);

  useEffect(() => {
    if (!chainId || !ethereum || !lastBlockNumber) return;

    Object.keys(transactions)
      .filter(hash => shouldCheck(lastBlockNumber, transactions[hash]))
      .forEach(hash => {
        web3.eth
          .getTransactionReceipt(hash)
          .then((receipt: any) => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex
                  }
                })
              );
            } else {
              dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }));
            }
          })
          .catch((error: any) => {
            console.error(`failed to check transaction hash: ${hash}`, error);
          });
      });
  }, [chainId, ethereum, transactions, lastBlockNumber, dispatch]);

  return null;
}
