import { useMemo } from "react";
import { Data } from 'plotly.js';
import { DateRange } from "react-day-picker";
import { useFilteredTimeSeries } from "@/hooks";
import { TimeSeriesData, TimePeriod } from "@/components/plots/models";
import { prepareScatterData, combineSeriesToScatter } from '@/components/plots/utils';

interface useScatterPlotDataProps {
  selectedXId: string | undefined;
  selectedYId: string | undefined;
  timePeriod: TimePeriod;
  dateRange: DateRange | undefined;
  SeriesData: TimeSeriesData[];
};

interface useScatterPlotDataReturn {
  currentSeriesX: TimeSeriesData | undefined;
  currentSeriesY: TimeSeriesData | undefined;
  plotData: Data[] | undefined;
}

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
