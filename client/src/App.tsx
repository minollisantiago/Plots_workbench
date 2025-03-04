import './styles/style.css';
import { useState } from 'react';
import { useToolState } from '@/hooks/use-tool-state';
import { CanvasContainer } from '@/components/plots/ui';
import { PlotCanvas } from '@/components/plots/plot-canvas';
import { CanvasWorkspace, Dock, Bookmarks } from '@/components/ui/custom';

function App() {
  const [workspacePosition, setWorkspacePosition] = useState({ x: 0, y: 0 });

  const {
    selectedDockTool, canvases, IsWorkspaceDraggable,
    IsCanvasDraggable, handleToolSelect, handleCanvasFocus, handleCanvasRemove,
  } = useToolState()

  return (
    <>
      <Dock selectedTool={selectedDockTool} onSelect={handleToolSelect} />

      <Bookmarks />

      <CanvasWorkspace
        isDraggable={IsWorkspaceDraggable}
        resetPositionThreshold={1000}
        onPositionChange={setWorkspacePosition}
      >
        {canvases.map((id, index) => (
          <CanvasContainer
            key={id}
            id={id}
            parentPosition={workspacePosition}
            canvasOffset={index * 12}
            zIndex={canvases.indexOf(id) + 1}
            isDraggable={IsCanvasDraggable}
            onFocus={handleCanvasFocus}
            onRemove={() => handleCanvasRemove}
          >
            <PlotCanvas title="Line Plot" />
          </CanvasContainer>
        ))}

      </CanvasWorkspace>
    </>
  )
}

export default App
