import { useState } from "react";
import { useFilteredTimeSeries } from "@/hooks";
import { PlotLineFigure } from "./plot-line-figure";
import { LineControls } from "./plot-line-controls";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { TimePeriodSelector, CanvasHeader } from "@/components/plots/ui";
import { TimePeriod, periods, TimeSeriesData } from "@/components/plots/models";

interface Props {
  title: string;
}

// Example data
const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series

export const PlotLine = ({ title }: Props) => {
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([])
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({});
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods.find(p => p.label === "All")!);

  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeriesIds((prev) => (
      prev.includes(series.id) ? prev : [...prev, series.id]
    ));
  };

  const handleRemoveSeries = (id: string) => {
    setSelectedSeriesIds((prev) => prev.filter(seriesId => seriesId !== id))
    setVisibleSeries((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    })
  }

  const handleTogglePlotVisibility = (id: string) => {
    setVisibleSeries(prev => ({
      ...prev, [id]: !(prev[id] ?? true)
    }))
  };

  const handleSelectPeriod = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  const filteredSeries = useFilteredTimeSeries({
    allSeries: exampleSeries,
    selectedSeriesIds: selectedSeriesIds,
    period: timePeriod,
  });

  return (

    <div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full">

      {/* Controls */}
      <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">
        <CanvasHeader title={title} />
        <div className="flex-1 min-h-0">
          < LineControls
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={filteredSeries}
            availableSeries={exampleSeries}
            toggledSeries={visibleSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
          />
        </div>
      </div>

      {/* Figure */}
      {filteredSeries.length > 0 ? (
        <div className="flex flex-col space-y-4 p-2 h-full">
          <div className="flex justify-end">
            <TimePeriodSelector
              periods={periods}
              defaultSelected={periods.find(p => p.label === "All")}
              onSelect={handleSelectPeriod}
            />
          </div>
          <PlotLineFigure
            data={filteredSeries.map(series => ({
              ...series.plotData, visible: visibleSeries[series.id] ?? true
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

