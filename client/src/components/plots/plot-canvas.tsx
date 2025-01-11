import SeriesGroup from "@/components/plots/series-group";
import ColorPicker from "@/components/plots/color-picker";

const PlotCanvas = () => {

  const exampleSeries = [
    {
      id: "1",
      label: "NVDA",
      subLabel: "Share Price",
      color: "#8B5CF6",
    },
    {
      id: "2",
      label: "AMZN",
      subLabel: "Share Price",
      color: "#10B981",
    },
  ]

  return (

    <div id="mainContainer" className="content-grid place-content-center h-screen w-screen relative">

      < SeriesGroup series={exampleSeries} onRemoveSeries={(id) => console.log('Remove series:', id)} />
      < ColorPicker />

    </div>
  );
};

export default PlotCanvas;
