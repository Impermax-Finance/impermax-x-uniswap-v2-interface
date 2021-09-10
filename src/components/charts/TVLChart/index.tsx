
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
      height: containerHeight,
      layout: {
        textColor: '#6b7280',
        backgroundColor: '#fff'
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.25
        }
      },
      crosshair: {
        vertLine: {
          color: '#b8b9b9',
          style: 0
        },
        horzLine: {
          visible: false,
          labelVisible: false
        }
      },
      grid: {
        vertLines: {
          color: 'rgba(42, 46, 57, 0)'
        },
        horzLines: {
          color: 'rgba(42, 46, 57, 0)'
        }
      }
    });
    const areaSeries = chart.addAreaSeries({
      topColor: 'rgba(38, 198, 218, 0.56)',
      bottomColor: 'rgba(38, 198, 218, 0.04)',
      lineColor: 'rgba(38, 198, 218, 1)',
      lineWidth: 2
    });
    areaSeries.setData(data);

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
