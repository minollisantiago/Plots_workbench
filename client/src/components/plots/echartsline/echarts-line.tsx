import { CanvasHeader } from "@/components/plots/ui";
import { TimeSeriesData } from "@/components/plots/models";
import { LargeLineChart } from "@/components/plots/echartsline";

interface Props {
  title?: string;
  SeriesData: TimeSeriesData[];
};

export const PlotLinePerformant = ({ title = "Line Plot", SeriesData }: Props) => {

  return (

    <div className="grid grid-cols-[312px_1fr] gap-2 p-4 pt-0 h-full">

      {/* Controls */}
      <div className="flex flex-col space-y-4 p-2 h-full overflow-hidden">
        <CanvasHeader title={title} />
        <div className="flex-1 min-h-0">
        </div>
      </div>

      {/* Figure */}
      <div className="flex flex-col space-y-4 p-2 h-full">
        <div className="flex justify-end">
        </div>
        <LargeLineChart />
      </div>
    </div>
  )
};

