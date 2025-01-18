import SeriesCard from "@/components/plots/series-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TimeSeriesData } from "@/components/plots/types"
import SeriesSearch from "@/components/plots/series-search"

interface SeriesSelectionProps {
  header: string
  searchTriggerLabel: string
  searchPlaceholder: string
  series: TimeSeriesData[]
  availableSeries: TimeSeriesData[]
  onRemoveSeries: (id: string) => void
  onAddSeries: (series: TimeSeriesData) => void
}

const SeriesGroup = ({ header, searchTriggerLabel, searchPlaceholder, series, availableSeries, onRemoveSeries, onAddSeries }: SeriesSelectionProps) => {
  return (
    <div className="h-full w-[324px] p-4 rounded-md border bg-background">
      <div className="space-y-4">

        {/* Series Search */}
        <SeriesSearch
          options={availableSeries}
          onSelect={(selectedSeries) => onAddSeries(selectedSeries as TimeSeriesData)}
          placeholder={searchPlaceholder}
          label={searchTriggerLabel}
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
                onRemove={() => onRemoveSeries(item.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default SeriesGroup
