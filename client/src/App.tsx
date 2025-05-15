import './styles/style.css';
import { PlotType } from '@/config/plots';
import { useToolState } from '@/hooks/use-tool-state';
import { CanvasContainer } from '@/components/plots/ui';
import { TimeSeriesData } from "@/components/plots/models";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { PlotLine, PlotScatter, PlotBar } from '@/components/plots';
import { CanvasWorkspace, Dock, Bookmarks } from '@/components/ui/custom';

// Example data
const exampleSeries: TimeSeriesData[] = mockTimeSeriesData.series;

/**
 * Defines the expected props for all plot components used within the CanvasContainer.
 * Ensures consistency in how data is passed to different plot types.
 * @property {TimeSeriesData[]} SeriesData - The data array to be visualized by the plot.
 * Specific plotType plots like PlotLine or PlotScatter style and layout types are handled
 * by their specific child plotting components
 */
interface PlotProps {
  SeriesData: TimeSeriesData[];
};

/**
 * A mapping from PlotType string identifiers (defined in `useToolState`)
 * to the actual React functional component responsible for rendering that plot type.
 * This allows for dynamic rendering of the correct plot based on the state.
 * Each component referenced here should conform to the `PlotProps` interface.
 */
const PlotComponentMap: Record<PlotType, React.ComponentType<PlotProps>> = {
  line: PlotLine,
  scatter: PlotScatter,
  bar: PlotBar,
  histogramH: () => <div>Under developement</div>,
  histogramV: () => <div>Under developement</div>,
}

export default function App() {
  // Destructure state and callbacks from the custom hook
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
        })}

      </CanvasWorkspace>
    </>
  )
}
