import { useState } from "react";
import { PlotLine } from "@/components/plots/plot-line";
import { SeriesControls } from "@/components/plots/ui";
import { TimeSeriesData } from "@/components/plots/types";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";

const PlotCanvas = () => {

  const [selectedSeries, setSelectedSeries] = useState<TimeSeriesData[]>([])
  const exampleSeries = mockTimeSeriesData.series

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

  // if i increase the height if this container the plots dont render properly
  return (

    <div id="mainContainer" className="content-grid place-content-center h-screen w-screen relative">

      <div className="grid grid-cols-[324px_1fr] gap-2 p-4 h-full border rounded-lg bg-background/95">
        <div className="flex flex-col space-y-2">
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

        <div className="h-full pt-4 pb-4">
          {selectedSeries.length > 0 ? (
            <PlotLine
              data={selectedSeries.map(series => series.plotData)}
              theme="dark"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select Series to display the plot
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlotCanvas
