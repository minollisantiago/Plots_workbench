import { useState } from 'react';
import { Dock, DockTool } from '@/components/ui';
import { CanvasContainer } from '@/components/plots/ui';
import { PlotCanvas } from '@/components/plots/plot-canvas';
import './styles/style.css';

function App() {
  const [canvases, setCanvases] = useState<string[]>([]);

  const handleDockSelect = (tool: DockTool) => {
    if (tool === "line") {
      const newCanvasId = `canvas-${Date.now()}`;
      setCanvases(prev => [...prev, newCanvasId]);
    } else if (tool === "clear") {
      setCanvases([]);
    }
  };

  return (
    <div id="mainContainer" className="content-grid place-content-center h-screen w-screen relative">

      <Dock onSelect={handleDockSelect} />

      {canvases.map((id) => (
        <CanvasContainer
          key={id}
          onClose={() => setCanvases(prev => prev.filter(canvasId => canvasId !== id))}
        >
          <PlotCanvas title="Line Plot" />
        </CanvasContainer>
      ))}

    </div>
  )
}

export default App
