import { X } from "lucide-react"
import { Card } from "@/components/ui/card"

interface SeriesCardProps {
  label: string
  subLabel?: string
  color: string
  onRemove?: () => void
}

const SeriesCard = ({ label, subLabel, color, onRemove }: SeriesCardProps) => {

  const getRgbaBackground = (hexColor: string) => {

    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  };

  return (
    <Card className="relative flex items-center gap-3 p-2 pr-8 hover:bg-accent/50 transition-colors"
      style={{
        backgroundColor: getRgbaBackground(color),
        '--hover-bg-color': getRgbaBackground(color).replace('0.1', '0.2')
      } as React.CSSProperties}
    >

      {/* Color indicator */}
      <div className="w-1 h-6 rounded-full" style={{ backgroundColor: color }} />

      {/* Label */}
      <div className="flex flex-col">
        <span className="text-sm font-medium font-mono">{label}</span>
        {subLabel && (<span className="text-xs text-muted-foreground">{subLabel}</span>)}
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button onClick={onRemove} className="absolute right-2 p-1 hover:bg-accent rounded-sm">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </Card>
  );
};

export default SeriesCard;
