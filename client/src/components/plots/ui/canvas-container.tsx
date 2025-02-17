import { cn } from "@/lib/utils";
import { Grip, X } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useState, useRef, MouseEvent, ReactNode } from "react";

interface Props {
  canvasHeight?: string
  onClose?: () => void
  children?: ReactNode
}

export const CanvasContainer = ({ canvasHeight, onClose, children }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Record<string, number>>({ x: 0, y: 0 });
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
        canvasHeight ? canvasHeight : "h-[472px]"
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

