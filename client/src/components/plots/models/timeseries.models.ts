import { calculateYTD } from "@/components/plots/utils";

/**
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
  { label: "1W", days: 5 }, // 5 trading days in a week
  { label: "1M", days: 22 }, // Assuming 22 trading days in a month
  { label: "3M", days: 66 }, // 3 months * 22 trading days
  { label: "6M", days: 132 }, // 6 months * 22 trading days
  { label: "YTD", days: calculateYTD() }, // Year to date (calculated)
  { label: "1Y", days: 252 }, // Assuming 252 trading days in a year
  { label: "All", days: 2000 } // -1 to signify all data
];

// NOTE: TIME SERIES TYPES - READ THE NOTES TO UNDERSTAND THE TYPES
// Ive designed this to follow a composition + transformation approach:
// All raw series start as a TimeSeriesData object, with metadata information + the mandatory plotting properties.
// We then transform the TimeSeriesData child object PlotData into a specific plot type data type: LineData, ScatterData, etc.
// This is done for plotting only and inside the specific plotting component.
// This transformation ensures that the Data object includes all the necessary styling properties.
// IMPORTANT IDEA BEHIND THIS APPROACH:
// This implementation normalizes upstream data, conforming to the TimeSeriesData model. We then handle these objects plot by plot case.
// This means that the same data can be rendered in line, scatter, etc plots, we just need to plug in the correct transformer function to the object.

/**
 * @interface SeriesMetadata: encapsulates time series descriptive information: labels, sublabels, groups, etc
 * @property {string} id - A unique identifier for the series.
 * @property {string} label - The primary label for the series (e.g., stock ticker).
 * @property {string} subLabel - A secondary label for the series (e.g., "Share Price").
 * @property {string} color - The color to use when plotting the series.
 * @property {string} group - The group that the series belongs to (e.g., "Tech", "Consumer").
 */
export interface SeriesMetadata {
  id: string;
  label: string;
  subLabel?: string;
  group?: string;
  color: string;
};

/**
 * @type PlotData: enforces the main properties required for plotting: x, y and trace name properties.
 * All other properties are taken from plotly's Data type, at the plotting component level.
 * @property {(number | string)[]} x - The x-axis data (e.g., dates or numbers).
 * @property {number[]} y - The y-axis data (e.g., stock prices).
 * @property {string} name - The name of the data series.
 */
export type PlotData = {
  x: (number | string)[];
  y: number[];
  name: string;
};

/**
 * @interface TimeSeriesData: composes SeriesMetadata and PlotData with the composition pattern.
 * TimeSeriesData is the main data type for the entire app, as we are working exclusively with time series data.
 * @extends {SeriesMetadata}
 * @property {PlotData} plotData - The data to plot for the time series.
 */
export interface TimeSeriesData extends SeriesMetadata {
  plotData: PlotData;
};

