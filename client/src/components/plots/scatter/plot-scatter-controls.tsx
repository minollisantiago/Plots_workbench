import { SeriesCard } from "@/components/plots/ui";
import { SeriesSearch } from "@/components/plots/ui";
import { TimeSeriesData } from "@/components/plots/models";

interface Props {
  searchTriggerLabel: string;
  searchPlaceholder: string;
  seriesX?: TimeSeriesData;
  seriesY?: TimeSeriesData;
  availableSeries?: TimeSeriesData[];
  onAddSeries: (series: TimeSeriesData) => void;
  onRemoveSeries: (id: string) => void;
}

export const ScatterControls = ({
  searchTriggerLabel, searchPlaceholder, seriesX, seriesY, availableSeries,
  onRemoveSeries, onAddSeries
}: Props) => {
  return (
    <div className="flex flex-col space-y-4 h-full bg-background">

      {/* Y-axis */}
      <div className="flex flex-col space-y-2 pr-3">
        <h2 className="text-xs font-medium text-muted-foreground">X-axis</h2>

        {/* Series Search */}
        <SeriesSearch
          options={availableSeries}
          onSelect={(selectedSeries) => onAddSeries(selectedSeries as TimeSeriesData)}
          searchPlaceholder={searchPlaceholder}
          triggerLabel={searchTriggerLabel}
        />

        {/* Selected series */}
        <div className="flex flex-col space-y-2 overflow-hidden">
          {seriesX &&
            <>
              <div className="space-y-2">
                {/* Selected series card */}
                <SeriesCard
                  key={seriesX.id}
                  label={seriesX.label}
                  subLabel={seriesX.subLabel}
                  color={seriesX.color}
                  onRemove={() => onRemoveSeries(seriesX.id)}
                />
              </div>
            </>
          }
        </div>
      </div>

      {/* X-axis */}
      <div className="flex flex-col space-y-2 pr-3">
        <h2 className="text-xs font-medium text-muted-foreground">Y-axis</h2>

        {/* Series Search */}
        <SeriesSearch
          options={availableSeries}
          onSelect={(selectedSeries) => onAddSeries(selectedSeries as TimeSeriesData)}
          searchPlaceholder={searchPlaceholder}
          triggerLabel={searchTriggerLabel}
        />

        {/* Selected series */}
        <div className="flex flex-col space-y-2 overflow-hidden">
          {seriesY &&
            <>
              <div className="space-y-2">
                {/* Selected series card */}
                <SeriesCard
                  key={seriesY.id}
                  label={seriesY.label}
                  subLabel={seriesY.subLabel}
                  color={seriesY.color}
                  onRemove={() => onRemoveSeries(seriesY.id)}
                />
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};

