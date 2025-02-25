import { useState, useCallback } from "react";
import { DockTool } from '@/components/ui/custom';

interface UseToolStateReturn {
  selectedDockTool: DockTool;
  canvases: string[];
  IsWorkspaceDraggable: boolean;
  IsCanvasDraggable: boolean;
  handleToolSelect: (tool: DockTool) => void;
  handleCanvasFocus: (id: string) => void;
  handleCanvasRemove: (id: string) => void;
}

export function useToolState(): UseToolStateReturn {
  const [selectedDockTool, setSelectedDockTool] = useState<DockTool>("hand");
  const [canvases, setCanvases] = useState<string[]>([]);

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
        break;
      case "clear":
        setCanvases([]);
        break;
    }
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
    handleToolSelect,
    handleCanvasFocus,
    handleCanvasRemove,
  };

};

