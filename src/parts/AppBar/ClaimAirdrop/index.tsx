
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { Contract } from '@ethersproject/contracts';
import {
  TransactionResponse,
  TransactionReceipt
} from '@ethersproject/abstract-provider';

import ImpermaxJadeContainedButton from 'components/buttons/ImpermaxJadeContainedButton';
import getAirdropData from 'services/get-airdrop-data';
import { formatAmount } from 'utils/format';
import MerkleDistributorJSON from 'abis/contracts/IMerkleDistributor.json';
import { MERKLE_DISTRIBUTOR_ADDRESSES } from 'config/web3/contracts/merkle-distributors';
import { useTransactionAdder } from 'store/transactions/hooks';
import { AirdropData } from 'types/airdrop';
import STATUSES from 'utils/constants/statuses';

const useMerkleDistributorContract = () => {
  const {
    chainId,
    library,
    account
  } = useWeb3React<Web3Provider>();

  if (!chainId) return null;
  if (!library) return null;
  if (!account) return null;

  const signer = library.getSigner(account);
  const merkleDistributorContractAddress = MERKLE_DISTRIBUTOR_ADDRESSES[chainId];

  if (!merkleDistributorContractAddress) {
    throw new Error('Undefined merkle distributor contract address!');
  }

  const merkleDistributorContract =
    new Contract(merkleDistributorContractAddress, MerkleDistributorJSON.abi, signer);

  return merkleDistributorContract;
};

const ClaimAirdrop = (): JSX.Element | null => {
  const {
    chainId,
    account
  } = useWeb3React<Web3Provider>();

  const addTransaction = useTransactionAdder();

  const [airdropData, setAirdropData] = React.useState<AirdropData>();
  const [claimed, setClaimed] = React.useState<boolean>();
  const [claimStatus, setClaimStatus] = React.useState(STATUSES.IDLE);

  const merkleDistributorContract = useMerkleDistributorContract();

  React.useEffect(() => {
    if (!chainId) return;
    if (!account) return;

    (async () => {
      try {
        const theAirdropData = await getAirdropData(chainId, account);

        setAirdropData(theAirdropData);
      } catch (error) {
        console.log('[ClaimAirdrop useEffect] error.message => ', error.message);
      }
    })();
  }, [
    chainId,
    account
  ]);

  React.useEffect(() => {
    if (!airdropData) return;
    if (!merkleDistributorContract) return;

    try {
      (async () => {
        const theClaimed = await merkleDistributorContract.isClaimed(airdropData.index);
        setClaimed(!!theClaimed);
      })();
    } catch (error) {
      console.log('[ClaimAirdrop useEffect] error.message => ', error.message);
    }
  }, [
    airdropData,
    merkleDistributorContract
  ]);

  const handleClaim = async () => {
    try {
      if (!merkleDistributorContract) {
        throw new Error('Invalid merkleDistributorContract!');
      }
      if (!airdropData) {
        throw new Error('Invalid airdropData!');
      }
      if (!account) {
        throw new Error('Invalid account!');
      }

      setClaimStatus(STATUSES.PENDING);
      const tx: TransactionResponse =
        await merkleDistributorContract.claim(airdropData.index, account, airdropData.amount, airdropData.proof);
      const receipt: TransactionReceipt = await tx.wait();

      // const amount = parseFloat(airdropData.amount.toString()) / 1e18; // TODO: update other cases
      const amount = parseFloat(formatUnits(airdropData.amount));
      const summary = `Claim ${formatAmount(amount)} IMX`;
      addTransaction({ hash: receipt.transactionHash }, { summary });
      setClaimStatus(STATUSES.RESOLVED);
    } catch (error) {
      setClaimStatus(STATUSES.REJECTED);
      console.log('[handleClaim] error.message => ', error.message);
    }
  };

  if (!airdropData?.amount) return null;
  if (claimed) return null;

  return (
    <ImpermaxJadeContainedButton
      pending={claimStatus === STATUSES.PENDING}
      onClick={handleClaim}>
      Claim {formatAmount(parseFloat(formatUnits(airdropData.amount)))} IMX
    </ImpermaxJadeContainedButton>
  );
};

export default ClaimAirdrop;
