import { cn } from "@/lib/utils";
import { Grip, X } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useState, useRef, MouseEvent, ReactNode } from "react";

interface Props {
  canvasHeight?: string
  canvasWidth?: string
  initialPosition?: { x: number, y: number }
  onClose?: () => void
  children?: ReactNode
}

export const CanvasContainer = ({ canvasHeight, canvasWidth, initialPosition, onClose, children }: Props) => {

  const defaultSize = { width: 876, height: 472 }

  const [position, setPosition] = useState<Record<string, number>>(() => {
    if (initialPosition) return initialPosition;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    return {
      x: Math.max(0, (viewportWidth - defaultSize.width) / 2),
      y: Math.max(0, (viewportHeight - defaultSize.height) / 2),
    };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<Record<string, number>>({ x: 0, y: 0 });

  const handleDragStart = (e: MouseEvent) => {
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
    <div
      className={cn(
        "flex flex-col p-0 border-2 rounded-lg bg-background/95",
        canvasHeight ? canvasHeight : `h-[${defaultSize.height}px]`,
        canvasWidth ? canvasWidth : `w-[${defaultSize.width}px]`,
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >

      <div
        className="group flex justify-between h-10 pt-2 px-2 cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
      >

        {/* Drag handle */}
        <Grip className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Close button */}
        <Button variant="ghost" size="sm" className="rounded-md hover:bg-muted" onClick={onClose}>
          <X className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>

      </div>

      {children}

    </div>
  )
}

