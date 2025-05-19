I have this histogram plot component:

<llm_context path="/home/santiago/projects/testApps/components_workbench/client/src/components/plots/histogram/plot-hist.tsx" name="plot-hist.tsx" filetype="tsx">
```tsx
import { LayoutGrid } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useFilteredTimeSeries } from "@/hooks";
import { prepareHistData } from '@/components/plots/utils';
import { useState, useEffect, useRef, useMemo } from "react";
import { PlotHistFigure } from "@/components/plots/histogram";
import { LineControls } from "@/components/plots/line";
import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";

interface Props {
  title?: string;
  defaultPeriod?: string;
  SeriesData: TimeSeriesData[];
};

export const PlotHist = ({ title = "Histogram Plot", defaultPeriod = "All", SeriesData }: Props) => {
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  const [highlightedSeries, setHighlightedSeries] = useState<Record<string, number>>({});
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods.find(p => p.label === defaultPeriod)!);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Ref to store the timeout ID
  const resetHighlightTimeout = useRef<NodeJS.Timeout | null>(null);

  const filteredSeries = useFilteredTimeSeries({
    allSeries: SeriesData,
    selectedSeriesIds: selectedSeriesIds,
    period: timePeriod,
    dateRange: dateRange,
  });

  const plotData = useMemo(() => {
    return prepareHistData(filteredSeries, highlightedSeries, hiddenSeries);
  }, [filteredSeries, highlightedSeries, hiddenSeries]);


  // Initialize highlightedSeries with all IDs from SeriesData
  useEffect(() => {
    const initialHighlighted: Record<string, number> = {};
    filteredSeries.forEach(series => {
      initialHighlighted[series.id] = 1;
    });
    setHighlightedSeries(initialHighlighted);
  }, [filteredSeries]);

  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeriesIds((prev) => (
      prev.includes(series.id) ? prev : [...prev, series.id]
    ));
  };

  const handleRemoveSeries = (id: string) => {
    setSelectedSeriesIds((prev) => prev.filter(seriesId => seriesId !== id))
    setHiddenSeries((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    });
  };

  const handleTogglePlotVisibility = (id: string) => {
    setHiddenSeries(prev => ({
      ...prev, [id]: !(prev[id] ?? true)
    }));
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

  const handleTogglePlotHighlight = (id: string) => {
    // Clear any existing timeout
    if (resetHighlightTimeout.current) {
      clearTimeout(resetHighlightTimeout.current);
    }

    setHighlightedSeries(prev => {
      const updatedOpacities: Record<string, number> = { ...prev };
      for (const key in updatedOpacities) {
        if (key === id) {
          updatedOpacities[key] = 1;
        } else {
          updatedOpacities[key] = 0.2;
        };
      };
      return updatedOpacities;
    });
  };

  const handleResetHighlight = () => {
    setHighlightedSeries(prev => {
      const updatedOpacities: Record<string, number> = { ...prev };
      for (const key in updatedOpacities) {
        updatedOpacities[key] = 1;
      };
      return updatedOpacities;
    })
  };

  /**
   * Debounced function to reset the highlight after a delay.
   *
   * This function sets a timeout to call `handleResetHighlight` after a specified delay.
   * The timeout is used to debounce the effect, preventing unnecessary flickering
   * when quickly moving the mouse over the time series cards.
   */
  const debouncedHandleResetHighlight = () => {
    resetHighlightTimeout.current = setTimeout(() => {
      handleResetHighlight();
      resetHighlightTimeout.current = null; // Clear the timeout
    }, 100);
  };

  return (

    <div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full">

      {/* Controls */}
      <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">

        {/* Temp header */}
        <div className="flex flex-row space-x-2 pr-3 items-center w-full">
          <CanvasHeader title={title} />
          {filteredSeries.length > 1 &&
            <LayoutGrid className="w-4 h-4 opacity-1 cursor-pointer" />
          }

        </div>
        <div className="flex-1 min-h-0">
          < LineControls
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={filteredSeries}
            availableSeries={SeriesData}
            toggledSeries={hiddenSeries}
            highlightedSeries={highlightedSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
            onTogglePlotHighlight={handleTogglePlotHighlight}
            onToggleResetHighlight={debouncedHandleResetHighlight}
          />
        </div>
      </div>

      {/* Figure */}
      {filteredSeries.length > 0 ? (
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
          {filteredSeries.length > 1 ? (
            <div className="grid grid-flow-col gap-2 h-full">
              {plotData.map(series => (
                <PlotHistFigure
                  data={[series]}
                  theme="dark"
                />
              ))}

            </div>
          ) : (
            <PlotHistFigure
              data={plotData}
              theme="dark"
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          Select Series to display the plot
        </div>
      )}
    </div>
  )
}

```
</llm_context>

What id like to do is to add a new UX feature, where on clicking a button, if filteredSeries contains more than one time series, the button is rendered, and it allows the user to split all individual series into their own separate figure, all contained on a grid div

Ive included a first case example here, my first "iteration" of the change. But the first thing i want to do is to allow the plots to flow column wise inside the grid, but up to 3 rows, after which id like to continue flowing row-wise until we fill the third column and so forth




