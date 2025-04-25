import { useMemo } from "react";
import { TimePeriod, TimeSeriesData } from "@/components/plots/models";

interface props {
  allSeries: TimeSeriesData[],
  selectedSeriesIds: string[],
  period: TimePeriod,
};

export const useFilteredTimeSeries = ({ allSeries, selectedSeriesIds, period }: props): TimeSeriesData[] => {

  return useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - period.days);

    return allSeries.filter(series => selectedSeriesIds.includes(series.id)).map(series => {
      const { x: originalX, y: originalY } = series.plotData;

      const filteredData = originalX.reduce<{ x: (number | string)[], y: number[] }>((acc, date, index) => {
        const itemDate = new Date(date);

        if (itemDate >= cutoffDate) {
          acc.x.push(date);
          acc.y.push(originalY[index]);
        }

        return acc;
      }, { x: [], y: [] });

      return {
        ...series,
        plotData: {
          ...series.plotData,
          x: filteredData.x,
          y: filteredData.y,
        },
      };
    });
  }, [allSeries, selectedSeriesIds, period]);
};
