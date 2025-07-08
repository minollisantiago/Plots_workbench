import { cn } from "@/lib/utils";
import { Crosshair } from "lucide-react";
import { TooltipConfig } from "@/config/ui";
import { useKeybind } from "@/hooks/use-keybind";
import { useState, useRef, MouseEvent, ReactNode } from "react";
import { ServerStatus, DataConfigMenu } from '@/components/ui/custom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  isDraggable: boolean;
  resetPositionThreshold?: number;
  onPositionChange?: (position: { x: number, y: number }) => void;
  children: ReactNode;
}

export const CanvasWorkspace = ({ isDraggable, resetPositionThreshold, onPositionChange, children }: Props) => {
  const [position, setPosition] = useState<Record<string, number>>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragOffset = useRef<Record<string, number>>({ x: 0, y: 0 });

  const resetThreshold = resetPositionThreshold ?? 1000;

  const handleDragStart = (e: MouseEvent) => {
    if (!isDraggable) return;
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging) return;
    const newPosition = {
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    }
    setPosition(newPosition);
    onPositionChange?.(newPosition);
  };

  const handleDragEnd = () => {
    if (!isDraggable) return;
    setIsDragging(false);
  };

  const resetPosition = () => {
    const newPosition = { x: 0, y: 0 };
    setPosition(newPosition);
    onPositionChange?.(newPosition);
  }

  // custom hook for keybind actions
  useKeybind([{ keybind: 'ctrl+c', action: resetPosition }]);

  return (
    <div
      id="mainContainer"
      className={cn(
        "h-screen w-screen relative overflow-hidden",
        isDraggable
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-default"
      )}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onMouseDown={handleDragStart}
    >

      {/* Config menu */}
      <DataConfigMenu />

      {/* Center workspace button */}
      {
        (Math.abs(position.x) > resetThreshold || Math.abs(position.y) > resetThreshold) &&
        <div
          className="fixed bottom-6 left-2 flex items-center p-2 rounded-2xl
          bg-background/90 backdrop-blur-sm border-2 z-50"
        >
          <TooltipProvider delayDuration={TooltipConfig.delayDuration} skipDelayDuration={TooltipConfig.skipDelayDuration}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="group p-2 rounded-lg hover:bg-muted"
                  onClick={resetPosition}
                >
                  <Crosshair size={20} className="text-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={TooltipConfig.sideOffset} className={TooltipConfig.tailwindClasses.content}>
                <div className="flex items-center justify-between gap-2">
                  <p>Center workspace</p>
                  <kbd
                    className="px-2 py-1 pointer-events-none inline-flex select-none
                    items-center gap-1 rounded-sm font-mono font-bold bg-muted text-foreground">
                    CTRL+C
                  </kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      }

      {/* Info display: Coordinates, server status */}
      <div
        className="fixed bottom-2 right-2 h-14 w-auto p-2 px-4 flex flex-row gap-4 items-center justify-center z-50"
      >
        <ServerStatus />
        <p className="text-sm font-mono">{`x:${position.x}`}</p>
        <p className="text-sm font-mono">{`y:${position.y}`}</p>
      </div>

      {/* Workspace & children */}
      <div
        className="absolute h-screen w-screen inset-0 bg-inherit"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: 'inherit',
        }}
      >
        {children}
      </div>
    </div>
  );
};
