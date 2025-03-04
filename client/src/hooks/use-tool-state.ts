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

        // Wrote by monke:
        // As new canvases are created we store their index for offseting purposes (set at the App level)
        // If the workspace position changes, the Offset index is reset back to 0, so new canvases begin offseting
        // their position relative to the first canvas rendered at the center of the workspace after the user is done panning
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

