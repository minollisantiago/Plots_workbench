import { Data } from 'plotly.js';
import { LineData } from '@/components/plots/models';

export const prepareLineData = (data: Array<LineData>): Data[] => {
  const plotData: Data[] = data.map(series => ({
    type: 'scatter',
    mode: 'lines',
    opacity: series.opacity ?? 1,
    visible: series.visible ?? true,
    ...series
  }));
  return plotData;
};
