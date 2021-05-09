import { AccountLendingPoolPage } from '.';
import { PoolTokenType } from '../../impermax-router/interfaces';
import { useHasFarming } from '../../hooks/useData';

function AccountLendingPoolPageSelector({
  pageSelected,
  setPageSelected
}: AccountLendingPoolPageSelectorProps): JSX.Element {
  const hasFarmingA = useHasFarming(PoolTokenType.BorrowableA);
  const hasFarmingB = useHasFarming(PoolTokenType.BorrowableA);
  return (
    <div className='account-lending-pool-page-selector'>
      {pageSelected === AccountLendingPoolPage.LEVERAGE ? (
        <div className='selected'>Borrowing</div>
      ) : (
        <div onClick={() => setPageSelected(AccountLendingPoolPage.LEVERAGE)}>Borrowing</div>
      )}
      {pageSelected === AccountLendingPoolPage.EARN_INTEREST ? (
        <div className='selected'>Lending</div>
      ) : (
        <div onClick={() => setPageSelected(AccountLendingPoolPage.EARN_INTEREST)}>Lending</div>
      )}
      {(hasFarmingA || hasFarmingB) && (
        <>
          {pageSelected === AccountLendingPoolPage.FARMING ? (
            <div className='selected'>IMX Farming</div>
          ) : (
            <div onClick={() => setPageSelected(AccountLendingPoolPage.FARMING)}>IMX Farming</div>
          )}
        </>
      )}
    </div>
  );
}

export interface AccountLendingPoolPageSelectorProps {
  pageSelected: AccountLendingPoolPage;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setPageSelected: Function;
}

export default AccountLendingPoolPageSelector;
