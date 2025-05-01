import { Data } from 'plotly.js';
import { ScatterData } from '@/components/plots/models';

/**
 * Transforms an array of ScatterData objects into an array of Plotly.js Data objects.
 * This function is used to prepare scatter plot data for rendering with Plotly.js.
 *
 * @param {Array<ScatterData>} data - An array of ScatterData objects.
 * @returns {Data[]} An array of Plotly.js Data objects.
 */
export const prepareScatterData = (data: Array<ScatterData>): Data[] => {
  const plotData: Data[] = data.map(series => ({
    type: 'scatter',
    mode: 'markers',
    visible: series.visible ?? true,
    opacity: series.opacity ?? 1,
    "marker.size": series.marker.size ?? 6,
    "marker.symbol": series.marker.symbol ?? 'circle',
    "marker.opacity": series.marker.opacity ?? 1,
    "marker.line.width": series.marker.line?.width ?? 1,
    ...series
  }));
  return plotData;
};
