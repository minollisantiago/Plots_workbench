import { cn } from "@/lib/utils";
import { useState, useRef, MouseEvent, ReactNode } from "react";

interface Props {
  isDraggable: boolean
  children: ReactNode
}

export const CanvasWorkspace = ({ isDraggable, children }: Props) => {
  const [position, setPosition] = useState<Record<string, number>>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragOffset = useRef<Record<string, number>>({ x: 0, y: 0 });

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
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

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
