import { SeriesCard } from "@/components/plots/ui";
import { SeriesSearch } from "@/components/plots/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeSeriesData } from "@/components/plots/models";

interface Props {
  searchTriggerLabel: string;
  searchPlaceholder: string;
  series?: TimeSeriesData[];
  availableSeries?: TimeSeriesData[];
  onAddSeries: (series: TimeSeriesData) => void;
  onRemoveSeries: (id: string) => void;
}

export const ScatterControls = ({
  searchTriggerLabel, searchPlaceholder, series, availableSeries,
  onRemoveSeries, onAddSeries
}: Props) => {
  return (
    <div className="flex flex-col space-y-4 h-full bg-background">

      {/* Series Search - X-axis */}
      <div className="flex flex-col space-y-2 pr-3">
        <h2 className="text-xs font-medium text-muted-foreground">X-axis</h2>
        <SeriesSearch
          options={availableSeries}
          onSelect={(selectedSeries) => onAddSeries(selectedSeries as TimeSeriesData)}
          searchPlaceholder={searchPlaceholder}
          triggerLabel={searchTriggerLabel}
        />
      </div>

      {/* Series Search - X-axis */}
      <div className="flex flex-col space-y-2 pr-3">
        <h2 className="text-xs font-medium text-muted-foreground">Y-axis</h2>
        <SeriesSearch
          options={availableSeries}
          onSelect={(selectedSeries) => onAddSeries(selectedSeries as TimeSeriesData)}
          searchPlaceholder={searchPlaceholder}
          triggerLabel={searchTriggerLabel}
        />
      </div>

      {/* Selected series group */}
      <div className="flex flex-col space-y-2 overflow-hidden">
        {series &&
          <>
            <ScrollArea className="h-full w-full pr-3">
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
          </>
        }
      </div>
    </div>
  )
}

