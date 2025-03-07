import { Data } from 'plotly.js';
import { scatterData } from './scatter.models';

export const prepareScatterData = (data: scatterData): Data[] => {
  const plotData: Data[] = data.map(series => ({
    type: 'scatter',
    mode: 'markers',
    visible: series.visible ?? true,
    marker: {
      size: series.markerSize ?? 6,
      symbol: series.markerSymbol ?? 'circle',
      opacity: series.markerOpacity ?? 1,
    },
    ...series
  }));
  return plotData;
};
