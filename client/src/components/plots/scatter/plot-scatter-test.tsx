import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { useFilteredTimeSeries } from "@/hooks";
import { combineSeriesToScatter } from '@/components/plots/utils';
import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";
import { PlotScatterFigure, ScatterControls } from "@/components/plots/scatter";

interface Props {
  title?: string;
  defaultPeriod?: string;
  SeriesData: TimeSeriesData[];
};

export const PlotScatterTest = ({ title = "Scatter Plot", defaultPeriod = "All", SeriesData }: Props) => {
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>(["4", "5"]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods.find(p => p.label === defaultPeriod)!);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredSeries = useFilteredTimeSeries({
    allSeries: SeriesData,
    selectedSeriesIds: selectedSeriesIds,
    period: timePeriod,
    dateRange: dateRange,
  });

  const combinedSeries = useMemo(() => {
    if (filteredSeries.length === 2) {
      const comb = combineSeriesToScatter(
        filteredSeries[0],
        filteredSeries[1],
        "combined",
        "combined"
      );
      console.log("The new series is:", comb);
      return comb;
    };
    return undefined;
  }, [filteredSeries])

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
          {/* ScatterControls */}
        </div>
      </div>

      {/* Figure */}
      {combinedSeries ? (
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
          <PlotScatterFigure
            data={[combinedSeries].map(series => ({
              ...series.plotData,
              marker: { color: series.color, size: 6, symbol: "circle", opacity: 1 },
            }))}
            theme="dark"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          Select Series to display the plot
        </div>
      )}
    </div>
  )
}

