import { useMemo } from "react";
import { DateRange } from "react-day-picker";
import { TimePeriod, TimeSeriesData } from "@/components/plots/models";

/**
 * useFilteredTimeSeries Hook
 *
 * Filters an array of time series data based on selected series IDs, a time period, and a date range.
 *
 * @param {Object} props - The props object.
 * @param {TimeSeriesData[]} props.allSeries - An array of all available time series data.
 * @param {string[]} props.selectedSeriesIds - An array of IDs of the series that should be included in the filtered result.
 * @param {TimePeriod} props.period - A TimePeriod object that defines the time period to filter the data by.
 * @param {DateRange | undefined} props.dateRange - An optional DateRange object that defines the date range to filter the data by.
 *
 * @returns {TimeSeriesData[]} A new array containing the filtered time series data.
 */

interface props {
  allSeries: TimeSeriesData[];
  selectedSeriesIds: string[];
  period: TimePeriod;
  dateRange?: DateRange | undefined;
};

export const useFilteredTimeSeries = ({ allSeries, selectedSeriesIds, period, dateRange }: props): TimeSeriesData[] => {

  return useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - period.days);

    return allSeries.filter(series => selectedSeriesIds.includes(series.id)).map(series => {
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
        plotData: {
          ...series.plotData,
          x: filteredData.x,
          y: filteredData.y,
        },
      };
    });
  }, [allSeries, selectedSeriesIds, period, dateRange]);
};
