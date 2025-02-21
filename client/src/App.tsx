import './styles/style.css';
import { useState } from 'react';
import { CanvasContainer } from '@/components/plots/ui';
import { PlotCanvas } from '@/components/plots/plot-canvas';
import { CanvasWorkspace, Dock, DockTool, Bookmarks } from '@/components/ui';

function App() {
  const [canvases, setCanvases] = useState<string[]>([]);
  const [selectedDockTool, setSelectedDockTool] = useState<DockTool>("hand");

  const IsWorkspaceDraggable: boolean = selectedDockTool === "hand";
  const IsCanvasDraggable: boolean = !IsWorkspaceDraggable;

  const handleDockSelect = (tool: DockTool) => {
    setSelectedDockTool(tool);

    if (tool === "line") {
      const newCanvasId = `canvas-${Date.now()}`;
      setCanvases(prev => [...prev, newCanvasId]);
    } else if (tool === "clear") {
      setCanvases([]);
    }
  };

  const handleCanvasFocus = (id: string) => {
    setCanvases(prev => {
      const filtered = prev.filter(canvasId => canvasId !== id);
      return [...filtered, id];
    });
  };

  return (
    <>
      <Dock selectedTool={selectedDockTool} onSelect={handleDockSelect} />

      <Bookmarks />

      <CanvasWorkspace isDraggable={IsWorkspaceDraggable}>
        {canvases.map((id, index) => (
          <CanvasContainer
            key={id}
            id={id}
            canvasOffset={index * 12}
            zIndex={canvases.indexOf(id) + 1}
            isDraggable={IsCanvasDraggable}
            onFocus={handleCanvasFocus}
            onRemove={() => setCanvases(prev => prev.filter(canvasId => canvasId !== id))}
          >
            <PlotCanvas title="Line Plot" />
          </CanvasContainer>
        ))}

      </CanvasWorkspace>
    </>
  )
}

export default App
