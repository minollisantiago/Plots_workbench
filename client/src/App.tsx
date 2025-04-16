import './styles/style.css';
import { useToolState } from '@/hooks/use-tool-state';
import { CanvasContainer } from '@/components/plots/ui';
import { PlotLine } from '@/components/plots/line/plot-line';
import { CanvasWorkspace, Dock, Bookmarks } from '@/components/ui/custom';

function App() {

  const {
    selectedDockTool,
    canvases,
    IsWorkspaceDraggable,
    IsCanvasDraggable,
    workspacePosition,
    offsetIndex,
    handleToolSelect,
    handleCanvasFocus,
    handleCanvasRemove,
    setWorkspacePosition,
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
        {canvases.map((id) => (
          <CanvasContainer
            key={id}
            id={id}
            parentPosition={workspacePosition}
            canvasOffset={offsetIndex[id] * 12}
            zIndex={canvases.indexOf(id) + 1}
            isDraggable={IsCanvasDraggable}
            onFocus={handleCanvasFocus}
            onRemove={handleCanvasRemove}
          >
            <PlotLine title="Line Plot" />
          </CanvasContainer>
        ))}

      </CanvasWorkspace>
    </>
  )
}

export default App
