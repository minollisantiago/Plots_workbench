import ColorPicker from "@/components/plots/color-picker";

const PlotCanvas = () => {
  return (
    <div id="mainContainer" className="content-grid place-content-center h-screen w-screen relative bg-primary text-primary-foreground">

      <ColorPicker />

    </div>
  );
};

export default PlotCanvas;
