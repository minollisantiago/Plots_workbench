import { useState } from "react"
import SeriesGroup from "@/components/plots/series-group"
import ColorPicker from "@/components/plots/color-picker"
import { TimeSeriesData } from "@/data/mock/time-series-data"
import { mockTimeSeriesData } from "@/data/mock/time-series-data"
import { PlotLine } from "@/components/plots/plot-line"

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

  return (

    <div id="mainContainer" className="content-grid place-content-center h-screen w-screen relative">

      <div className="grid grid-cols-[324px_1fr] gap-2 p-4 h-full">
        <div className="flex flex-col space-y-2">
          < SeriesGroup
            header="Strategies"
            searchTriggerLabel="Add strategies"
            searchPlaceholder="Search strategies"
            series={selectedSeries}
            availableSeries={exampleSeries}
            onAddSeries={handleAddSeries}
            onRemoveSeries={handleRemoveSeries}
          />
          < ColorPicker />
        </div>

        <div className="bg-background/95 border rounded-lg p-4 h-full">
          {selectedSeries.length > 0 ? (
            <PlotLine
              data={selectedSeries.map(series => series.plotData)}
              title="Test plot"
              theme="dark"
              height="100%"
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
