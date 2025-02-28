import './styles/style.css';
import { useToolState } from '@/hooks/use-tool-state';
import { CanvasContainer } from '@/components/plots/ui';
import { PlotCanvas } from '@/components/plots/plot-canvas';
import { CanvasWorkspace, Dock, Bookmarks } from '@/components/ui/custom';

function App() {

  const {
    selectedDockTool, canvases, IsWorkspaceDraggable,
    IsCanvasDraggable, handleToolSelect, handleCanvasFocus, handleCanvasRemove,
  } = useToolState()

  return (
    <>
      <Dock selectedTool={selectedDockTool} onSelect={handleToolSelect} />

      <Bookmarks />

      <CanvasWorkspace isDraggable={IsWorkspaceDraggable} resetPositionThreshold={1000}>
        {canvases.map((id, index) => (
          <CanvasContainer
            key={id}
            id={id}
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
