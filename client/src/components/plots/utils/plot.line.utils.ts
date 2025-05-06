import { Data } from 'plotly.js';
import { LineData } from '@/components/plots/models';

/**
 * Transforms an array of LineData objects into an array of Plotly.js Data objects.
 * This function is used to prepare line plot data for rendering with Plotly.js.
 *
 * @param {Array<LineData>} data - An array of LineData objects.
 * @returns {Data[]} An array of Plotly.js Data objects.
 */
export const prepareLineData = (data: Array<LineData>): Data[] => {
  const plotData: Data[] = data.map(series => ({
    type: 'scatter',
    mode: 'lines',
    opacity: series.opacity ?? 1,
    visible: series.visible ?? true,
    ...series
  }));
  console.log("Line plot Series:", plotData);
  return plotData;
};
