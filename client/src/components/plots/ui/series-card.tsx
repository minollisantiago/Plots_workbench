import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface Props {
  label: string;
  subLabel?: string;
  color: string;
  toggled?: boolean;
  onRemove?: () => void;
  onToggleVisibility?: () => void;
  onHighlight?: () => void;
  onResetHighlight?: () => void;
}

export const SeriesCard = ({
  label, subLabel, color, toggled, onRemove, onToggleVisibility, onHighlight, onResetHighlight
}: Props) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleRemove = (e: React.MouseEvent) => {
    // Stop propagation to avoid triggering onToggleVisibility
    e.stopPropagation();
    setIsVisible(false);
    // Wait for animation to complete before calling onRemove
    // The state change triggers a re-render of the card with the close animation
    if (onRemove) {
      setTimeout(onRemove, 100);
    }
  }

  const getRgbaBackground = (hexColor: string) => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  }

  return (
    <Card
      className={cn(
        "relative flex items-center gap-3 p-2 pl-0 pr-8 rounded-lg border-0 h-8 cursor-pointer",
        isVisible
          ? "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
          : "animate-out fade-out-0 zoom-out-95",
        !toggled && "opacity-50"
      )}
      style={{ backgroundColor: getRgbaBackground(color) }}
      onClick={onToggleVisibility}
      onMouseEnter={onHighlight}
      onMouseLeave={onResetHighlight}
    >

      {/* Color indicator */}
      <div className="absolute w-[0.60rem] h-full rounded-l-lg" style={{ backgroundColor: color }} />

      {/* Label */}
      <div className="flex flex-row items-center gap-2 ml-6">
        <span className="text-sm font-medium">{label}</span>
        {subLabel && (<span className="text-sm text-muted-foreground">{subLabel}</span>)}
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button onClick={handleRemove} className="absolute right-2 p-1 hover:bg-accent rounded-sm">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </Card>
  )
}

