import { ScrollArea } from "@/components/ui/scroll-area"
import SeriesCard from "@/components/plots/series-card"

interface Series {
  id: string
  label: string
  subLabel: string
  color: string
}

interface SeriesSelectionProps {
  series: Series[]
  onRemoveSeries: (id: string) => void
}

const seriesGroup = ({ series, onRemoveSeries }: SeriesSelectionProps) => {
  return (
    <ScrollArea className="h-full w-[342px] p-4 rounded-md border bg-background">
      <div className="space-y-2">
        {series.map((item) => (
          <SeriesCard
            key={item.id}
            label={item.label}
            subLabel={item.subLabel}
            color={item.color}
            onRemove={() => onRemoveSeries(item.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default seriesGroup;
