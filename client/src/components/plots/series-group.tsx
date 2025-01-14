import { Series } from "@/components/plots/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import SeriesCard from "@/components/plots/series-card"
import SeriesSearch from "@/components/plots/series-search"

interface SeriesSelectionProps {
  header: string
  series: Series[]
  availableSeries: Series[]
  onRemoveSeries: (id: string) => void
  onAddSeries: (series: Series) => void
}

const seriesGroup = ({ header, series, availableSeries, onRemoveSeries, onAddSeries }: SeriesSelectionProps) => {
  return (
    <div className="h-full w-[324px] p-4 rounded-md border bg-background">
      <div className="space-y-4">
        <SeriesSearch
          options={availableSeries}
          onSelect={(selectedSeries) => onAddSeries(selectedSeries as Series)}
          placeholder="Search series"
        />
        <ScrollArea className="h-full w-full">
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
      </div>
    </div>
  )
}

export default seriesGroup
