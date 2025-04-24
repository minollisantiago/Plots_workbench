import { calculateYTD } from "@/components/plots/utils";

// Series pre-defined time periods
export type TimePeriod = {
  label: string;
  days: number;
};

// Periods array with label and corresponding trading days
export const periods: TimePeriod[] = [
  { label: "1W", days: 5 }, // Changed from 1 week to 5 days, assuming only weekdays
  { label: "1M", days: 22 }, // Assuming 22 trading days in a month
  { label: "3M", days: 66 }, // 3 months * 22 trading days
  { label: "6M", days: 132 }, // 6 months * 22 trading days
  { label: "YTD", days: calculateYTD() }, // Year to date (calculated)
  { label: "1Y", days: 252 }, // Assuming 252 trading days in a year
  { label: "All", days: 2000 } // -1 to signify all data
];

// Series metadata
export interface SeriesMetadata {
  id: string;
  label: string;
  subLabel: string;
  color: string;
  group: string;
}

// Series data
export interface PlotData {
  x: (number | string)[];
  y: number[];
  name: string;
  line: {
    color: string;
  };
}

export interface TimeSeriesData extends SeriesMetadata {
  plotData: PlotData;
}
