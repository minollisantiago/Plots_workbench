import { cn } from "@/lib/utils";
import { Crosshair } from "lucide-react";
import { TooltipConfig } from "@/config/ui";
import { useState, useRef, MouseEvent, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  isDraggable: boolean;
  resetPositionThreshold?: number;
  children: ReactNode;
}

export const CanvasWorkspace = ({ isDraggable, resetPositionThreshold, children }: Props) => {
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
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleDragEnd = () => {
    if (!isDraggable) return;
    setIsDragging(false);
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  }

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
      {
        (Math.abs(position.x) > resetThreshold || Math.abs(position.y) > resetThreshold) &&
        <div className="fixed bottom-6 left-1 flex items-center p-2 rounded-2xl bg-background/90 backdrop-blur-sm border-2 border-white/10 z-50">
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
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      }
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
