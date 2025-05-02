import { PlotType } from '@/config/plots';
import { useState, useCallback } from "react";
import { DockTool } from '@/components/ui/custom';

type xyPosition = { x: number, y: number };
type canvasOffset = Record<string, number>;

interface CanvasState {
  id: string;
  plotType: PlotType;
};

interface UseToolStateReturn {
  selectedDockTool: DockTool;
  canvases: CanvasState[];
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
 * @property {CanvasState[]} canvases - An array of canvas objects, each containing an ID and plot type.
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
  const [canvases, setCanvases] = useState<CanvasState[]>([]);
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
      const focusedCanvas = prev.find(canvas => canvas.id === id);
      if (!focusedCanvas) return prev;
      const filtered = prev.filter(canvas => canvas.id !== id);
      return [...filtered, focusedCanvas];
    });
  }, []);

  const handleCanvasRemove = useCallback((id: string) => {
    setCanvases(prev => prev.filter(canvas => canvas.id !== id));
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
   *
   * @param {PlotType} plotType - The type of plot to create.
   */
  const addCanvas = useCallback((plotType: PlotType) => {
    const newCanvasId = `canvas-${Date.now()}`;
    setCanvases(prev => [...prev, { id: newCanvasId, plotType: plotType }]);

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
   *
   *  -  Tools like "line", "scatter", "bar", and "histogram" are mapped to the `addCanvas` function,
   *     which creates a new canvas of the specified type.
   *  -  The "clear" tool is mapped to the `clearCanvases` function, which removes all canvases from the workspace.
   *  -  Other tools, like "hand", "selection", and "curve", have empty functions assigned to them,
   *     as they don't need to perform any specific action when selected.
   */
  const toolActions: Partial<Record<DockTool, () => void>> = {
    "hand": () => { },
    "selection": () => { },
    "clear": clearCanvases,
    "line": () => addCanvas("line"),
    "scatter": () => addCanvas("scatter"),
    "bar": () => addCanvas("bar"),
    "histogram": () => addCanvas("histogramH"),
    "curve": () => { },
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

