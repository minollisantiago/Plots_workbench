import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { useFilteredTimeSeries } from "@/hooks";
import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";
import { PlotScatterFigure, ScatterControls } from "@/components/plots/scatter";
import { prepareScatterData, combineSeriesToScatter } from '@/components/plots/utils';

interface Props {
  title?: string;
  defaultPeriod?: string;
  SeriesData: TimeSeriesData[];
};

export const PlotScatterTest = ({ title = "Scatter Plot", defaultPeriod = "All", SeriesData }: Props) => {
  const [selectedXId, setSelectedXId] = useState<string | undefined>();
  const [selectedYId, setSelectedYId] = useState<string | undefined>();
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods.find(p => p.label === defaultPeriod)!);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

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
  }, [filteredSeries]);

  const currentSeriesY = useMemo(() => {
    if (!selectedYId) return undefined;
    return filteredSeries.find(series => series.id === selectedYId);
  }, [filteredSeries]);

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

  const handleAddSeriesX = (series: TimeSeriesData) => {
    setSelectedXId(series.id);
  };

  const handleAddSeriesY = (series: TimeSeriesData) => {
    setSelectedYId(series.id);
  };

  const handleRemoveSeriesX = () => {
    setSelectedXId(undefined);
  };

  const handleRemoveSeriesY = () => {
    setSelectedYId(undefined);
  };

  /**
   * Handles the selection of a time period.
   *
   * This function updates the `timePeriod` state with the newly selected period and resets the `dateRange` state to `undefined`.
   * This ensures that the time period and date range filters are mutually exclusive.
   *
   * @param {TimePeriod} period - The selected time period.
   */
  const handleSelectPeriod = (period: TimePeriod) => {
    setTimePeriod(period);
    setDateRange(undefined);
  };

  /**
   * Handles the selection of a date range.
   *
   * This function updates the `dateRange` state with the newly selected date range and resets the `timePeriod` state to the `defaultPeriod`.
   * This ensures that the time period and date range filters are mutually exclusive.
   *
   * @param {DateRange | undefined} range - The selected date range.
   */
  const handleSetDateRange = (range: DateRange | undefined) => {
    setDateRange(range);
    setTimePeriod(periods.find(p => p.label === defaultPeriod)!);
  };

  return (

    <div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full">

      {/* Controls */}
      <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">
        <CanvasHeader title={title} />
        <div className="flex-1 min-h-0">
          < ScatterControls
            searchTriggerLabel="Select a strategy"
            searchPlaceholder="Search strategies"
            seriesX={currentSeriesX}
            seriesY={currentSeriesY}
            availableSeries={SeriesData}
            onAddSeriesX={handleAddSeriesX}
            onAddSeriesY={handleAddSeriesY}
            onRemoveSeriesX={handleRemoveSeriesX}
            onRemoveSeriesY={handleRemoveSeriesY}
          />
        </div>
      </div>

      {/* Figure */}
      {plotData ? (
        <div className="flex flex-col space-y-4 p-2 h-full">
          <div className="flex justify-end">
            <TimePeriodSelector
              periods={periods}
              selectedPeriod={timePeriod}
              selectedDateRange={dateRange}
              onPeriodSelect={handleSelectPeriod}
              onDateRangeSelect={handleSetDateRange}
            />
          </div>
          <PlotScatterFigure data={plotData} theme="dark" />
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          Select Series to display the plot
        </div>
      )}
    </div>
  )
}

