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

  const handleToolSelect = useCallback((tool: DockTool) => {
    setSelectedDockTool(tool);

    switch (tool) {
      case "line":
      case "scatter":
      case "bar":
      case "histogram":
      case "curve":
        const newCanvasId = `canvas-${Date.now()}`;
        setCanvases(prev => [...prev, newCanvasId]);

        /**
         * As new canvases are created we store their index for position offseting purposes (set at the App level).
         * If the workspace position changes when the user pans around the screen, the Offset index is reset back to 0.
         * This way new canvases begin offseting their position relative to the first canvas rendered at the center of the workspace
         * after the user is done panning. - Wrote by monke.
         */
        setOffsetIndex(prev => {
          const newOffset = Object.keys(prev).length;
          return { ...prev, [newCanvasId]: newOffset };
        })
        break;

      case "clear":
        setCanvases([]);
        setOffsetIndex({});
        break;
    }
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

