import { Data } from 'plotly.js';
import { TimeSeriesData } from '@/components/plots/models';

/**
 * Generates Plotly.js data objects from the filtered time series data,
 * taking into account highlighted and hidden series.
 *
 * @param {TimeSeriesData[]} data - The filtered time series data to be plotted.
 * @param {Record<string, number>} highlightedSeries - An object mapping series IDs to highlight opacities.
 * @param {Record<string, boolean>} hiddenSeries - An object mapping series IDs to visibility (true for visible, false for hidden).
 * @param {boolean} [verbose=false] - If true, logs the generated plot data to the console.
 * @returns {Data[]} An array of Plotly.js data objects.
 */
export const prepareHistData = (
  data: Array<TimeSeriesData>,
  highlightedSeries: Record<string, number>,
  hiddenSeries: Record<string, boolean>,
  verbose: boolean = false,
): Data[] => {
  const plotData: Data[] = data.map(series => ({
    ...series.plotData,
    x: series.plotData.y,
    type: "histogram",
    orientation: "v",
    opacity: highlightedSeries[series.id] ?? 1,
    visible: hiddenSeries[series.id] ?? true,
    marker: {
      opacity: 1,
      color: series.color,
      line: {
        color: "#303136",
        width: 2,
      }
    },
  }));
  if (verbose) console.log("Histogram plot data:", plotData);
  return plotData;
};
