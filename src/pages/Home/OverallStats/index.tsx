
import OverallStatsInternal from 'components/OverallStatsInternal';
import {
  useTotalValueLocked,
  useTotalValueSupplied,
  useTotalValueBorrowed
} from 'hooks/useData';
import './index.scss';

const OverallStats = (): JSX.Element => {
  const totalValueLocked = useTotalValueLocked();
  const totalValueSupplied = useTotalValueSupplied();
  const totalValueBorrowed = useTotalValueBorrowed();

  return (
    <OverallStatsInternal
      totalValueLocked={totalValueLocked}
      totalValueSupplied={totalValueSupplied}
      totalValueBorrowed={totalValueBorrowed} />
  );
};

export default OverallStats;
