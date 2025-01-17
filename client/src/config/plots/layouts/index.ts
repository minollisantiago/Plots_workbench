import { barLayout } from './bar';
import { lineLayout } from './line';
import { scatterLayout } from './scatter';
import { histogramHLayout, histogramVLayout } from './histogram';

export const layouts = {
  line: lineLayout,
  bar: barLayout,
  scatter: scatterLayout,
  histogramH: histogramHLayout,
  histogramV: histogramVLayout
} as const;

export type PlotType = keyof typeof layouts;

export * from './bar';
export * from './scatter';
export * from './line';
export * from './histogram';
