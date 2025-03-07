import { cn } from "@/lib/utils";
import { Grip, X } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useState, useRef, MouseEvent, ReactNode } from "react";

interface Props {
  id: string;
  canvasHeight?: number;
  canvasWidth?: number;
  parentPosition?: { x: number, y: number };
  canvasOffset?: number;
  zIndex: number;
  isDraggable: boolean;
  onFocus: (id: string) => void;
  onRemove?: (id: string) => void;
  children?: ReactNode;
};

const BOUND_SIZE = {
  minwidth: 972,
  minheight: 472,
  maxwidth: 1072,
  maxheight: 572,
} as const;

// Bound canvas size
const getSize = (height: number, width: number) => ({
  height: Math.max(BOUND_SIZE.minheight, Math.min(BOUND_SIZE.maxheight, height)),
  width: Math.max(BOUND_SIZE.minwidth, Math.min(BOUND_SIZE.maxwidth, width)),
});

export const CanvasContainer = ({
  id,
  canvasHeight = 472,
  canvasWidth = 972,
  parentPosition = { x: 0, y: 0 },
  canvasOffset,
  zIndex,
  isDraggable,
  onFocus,
  onRemove,
  children
}: Props) => {
  const { width, height } = getSize(canvasHeight, canvasWidth);

  const [isVisible, setIsVisible] = useState(true);

  // Position and Drag interaction state
  const [position, setPosition] = useState<Record<string, number>>(() => {
    return {
      x: Math.max(0, (window.innerWidth - width) / 2) + (canvasOffset ? canvasOffset : 0) - parentPosition.x,
      y: Math.max(0, (window.innerHeight - height) / 2) + (canvasOffset ? canvasOffset : 0) - parentPosition.y,
    }
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<Record<string, number>>({ x: 0, y: 0 });

  const handleClick = () => {
    onFocus(id);
  };

  const handleRemove = () => {
    setIsVisible(false);
    if (onRemove) {
      onRemove(id);
    }
  };

  const handleDragStart = (e: MouseEvent) => {
    if (!isDraggable) return;
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  }

  const handleDrag = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    }
  };

  return (
    isVisible && (

      <div
        className="flex flex-col p-0 border-2 rounded-lg bg-background absolute"
        style={{
          height: height,
          width: width,
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default',
          zIndex: zIndex
        }}
        onClick={handleClick}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >

        {/* Drag section */}
        <div
          className={cn(
            "group flex h-10 pt-2 px-2",
            isDraggable
              ? "justify-between cursor-grab active:cursor-grabbing"
              : "justify-end cursor-default"
          )}
          onMouseDown={handleDragStart}
        >

          {/* Drag icon */}
          {isDraggable &&
            <Grip className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          }

          {/* Close button */}
          <Button variant="ghost" size="sm" className="rounded-md hover:bg-transparent" onClick={handleRemove}>
            <X className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

        </div>

        {children}

      </div>
    )
  )
}

