import './styles/style.css';
import { useToolState } from '@/hooks/use-tool-state';
import { CanvasContainer } from '@/components/plots/ui';
import { TimeSeriesData } from "@/components/plots/models";
import { PlotLine } from '@/components/plots/line/plot-line';
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { CanvasWorkspace, Dock, Bookmarks } from '@/components/ui/custom';

// Example data
const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series;

export default function App() {
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
            <PlotLine SeriesData={exampleSeries} />
          </CanvasContainer>
        ))}

      </CanvasWorkspace>
    </>
  )
}
