import { TimeSeriesData } from '@/components/plots/models';

/**
 * Combines two TimeSeriesData objects into a new TimeSeriesData object
 * where the x values of the new series are the y values of the first series
 * and the y values of the new series are the y values of the second series.
 *
 * @param {TimeSeriesData} series1 - The first time series data. The y values of this series will be the x values of the new series.
 * @param {TimeSeriesData} series2 - The second time series data. The y values of this series will be the y values of the new series.
 * @param {string} newSeriesId - The id of the new series.
 * @param {string} newSeriesLabel - The label of the new series.
 * @param {string} newSeriesGroup - The group of the new series. Defaults to "".
 * @param {string} newSeriesColor - The color of the new series. Defaults to "#4DBE95".
 * @returns {TimeSeriesData | undefined} A new TimeSeriesData object or undefined if the input series are invalid.
 */
export const combineSeriesToScatter = (
  series1: TimeSeriesData,
  series2: TimeSeriesData,
  newSeriesId: string,
  newSeriesLabel: string,
  newSeriesGroup: string = "",
  newSeriesColor: string = "#4DBE95"
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
