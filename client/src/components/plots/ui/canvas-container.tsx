import { cn } from "@/lib/utils";
import { Grip } from "lucide-react";
import { useState, useRef, MouseEvent, ReactNode } from "react";

interface Props {
  canvasHeight?: string
  children?: ReactNode
}

export const CanvasContainer = ({ canvasHeight, children }: Props) => {
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
        className="group flex justify-start h-8 cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
      >
        <Grip className="w-4 h-4 ml-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {children}

    </div>
  )
}

