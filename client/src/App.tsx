import { Dock } from '@/components/ui';
import { CanvasContainer } from '@/components/plots/ui';
import { PlotCanvas } from '@/components/plots/plot-canvas';
import './styles/style.css';

function App() {

  return (
    <div id="mainContainer" className="content-grid place-content-center h-screen w-screen relative">

      <Dock />

      <CanvasContainer canvasHeight="h-[472px]">
        <PlotCanvas title="Line Plot" />
      </CanvasContainer>

    </div>
  )
}

export default App
