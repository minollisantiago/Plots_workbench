import { useState } from "react"
import { Series } from "@/components/plots/types"
import SeriesGroup from "@/components/plots/series-group"
import ColorPicker from "@/components/plots/color-picker"
import { mockTimeSeriesData } from "@/data/mock/time-series-data"

const PlotCanvas = () => {

  const [SelectedSeries, setSelectedSeries] = useState([] as Series[])
  const exampleSeries = mockTimeSeriesData.series

  const handleAddSeries = (series: Series) => {
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

      < SeriesGroup
        header="Strategies"
        searchTriggerLabel="Add strategies"
        searchPlaceholder="Search strategies"
        series={SelectedSeries}
        availableSeries={exampleSeries}
        onAddSeries={handleAddSeries}
        onRemoveSeries={handleRemoveSeries}
      />
      < ColorPicker />

    </div>
  )
}

export default PlotCanvas
