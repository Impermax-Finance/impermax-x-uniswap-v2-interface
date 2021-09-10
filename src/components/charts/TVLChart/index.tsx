
import * as React from 'react';
import { createChart } from 'lightweight-charts';
import { useMeasure } from 'react-use';

import data from './data.json';

const TVLChart = (props: React.ComponentPropsWithRef<'div'>): JSX.Element => {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [
    outerRef,
    {
      width: containerWidth,
      height: containerHeight
    }
  ] = useMeasure<HTMLDivElement>();

  React.useEffect(() => {
    if (!innerRef.current) return;
    if (!containerWidth) return;
    if (!containerHeight) return;

    const chart = createChart(innerRef.current, {
      width: containerWidth,
      height: containerHeight
    });
    const lineSeries = chart.addLineSeries();
    lineSeries.setData(data);

    return () => {
      chart.remove();
    };
  }, [
    containerWidth,
    containerHeight
  ]);

  return (
    <div
      ref={outerRef}
      {...props}>
      <div ref={innerRef} />
    </div>
  );
};

export default TVLChart;
