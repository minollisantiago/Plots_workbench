import { calculateYTD } from "@/components/plots/utils";

/**
 * @typedef {Object} TimePeriod
 * @property {string} label - The label for the time period (e.g., "1W", "1M", "YTD").
 * @property {number} days - The number of trading days in the time period.
 */
export type TimePeriod = {
  label: string;
  days: number;
};

/**
 * An array of pre-defined time periods with labels and corresponding trading days.
 */
export const periods: TimePeriod[] = [
  { label: "1W", days: 5 }, // Changed from 1 week to 5 days, assuming only weekdays
  { label: "1M", days: 22 }, // Assuming 22 trading days in a month
  { label: "3M", days: 66 }, // 3 months * 22 trading days
  { label: "6M", days: 132 }, // 6 months * 22 trading days
  { label: "YTD", days: calculateYTD() }, // Year to date (calculated)
  { label: "1Y", days: 252 }, // Assuming 252 trading days in a year
  { label: "All", days: 2000 } // -1 to signify all data
];

/**
 * @interface SeriesMetadata
 * @property {string} id - A unique identifier for the series.
 * @property {string} label - The primary label for the series (e.g., stock ticker).
 * @property {string} subLabel - A secondary label for the series (e.g., "Share Price").
 * @property {string} color - The color to use when plotting the series.
 * @property {string} group - The group that the series belongs to (e.g., "Tech", "Consumer").
 */
export interface SeriesMetadata {
  id: string;
  label: string;
  subLabel: string;
  color: string;
  group: string;
};

/**
 * @interface PlotData
 * @property {(number | string)[]} x - The x-axis data (e.g., dates or numbers).
 * @property {number[]} y - The y-axis data (e.g., stock prices).
 * @property {string} name - The name of the data series.
 */
export interface PlotData {
  x: (number | string)[];
  y: number[];
  name: string;
};

/**
 * @interface TimeSeriesData
 * @extends {SeriesMetadata}
 * @property {PlotData} plotData - The data to plot for the time series.
 */
export interface TimeSeriesData extends SeriesMetadata {
  plotData: PlotData;
};

/**
 * @interface LineData: This interface is individual, for one specific trace, for an array of traces ==> Array<LineData> is required
 * @extends {PlotData}
 * @property {('y' | 'y2')=} yaxis - The y-axis to use for the line plot (optional, defaults to 'y').
 * @property {boolean=} visible - Whether the line plot is visible (optional, defaults to true).
 * @property {number=} opacity - The opacity of the line plot (optional, defaults to 1).
 * @property {Object} line - The line styling properties.
 * @property {number=} line.width - The width of the line (optional).
 * @property {string} line.color - The color of the line.
 */
export interface LineData extends PlotData {
  yaxis?: 'y' | 'y2';
  visible?: boolean;
  opacity?: number;
  line: {
    width?: number;
    color: string;
  };
};

/**
 * @interface ScatterData: This interface is individual, for one specific trace, for an array of traces ==> Array<ScatterData> is required
 * @extends {PlotData}
 * @property {boolean=} visible - Whether the scatter plot is visible (optional, defaults to true).
 * @property {number=} opacity - The opacity of the scatter plot (optional, defaults to 1).
 * @property {Object} marker - The marker styling properties.
 * @property {number=} marker.size - The size of the markers (optional).
 * @property {string=} marker.symbol - The symbol to use for the markers (optional).
 * @property {string=} marker.color - The color of the markers.
 * @property {number=} marker.opacity - The opacity of the markers (optional).
 * @property {Object} marker.line - The line styling properties for the marker outline (optional).
 * @property {number=} marker.line.width - The width of the marker outline (optional).
 * @property {string=} marker.line.color - The color of the marker outline (optional).
 */
export interface ScatterData extends PlotData {
  visible?: boolean;
  opacity?: number;
  marker: {
    size?: number;
    symbol?: string;
    color: string;
    opacity?: number;
    line?: {
      width?: number;
      color: string;
    }
  }
}
