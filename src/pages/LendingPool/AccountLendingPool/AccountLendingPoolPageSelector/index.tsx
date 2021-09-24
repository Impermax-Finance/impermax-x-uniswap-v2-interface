import { AccountLendingPoolPage } from '../';
import { PoolTokenType } from 'types/interfaces';
import { useHasFarming } from 'hooks/useData';

function AccountLendingPoolPageSelector({
  pageSelected,
  setPageSelected
}: AccountLendingPoolPageSelectorProps): JSX.Element {
  // ray test touch <<
  const hasFarmingA = useHasFarming(PoolTokenType.BorrowableA);
  const hasFarmingB = useHasFarming(PoolTokenType.BorrowableA);
  // ray test touch >>

  return (
    <div className='account-lending-pool-page-selector'>
      {pageSelected === AccountLendingPoolPage.Leverage ? (
        <div className='selected'>Borrowing</div>
      ) : (
        <div onClick={() => setPageSelected(AccountLendingPoolPage.Leverage)}>Borrowing</div>
      )}
      {pageSelected === AccountLendingPoolPage.EarnInterest ? (
        <div className='selected'>Lending</div>
      ) : (
        <div onClick={() => setPageSelected(AccountLendingPoolPage.EarnInterest)}>Lending</div>
      )}
      {(hasFarmingA || hasFarmingB) && (
        <>
          {pageSelected === AccountLendingPoolPage.Farming ? (
            <div className='selected'>IMX Farming</div>
          ) : (
            <div onClick={() => setPageSelected(AccountLendingPoolPage.Farming)}>IMX Farming</div>
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
