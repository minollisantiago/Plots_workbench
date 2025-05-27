import { useMemo } from "react";
import { DateRange } from "react-day-picker";
import { useColorStore } from "@/store/global.color.store";
import { TimePeriod, TimeSeriesData } from "@/components/plots/models";

interface props {
  allSeries: TimeSeriesData[];
  selectedSeriesIds: string[];
  period: TimePeriod;
  dateRange?: DateRange | undefined;
};

/**
 * @hook useFilteredTimeSeries
 *
 * @description
 * Filters an array of time series data based on selected series IDs, a time period, and an optional date range.
 * It utilizes `useMemo` to memoize the filtered data, ensuring that the filtering logic is only re-executed when its dependencies change.
 *
 * @param {Object} props - The props object.
 * @param {TimeSeriesData[]} props.allSeries - An array of all available time series data.
 * @param {string[]} props.selectedSeriesIds - An array of IDs of the series that should be included in the filtered result.
 * @param {TimePeriod} props.period - A TimePeriod object that defines the time period to filter the data by.
 * @param {DateRange | undefined} props.dateRange - An optional DateRange object that defines the date range to filter the data by.
 *
 * @returns {TimeSeriesData[]} A new array containing the filtered time series data.
 *
 * @example
 * // Usage:
 * const filteredData = useFilteredTimeSeries({
 *   allSeries: allTimeSeriesData,
 *   selectedSeriesIds: ['series1', 'series2'],
 *   period: { days: 30 },
 *   dateRange: { from: new Date('2023-01-01'), to: new Date('2023-01-31') }
 * });
 *
 * // The 'filteredData' array will contain only the time series data with IDs 'series1' and 'series2',
 * // filtered to include data points within the last 30 days and between January 1, 2023, and January 31, 2023.
 *
 * @flow
 * 1. The hook receives an array of time series data (`allSeries`), an array of selected series IDs (`selectedSeriesIds`),
 *    a time period (`period`), and an optional date range (`dateRange`) as input.
 * 2. It calculates a `cutoffDate` based on the provided `period`, which is used to filter data points within the specified time period.
 * 3. It filters the `allSeries` array to include only the series whose IDs are present in the `selectedSeriesIds` array.
 * 4. It calls the `assignFixedColors` function from the `useColorStore` to assign a fixed color to each series if the series does not have one.
 * 5. For each selected series, it filters the data points (`x` and `y` values) based on the `cutoffDate` and the `dateRange`.
 * 6. It returns a new array of `TimeSeriesData` objects, where each object contains the filtered data points and assigned color.
 * 7. The hook uses `useMemo` to memoize the filtered data, ensuring that the filtering logic is only re-executed when its dependencies change.
 */
export const useFilteredTimeSeries = ({ allSeries, selectedSeriesIds, period, dateRange }: props): TimeSeriesData[] => {
  const assignFixedColors = useColorStore((state) => state.assignFixedColors);

  return useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - period.days);

    const filteredSeries = allSeries.filter(series => selectedSeriesIds.includes(series.id));
    const colors = assignFixedColors(filteredSeries.length);

    return filteredSeries.map((series, index) => {
      const { x: originalX, y: originalY } = series.plotData;

      const filteredData = originalX.reduce<{ x: (number | string)[], y: number[] }>((acc, date, index) => {
        const itemDate = new Date(date);

        if (
          itemDate >= cutoffDate &&
          (!dateRange?.from || itemDate >= dateRange.from) &&
          (!dateRange?.to || itemDate <= dateRange.to)
        ) {
          acc.x.push(date);
          acc.y.push(originalY[index]);
        }

        return acc;
      }, { x: [], y: [] });

      return {
        ...series,
        color: series.color || colors[index] || "#FFFFFF",
        plotData: {
          ...series.plotData,
          x: filteredData.x,
          y: filteredData.y,
        },
      };
    });
  }, [allSeries, selectedSeriesIds, period, dateRange, assignFixedColors]);
};
