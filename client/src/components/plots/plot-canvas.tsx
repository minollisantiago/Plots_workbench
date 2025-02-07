import { cn } from "@/lib/utils";
import { useState } from "react";
import { TimeSeriesData } from "@/models";
import { PlotLine } from "@/components/plots/plot-line";
import { TimePeriodSelector } from "@/components/plots/ui";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { SeriesControls, TimePeriod } from "@/components/plots/ui";

interface Props {
  title: string
  canvasHeight: string
}

export const PlotCanvas = ({ title, canvasHeight }: Props) => {
  const [selectedSeries, setSelectedSeries] = useState<TimeSeriesData[]>([])
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({})

  const exampleSeries = mockTimeSeriesData.series

  const periods: TimePeriod[] = ["1W", "1M", "3M", "6M", "YTD", "1Y", "All"]

  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeries((prev) => {
      if (!prev.some(s => s.id == series.id)) {
        return [...prev, series]
      }
      return prev;
    })
    console.log("Selected series:", selectedSeries);
  }


  const handleRemoveSeries = (id: string) => {
    setSelectedSeries((prev) => prev.filter(series => series.id !== id))
    setVisibleSeries((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    })
    console.log("Selected series:", selectedSeries);
  }

  const handleTogglePlotVisibility = (id: string) => {
    setVisibleSeries(prev => ({
      ...prev, [id]: !(prev[id] ?? true)
    }))
  }

  const handleSelectPeriod = (period: TimePeriod) => {
    console.log(`Selected period: ${period}`)
  }

  // if i increase the height if this container the plots dont render properly
  return (
    <div className={cn(
      "grid grid-cols-[324px_1fr] gap-2 p-4 border rounded-lg bg-background/95",
      canvasHeight ? canvasHeight : "h-[472px]"
    )}>

      {/* Controls */}
      <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">
        <h3 className="text-medium font-semibold">{title}</h3>
        <div className="flex-1 min-h-0">
          < SeriesControls
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={selectedSeries}
            availableSeries={exampleSeries}
            toggledSeries={visibleSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
            onTogglePlotVisibility={handleTogglePlotVisibility}
          />
        </div>
      </div>

      {/* Figure */}
      {selectedSeries.length > 0 ? (
        <div className="flex flex-col space-y-4 p-2 h-full">
          <div className="flex justify-end">
            <TimePeriodSelector
              periods={periods}
              defaultSelected="All"
              onSelect={(period) => handleSelectPeriod(period)}
            />
          </div>
          <PlotLine
            data={selectedSeries.map(series => ({
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

