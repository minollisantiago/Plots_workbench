import { useState } from "react";
import { TimeSeriesData } from "@/models";
import { SeriesControls, TimePeriod } from "@/components/plots/ui";
import { PlotLine } from "@/components/plots/plot-line";
import { TimePeriodSelector } from "@/components/plots/ui";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";

interface Props {
  title: string
}

export const PlotCanvas = ({ title }: Props) => {
  const [selectedSeries, setSelectedSeries] = useState<TimeSeriesData[]>([])

  const exampleSeries = mockTimeSeriesData.series

  const periods: TimePeriod[] = ["1W", "1M", "3M", "6M", "YTD", "1Y", "All"]

  const handleAddSeries = (series: TimeSeriesData) => {
    setSelectedSeries((prev) => {
      if (!prev.some(s => s.id == series.id)) {
        return [...prev, series]
      }
      return prev;
    })
  }

  const handleRemoveSeries = (id: string) => {
    setSelectedSeries((prev) => prev.filter(series => series.id !== id))
  }

  const handleSelectPeriod = (period: TimePeriod) => {
    console.log(`Selected period: ${period}`)
  }

  // if i increase the height if this container the plots dont render properly
  return (
    <div className="flex flex-col gap-2 p-4 h-full border rounded-lg bg-background/95">

      {/* Controls */}
      <div className="grid grid-cols-[324px_1fr] gap-4 p-2">
        <div className="flex flex-col space-y-4">
          <h3 className="text-medium font-semibold">{title}</h3>
          < SeriesControls
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={selectedSeries}
            availableSeries={exampleSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
          />
        </div>

        {/* Figure */}
        {selectedSeries.length > 0 ? (
          <div className="flex flex-col space-y-4">
            <div className="flex justify-end">
              <TimePeriodSelector
                periods={periods}
                defaultSelected="All"
                onSelect={(period) => handleSelectPeriod(period)}
              />
            </div>
            <PlotLine
              data={selectedSeries.map(series => series.plotData)}
              theme="dark"
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select Series to display the plot
          </div>
        )}
      </div>
    </div>
  )
}

