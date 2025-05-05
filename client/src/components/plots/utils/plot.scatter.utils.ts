import { Data } from 'plotly.js';
import { ScatterData } from '@/components/plots/models';
import { TimeSeriesData } from '@/components/plots/models';

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


/**
 * Combines two TimeSeriesData objects into a new TimeSeriesData object
 * where the x values of the new series are the y values of the first series
 * and the y values of the new series are the y values of the second series.
 *
 * @param {TimeSeriesData} series1 - The first time series data. The y values of this series will be the x values of the new series.
 * @param {TimeSeriesData} series2 - The second time series data. The y values of this series will be the y values of the new series.
 * @param {string} newSeriesId - The id of the new series.
 * @param {string} newSeriesLabel - The label of the new series.
 * @returns {TimeSeriesData | undefined} A new TimeSeriesData object or undefined if the input series are invalid.
 */
export const combineSeriesToScatter = (
  series1: TimeSeriesData,
  series2: TimeSeriesData,
  newSeriesId: string,
  newSeriesLabel: string,
  newSeriesGroup: string = "",
  newSeriesColor: string = "#FFFFFF"
): TimeSeriesData | undefined => {
  if (
    !series1 ||
    !series2 ||
    !series1.plotData ||
    !series2.plotData ||
    series1.plotData.y.length !== series2.plotData.y.length
  ) {
    console.error("Invalid input series or series lengths do not match.");
    return undefined;
  }

  return {
    id: newSeriesId,
    label: newSeriesLabel,
    subLabel: `${series1.label} vs ${series2.label}`,
    color: newSeriesColor,
    group: newSeriesGroup,
    plotData: {
      x: series1.plotData.y,
      y: series2.plotData.y,
      name: `${series1.label} vs ${series2.label}`,
    },
  };
};
