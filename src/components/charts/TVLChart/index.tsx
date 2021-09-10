
import * as React from 'react';
import { createChart } from 'lightweight-charts';

import data from './data.json';

const TVLChart = (): JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    const chart = createChart(ref.current, {
      width: 400,
      height: 300
    });
    const lineSeries = chart.addLineSeries();
    lineSeries.setData(data);

    return () => {
      chart.remove();
    };
  }, []);

  return (
    <>
      <div ref={ref} />
    </>
  );
};

export default TVLChart;
