import './styles/style.css';
import { PlotType } from '@/config/plots';
import { useToolState } from '@/hooks/use-tool-state';
import { CanvasContainer } from '@/components/plots/ui';
import { TimeSeriesData } from "@/components/plots/models";
import { PlotLine } from '@/components/plots/line/plot-line';
import { PlotScatterTest } from '@/components/plots/scatter/plot-scatter-test';
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { CanvasWorkspace, Dock, Bookmarks } from '@/components/ui/custom';

// Example data
const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series;

interface PlotProps {
  SeriesData: TimeSeriesData[];
};

const PlotComponentMap: Record<PlotType, React.ComponentType<PlotProps>> = {
  line: PlotLine,
  scatter: PlotScatterTest,
  bar: () => <div>Under developement</div>,
  histogramH: () => <div>Under developement</div>,
  histogramV: () => <div>Under developement</div>,
}

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
        {canvases.map((canvas, index) => {
          const { id, plotType } = canvas;
          const PlotComponent = PlotComponentMap[plotType];
          return (
            <CanvasContainer
              key={id}
              id={id}
              parentPosition={workspacePosition}
              canvasOffset={offsetIndex[id] * 12}
              zIndex={index + 1}
              isDraggable={IsCanvasDraggable}
              onFocus={handleCanvasFocus}
              onRemove={handleCanvasRemove}
            >
              <PlotComponent SeriesData={exampleSeries} />
            </CanvasContainer>
          )
        })};

      </CanvasWorkspace>
    </>
  )
}
