import { TimeSeriesData } from "@/models";
import { SeriesCard } from "@/components/plots/ui";
import { SeriesSearch } from "@/components/plots/ui";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  header: string
  searchTriggerLabel: string
  searchPlaceholder: string
  series: TimeSeriesData[]
  availableSeries: TimeSeriesData[]
  toggledSeries: Record<string, boolean>
  onRemoveSeries: (id: string) => void
  onAddSeries: (series: TimeSeriesData) => void
  onTogglePlotVisibility: (id: string) => void
}

export const SeriesControls = ({
  header, searchTriggerLabel, searchPlaceholder, series, availableSeries, toggledSeries, onRemoveSeries, onAddSeries, onTogglePlotVisibility
}: Props) => {
  return (
    <div className="h-full w-[324px] bg-background">
      <div className="space-y-4">

        {/* Series Search */}
        <SeriesSearch
          options={availableSeries}
          onSelect={(selectedSeries) => onAddSeries(selectedSeries as TimeSeriesData)}
          searchPlaceholder={searchPlaceholder}
          triggerLabel={searchTriggerLabel}
        />

        {/* Selected series group */}
        <ScrollArea className="h-full w-full">
          <div className="mb-2">
            <h2 className="text-xs font-medium text-muted-foreground">{header}</h2>
          </div>
          <div className="space-y-2">

            {/* Selected series card */}
            {series.map((item) => (
              <SeriesCard
                key={item.id}
                label={item.label}
                subLabel={item.subLabel}
                color={item.color}
                toggled={toggledSeries[item.id] ?? true}
                onRemove={() => onRemoveSeries(item.id)}
                onToggleVisibility={() => onTogglePlotVisibility(item.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

