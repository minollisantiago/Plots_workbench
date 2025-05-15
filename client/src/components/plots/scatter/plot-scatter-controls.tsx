import { SeriesCard } from "@/components/plots/ui";
import { SeriesSearch } from "@/components/plots/ui";
import { TimeSeriesData } from "@/components/plots/models";

interface Props {
  searchTriggerLabel: string;
  searchPlaceholder: string;
  seriesX?: TimeSeriesData;
  seriesY?: TimeSeriesData;
  availableSeries?: TimeSeriesData[];
  onAddSeriesX: (series: TimeSeriesData) => void;
  onAddSeriesY: (series: TimeSeriesData) => void;
  onRemoveSeriesX: (id: string) => void;
  onRemoveSeriesY: (id: string) => void;
}

export const ScatterControls = ({
  searchTriggerLabel, searchPlaceholder, seriesX, seriesY, availableSeries,
  onRemoveSeriesX, onRemoveSeriesY, onAddSeriesX, onAddSeriesY
}: Props) => {
  return (
    <div className="flex flex-col space-y-4 h-full bg-background">

      {/* X-axis */}
      <div className="flex flex-col space-y-2 pr-3">
        <h2 className="text-xs font-medium text-muted-foreground">X-axis</h2>

        {/* Series Search */}
        <SeriesSearch
          options={availableSeries}
          onSelect={(selectedSeries) => onAddSeriesX(selectedSeries as TimeSeriesData)}
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
                  toggled={true}
                  onRemove={() => onRemoveSeriesX(seriesX.id)}
                />
              </div>
            </>
          }
        </div>
      </div>

      {/* Y-axis */}
      <div className="flex flex-col space-y-2 pr-3">
        <h2 className="text-xs font-medium text-muted-foreground">Y-axis</h2>

        {/* Series Search */}
        <SeriesSearch
          options={availableSeries}
          onSelect={(selectedSeries) => onAddSeriesY(selectedSeries as TimeSeriesData)}
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
                  toggled={true}
                  onRemove={() => onRemoveSeriesY(seriesY.id)}
                />
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};

