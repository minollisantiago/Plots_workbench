import { cn } from "@/lib/utils";
import { Grip, X } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useState, useRef, MouseEvent, ReactNode } from "react";

interface Props {
  id: string
  canvasHeight?: string
  canvasWidth?: string
  canvasOffset?: number
  zIndex: number
  onFocus: (id: string) => void
  onRemove?: () => void
  children?: ReactNode
}

export const CanvasContainer = ({ id, canvasHeight, canvasWidth, canvasOffset, zIndex, onFocus, onRemove, children }: Props) => {

  const defaultSize = { width: 876, height: 472 }
  const defaultSizeTailwind = { width: "w-[876px]", height: "h-[472px]" }

  const [isVisible, setIsVisible] = useState(true)

  const [position, setPosition] = useState<Record<string, number>>(() => {
    return {
      x: Math.max(0, (window.innerWidth - defaultSize.width) / 2) + (canvasOffset ? canvasOffset : 0),
      y: Math.max(0, (window.innerHeight - defaultSize.height) / 2) + (canvasOffset ? canvasOffset : 0),
    }
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<Record<string, number>>({ x: 0, y: 0 });

  const handleClick = () => {
    onFocus(id);
  }

  const handleRemove = () => {
    setIsVisible(false);
    if (onRemove) {
      console.log("test closing canvas")
    }
  }

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
    isVisible && (
      <div
        className={cn(
          "full flex flex-col p-0 border-2 rounded-lg bg-background absolute",
          canvasHeight ? canvasHeight : defaultSizeTailwind.height,
          canvasWidth ? canvasWidth : defaultSizeTailwind.width,
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default',
          zIndex: zIndex
        }}
        onClick={handleClick}
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
          <Button variant="ghost" size="sm" className="rounded-md hover:bg-transparent" onClick={handleRemove}>
            <X className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

        </div>

        {children}

      </div>
    )
  )
}

