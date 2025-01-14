import { useState } from "react"
import { Series } from "@/components/plots/types"
import SeriesGroup from "@/components/plots/series-group"
import ColorPicker from "@/components/plots/color-picker"

const PlotCanvas = () => {

  const [SelectedSeries, setSelectedSeries] = useState([] as Series[])

  const exampleSeries = [
    {
      id: "1",
      label: "NVDA",
      subLabel: "Share Price",
      color: "#E9EC89",
      group: "Tech"
    },
    {
      id: "2",
      label: "AMZN",
      subLabel: "Share Price",
      color: "#489FFA",
      group: "Consumer"
    },
    {
      id: "3",
      label: "TSLA",
      subLabel: "Share Price",
      color: "#C88FCF",
      group: "Tech"
    },
  ]

  const handleAddSeries = (series: Series) => {
    setSelectedSeries((prev) => [...prev, series])
  }

  const handleRemoveSeries = (id: string) => {
    setSelectedSeries((prev) => prev.filter(series => series.id !== id))
  }

  return (

    <div id="mainContainer" className="content-grid place-content-center h-screen w-screen relative">

      < SeriesGroup
        header="Strategies"
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
