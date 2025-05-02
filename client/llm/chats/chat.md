Ive got this react app that comes with a dock tool component that does different things based on what tool is being selected at the time. Im going to give you the complete component files so you can evaluate the questions im going to give you. If you need more context, ask for it (functions, imports, whatever you need).

<llm_context path="/home/santiago/projects/testApps/components_workbench/client/src/App.tsx" filetype="tsx" name="App.tsx">
```tsx
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
```
</llm_context>


<llm_context path="/home/santiago/projects/testApps/components_workbench/client/src/hooks/use-tool-state.ts" filetype="ts" name="use-tool-state.ts">
```ts
import { useState, useCallback } from "react";
import { DockTool } from '@/components/ui/custom';

type xyPosition = { x: number, y: number };
type canvasOffset = Record<string, number>;

interface UseToolStateReturn {
  selectedDockTool: DockTool;
  canvases: string[];
  IsWorkspaceDraggable: boolean;
  IsCanvasDraggable: boolean;
  workspacePosition: xyPosition;
  offsetIndex: canvasOffset;
  handleToolSelect: (tool: DockTool) => void;
  handleCanvasFocus: (id: string) => void;
  handleCanvasRemove: (id: string) => void;
  setWorkspacePosition: (position: xyPosition) => void;
}

/**
 * Custom hook for managing the state of tools and canvases in the workspace.
 *
 * @returns {UseToolStateReturn} An object containing the state and functions for managing tools and canvases.
 * @property {DockTool} selectedDockTool - The currently selected dock tool.
 * @property {string[]} canvases - An array of canvas IDs.
 * @property {boolean} IsWorkspaceDraggable - A boolean indicating whether the workspace is draggable.
 * @property {boolean} IsCanvasDraggable - A boolean indicating whether the canvas is draggable.
 * @property {xyPosition} workspacePosition - The current position of the workspace.
 * @property {canvasOffset} offsetIndex - An object mapping canvas IDs to their offset index.
 * @property {function} handleToolSelect - A function to handle the selection of a tool.
 * @property {function} handleCanvasFocus - A function to handle focusing a canvas.
 * @property {function} handleCanvasRemove - A function to handle removing a canvas.
 * @property {function} setWorkspacePosition - A function to set the workspace position.
 */
export function useToolState(): UseToolStateReturn {
  const [selectedDockTool, setSelectedDockTool] = useState<DockTool>("hand");
  const [canvases, setCanvases] = useState<string[]>([]);
  const [workspacePosition, setWorkspacePosition] = useState<xyPosition>({ x: 0, y: 0 });
  const [offsetIndex, setOffsetIndex] = useState<canvasOffset>({});

  const IsWorkspaceDraggable: boolean = selectedDockTool === "hand";
  const IsCanvasDraggable: boolean = !IsWorkspaceDraggable;

  /**
   * Handles the selection of a tool from the dock.
   * Makes use of the toolActions object to map tool IDs to their associated functions
   *
   * @param {DockTool} tool The selected tool.
   */
  const handleToolSelect = useCallback((tool: DockTool) => {
    setSelectedDockTool(tool);
    toolActions[tool]?.();
  }, []);

  const handleWorkspacePositionChange = useCallback((position: xyPosition) => {
    setWorkspacePosition(position);
    setOffsetIndex({});
  }, []);

  const handleCanvasFocus = useCallback((id: string) => {
    setCanvases(prev => {
      const filtered = prev.filter(canvasId => canvasId !== id);
      return [...filtered, id];
    });
  }, []);

  const handleCanvasRemove = useCallback((id: string) => {
    setCanvases(prev => prev.filter(canvasId => canvasId !== id));
  }, []);

  /**
   * Adds a new canvas to the workspace.
   *
   * This function performs the following steps:
   * 1. Generates a unique ID for the new canvas using the `canvas-${Date.now()}` template.
   * 2. Adds the new canvas ID to the `canvases` state, triggering a re-render of the workspace.
   * 3. Calculates the offset index for the new canvas based on the number of existing canvases.
   *    This offset index is used to position the new canvas relative to the other canvases in the workspace.
   * 4. Updates the `offsetIndex` state with the new canvas ID and its corresponding offset index.
   *
   * The offset index is reset when the workspace position changes (e.g., when the user pans the workspace),
   * ensuring that new canvases are positioned correctly relative to the workspace origin.
   */
  const addCanvas = useCallback(() => {
    const newCanvasId = `canvas-${Date.now()}`;
    setCanvases(prev => [...prev, newCanvasId]);

    /**
     * As new canvases are created we store their index for position offseting purposes (set at the App level).
     * If the workspace position changes when the user pans around the screen, the Offset index is reset back to 0.
     * This way new canvases begin offseting their position relative to the first canvas rendered at the center of the workspace
     * after the user is done panning. - Written by monke.
     */
    setOffsetIndex(prev => {
      const newOffset = Object.keys(prev).length;
      return { ...prev, [newCanvasId]: newOffset };
    })
  }, [setCanvases, setOffsetIndex]);

  const clearCanvases = useCallback(() => {
    setCanvases([]);
    setOffsetIndex({});
  }, [setCanvases, setOffsetIndex]);

  /**
   * An object that maps each DockTool to a function that should be executed when that tool is selected.
   * If a tool does not need to perform any action, its function can be an empty function (`() => {}`).
   */
  const toolActions: Record<DockTool, () => void> = {
    "hand": () => { },
    "selection": () => { },
    "clear": clearCanvases,
    "line": addCanvas,
    "scatter": addCanvas,
    "bar": addCanvas,
    "histogram": addCanvas,
    "curve": addCanvas,
  };

  return {
    selectedDockTool,
    canvases,
    IsWorkspaceDraggable,
    IsCanvasDraggable,
    workspacePosition,
    offsetIndex,
    handleToolSelect,
    handleCanvasFocus,
    handleCanvasRemove,
    setWorkspacePosition: handleWorkspacePositionChange,
  };

};

```
</llm_context>

As you can see on the app component, i map all elements inside the canvases array and add a PlotLine component for each one of those. You can see inside the useToolState hook, the toolActions objects, mapping functions to each dock tool. Now, every plot type (line, scatter, etc) calls addCanvas. That is fine, but what i need is to be able to differentiate which plot is added with each one of the plot dock tools. That is, if i select the dock tool "line" i want to call addCanvas, yes but pass the children PlotLine to it, like im doing on the App component, if i call the "scatter" dock tool, i want to call addCanvas but with the PlotScatterTest component, etc (right now those are the two implemented cases)


---
## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

Okay, Santi. I understand that you want to modify the `addCanvas` function in your `useToolState` hook to render different plot components based on the selected `DockTool`. Currently, all plot tools ("line", "scatter", etc.) add a canvas with the same `PlotLine` component. You want to change this so that each plot tool adds a canvas with its corresponding plot component (e.g., `PlotLine` for "line", `PlotScatterTest` for "scatter").

To achieve this, you can modify the `addCanvas` function and the `toolActions` object to accept a component type as an argument. Here's how you can do it:

1.  **Modify the `addCanvas` function to accept a `plotType` argument:** This argument will determine which plot component to render within the `CanvasContainer`.
2.  **Update the `toolActions` object to pass the appropriate `plotType` to the `addCanvas` function:**  Each tool will now specify which plot component it should render.
3.  **Update the `App` component to dynamically render the plot components**: Instead of hardcoding `<PlotLine>`, the component will render based on the `plotType` stored in the canvas data.

Here's the updated code for `use-tool-state.ts`:

```ts
import { useState, useCallback } from "react";
import { DockTool } from '@/components/ui/custom';
import { PlotLine, PlotScatterTest } from '@/components/plots/ui'; // Import the plot components

type xyPosition = { x: number, y: number };
type canvasOffset = Record<string, number>;

// Define a type for the plot components
type PlotComponentType = typeof PlotLine | typeof PlotScatterTest; // Add other plot components here

interface UseToolStateReturn {
  selectedDockTool: DockTool;
  canvases: { id: string; plotType: PlotComponentType }[]; // Modified canvases array to hold plotType
  IsWorkspaceDraggable: boolean;
  IsCanvasDraggable: boolean;
  workspacePosition: xyPosition;
  offsetIndex: canvasOffset;
  handleToolSelect: (tool: DockTool) => void;
  handleCanvasFocus: (id: string) => void;
  handleCanvasRemove: (id: string) => void;
  setWorkspacePosition: (position: xyPosition) => void;
}

/**
 * Custom hook for managing the state of tools and canvases in the workspace.
 */
export function useToolState(): UseToolStateReturn {
  const [selectedDockTool, setSelectedDockTool] = useState<DockTool>("hand");
  const [canvases, setCanvases] = useState<{ id: string; plotType: PlotComponentType }[]>([]); // Modified canvases array
  const [workspacePosition, setWorkspacePosition] = useState<xyPosition>({ x: 0, y: 0 });
  const [offsetIndex, setOffsetIndex] = useState<canvasOffset>({});

  const IsWorkspaceDraggable: boolean = selectedDockTool === "hand";
  const IsCanvasDraggable: boolean = !IsWorkspaceDraggable;

  const handleToolSelect = useCallback((tool: DockTool) => {
    setSelectedDockTool(tool);
    toolActions[tool]?.();
  }, []);

  const handleWorkspacePositionChange = useCallback((position: xyPosition) => {
    setWorkspacePosition(position);
    setOffsetIndex({});
  }, []);

  const handleCanvasFocus = useCallback((id: string) => {
    setCanvases(prev => {
      const filtered = prev.filter(canvas => canvas.id !== id);
      return [...filtered, prev.find(canvas => canvas.id === id)!];
    });
  }, []);

  const handleCanvasRemove = useCallback((id: string) => {
    setCanvases(prev => prev.filter(canvas => canvas.id !== id));
  }, []);

  /**
   * Adds a new canvas to the workspace.
   */
  const addCanvas = useCallback((plotType: PlotComponentType) => { // Modified to accept plotType
    const newCanvasId = `canvas-${Date.now()}`;
    setCanvases(prev => [...prev, { id: newCanvasId, plotType }]); // Store plotType in canvas object

    setOffsetIndex(prev => {
      const newOffset = Object.keys(prev).length;
      return { ...prev, [newCanvasId]: newOffset };
    })
  }, [setCanvases, setOffsetIndex]);

  const clearCanvases = useCallback(() => {
    setCanvases([]);
    setOffsetIndex({});
  }, [setCanvases, setOffsetIndex]);

  const toolActions: Record<DockTool, () => void> = {
    "hand": () => { },
    "selection": () => { },
    "clear": clearCanvases,
    "line": () => addCanvas(PlotLine), // Pass PlotLine component
    "scatter": () => addCanvas(PlotScatterTest), // Pass PlotScatterTest component
    "bar": () => addCanvas(PlotLine),
    "histogram": () => addCanvas(PlotLine),
    "curve": () => addCanvas(PlotLine),
  };

  return {
    selectedDockTool,
    canvases,
    IsWorkspaceDraggable,
    IsCanvasDraggable,
    workspacePosition,
    offsetIndex,
    handleToolSelect,
    handleCanvasFocus,
    handleCanvasRemove,
    setWorkspacePosition: handleWorkspacePositionChange,
  };
};
```

Next, you need to update the `App` component to render the correct plot component based on the `plotType` stored in the `canvases` array.

```tsx
import './styles/style.css';
import { useToolState } from '@/hooks/use-tool-state';
import { CanvasContainer, PlotLine, PlotScatterTest } from '@/components/plots/ui'; // Import all plot components
import { TimeSeriesData } from "@/components/plots/models";
import { mockTimeSeriesData } from "@/data/mock/time-series-data";
import { CanvasWorkspace, Dock, Bookmarks } from '@/components/ui/custom';
import { createElement } from 'react';

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
        {canvases.map(({ id, plotType }) => ( // Destructure id and plotType from canvas object
          <CanvasContainer
            key={id}
            id={id}
            parentPosition={workspacePosition}
            canvasOffset={offsetIndex[id] * 12}
            zIndex={canvases.indexOf( {id, plotType} ) + 1}
            isDraggable={IsCanvasDraggable}
            onFocus={handleCanvasFocus}
            onRemove={handleCanvasRemove}
          >
            {createElement(plotType, { SeriesData: exampleSeries })} {/* Render the plot component dynamically */}
          </CanvasContainer>
        ))}
      </CanvasWorkspace>
    </>
  )
}
```

Key changes and explanations:

*   **`useToolState.ts`**:
    *   Import `PlotLine` and `PlotScatterTest` (and any other plot components you want to use).
    *   Define `PlotComponentType` as a union of all possible plot component types.  This ensures type safety.
    *   The `canvases` state is now an array of objects:  `{ id: string; plotType: PlotComponentType }[]`.  Each canvas now stores its ID *and* the type of plot component it should render.
    *   The `addCanvas` function now accepts a `plotType: PlotComponentType` argument.  When a new canvas is created, its `plotType` is stored in the `canvases` state.
    *   The `toolActions` object now passes the correct plot component type to `addCanvas` when each tool is selected.  For example, `"line": () => addCanvas(PlotLine)` will create a canvas that renders the `PlotLine` component.
*   **`App.tsx`**:
    *   Import all plot components that might be rendered.
    *   When mapping over the `canvases` array, destructure each canvas object to get its `id` and `plotType`:  `canvases.map(({ id, plotType }) => ...)`
    *   Use `React.createElement(plotType, { SeriesData: exampleSeries })` to dynamically render the plot component.  This is how you render a component whose type is stored in a variable.  Pass any necessary props (like `SeriesData`) to the component.

This approach ensures that the correct plot component is rendered for each canvas based on the selected tool.  It also keeps your code organized and maintainable.

What do you think of this approach?  Let me know if you have any questions or would like me to elaborate on any part of the solution.

## >>>>>>>>>>>>> LLM RESPONSE ENDS <<<<<<<<<<<<<<
---


