import { useMemo } from "react";
import { Data } from 'plotly.js';
import { DateRange } from "react-day-picker";
import { useFilteredTimeSeries } from "@/hooks";
import { TimeSeriesData, TimePeriod } from "@/components/plots/models";
import { prepareScatterData, combineSeriesToScatter } from '@/components/plots/utils';

interface useScatterPlotDataProps {
  selectedXId: string | undefined;
  selectedYId: string | undefined;
  SeriesData: TimeSeriesData[];
  timePeriod: TimePeriod;
  dateRange?: DateRange | undefined;
};

interface useScatterPlotDataReturn {
  currentSeriesX: TimeSeriesData | undefined;
  currentSeriesY: TimeSeriesData | undefined;
  plotData: Data[] | undefined;
};

/**
 * Hook to manage and prepare data for a scatter plot.
 *
 * This hook orchestrates the data filtering, combination, and preparation steps required to generate
 * the final plot data for a scatter plot, based on selected X and Y series, time period, and date range.
 *
 * Data Flow:
 * 1. **Input:** Takes `selectedXId`, `selectedYId`, `timePeriod`, `dateRange`, and `SeriesData` as inputs.
 * 2. **Active Series IDs:** Creates a list of unique active series IDs (`uniqueActiveSeriesIds`) based on `selectedXId` and `selectedYId`.
 * 3. **Filtered Series:** Uses the `useFilteredTimeSeries` hook to filter the `SeriesData` based on `uniqueActiveSeriesIds`, `timePeriod`, and `dateRange`.
 * 4. **Current Series:** Extracts the `currentSeriesX` and `currentSeriesY` from the filtered series based on `selectedXId` and `selectedYId`.
 * 5. **Combined Series:** Combines `currentSeriesX` and `currentSeriesY` into a single series suitable for a scatter plot.
 * 6. **Plot Data:** Prepares the final `plotData` in a format compatible with the plotting library.
 * 7. **Output:** Returns an object containing `currentSeriesX`, `currentSeriesY`, and `plotData`.
 *
 * @param {useScatterPlotDataProps} props - The hook props.
 * @param {string | undefined} props.selectedXId - The ID of the selected series for the X axis.
 * @param {string | undefined} props.selectedYId - The ID of the selected series for the Y axis.
 * @param {TimePeriod} props.period - A TimePeriod object that defines the time period to filter the data by.
 * @param {DateRange | undefined} props.dateRange - An optional DateRange object that defines the date range to filter the data by.
 * @param {TimeSeriesData[]} props.SeriesData - An array of all available time series data.
 * @returns {useScatterPlotDataReturn} - An object containing the prepared data for the scatter plot.
 */
export const useScatterPlotData = ({
  selectedXId,
  selectedYId,
  timePeriod,
  dateRange,
  SeriesData,
}: useScatterPlotDataProps): useScatterPlotDataReturn => {

  const uniqueActiveSeriesIds = useMemo(() => {
    const ids = new Set<string>();
    if (selectedXId) ids.add(selectedXId);
    if (selectedYId) ids.add(selectedYId);
    return Array.from(ids);
  }, [selectedXId, selectedYId]);

  const filteredSeries = useFilteredTimeSeries({
    allSeries: SeriesData,
    selectedSeriesIds: uniqueActiveSeriesIds,
    period: timePeriod,
    dateRange: dateRange,
  });

  const currentSeriesX = useMemo(() => {
    if (!selectedXId) return undefined;
    return filteredSeries.find(series => series.id === selectedXId);
  }, [selectedXId, filteredSeries]);

  const currentSeriesY = useMemo(() => {
    if (!selectedYId) return undefined;
    return filteredSeries.find(series => series.id === selectedYId);
  }, [selectedYId, filteredSeries]);

  const combinedSeries = useMemo(() => {
    if (!currentSeriesX || !currentSeriesY) return undefined;
    return combineSeriesToScatter(
      currentSeriesX,
      currentSeriesY,
      `${currentSeriesX.label} vs ${currentSeriesY.label}`,
      `${currentSeriesX.label} vs ${currentSeriesY.label}`,
    );
  }, [currentSeriesX, currentSeriesY]);

  const plotData = useMemo(() => {
    if (!combinedSeries) return undefined;
    return (prepareScatterData([combinedSeries]));
  }, [combinedSeries]);

  return { currentSeriesX, currentSeriesY, plotData };
};
