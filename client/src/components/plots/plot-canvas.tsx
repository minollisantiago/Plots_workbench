import SeriesGroup from "@/components/plots/series-group";
import ColorPicker from "@/components/plots/color-picker";

const PlotCanvas = () => {

  const exampleSeries = [
    {
      id: "1",
      label: "NVDA",
      subLabel: "Share Price",
      color: "#489FFA",
    },
    {
      id: "2",
      label: "AMZN",
      subLabel: "Share Price",
      color: "#E9EC89",
    },
  ]

  return (

    <div id="mainContainer" className="content-grid place-content-center h-screen w-screen relative">

      < SeriesGroup header="Strategies" series={exampleSeries} onRemoveSeries={(id) => console.log('Remove series:', id)} />
      < ColorPicker />

    </div>
  );
};

export default PlotCanvas;
