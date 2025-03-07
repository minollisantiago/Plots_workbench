import { Data } from 'plotly.js';
import { lineData } from './line.models';

export const prepareLineData = (data: lineData): Data[] => {
  const plotData: Data[] = data.map(series => ({
    type: 'scatter',
    mode: 'lines',
    visible: series.visible ?? true,
    ...series
  }));
  return plotData;
};
