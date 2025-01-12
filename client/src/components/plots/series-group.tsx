import { ScrollArea } from "@/components/ui/scroll-area"
import SeriesCard from "@/components/plots/series-card"

interface Series {
  id: string
  label: string
  subLabel: string
  color: string
}

interface SeriesSelectionProps {
  header: string
  series: Series[]
  onRemoveSeries: (id: string) => void
}

const seriesGroup = ({ header, series, onRemoveSeries }: SeriesSelectionProps) => {
  return (
    <ScrollArea className="h-full w-[324px] p-4 rounded-md border bg-background">
      <div className="mb-2">
        <h2 className="text-md font-medium">{header}</h2>
      </div>
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
