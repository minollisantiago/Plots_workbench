import { Data } from 'plotly.js';
import { ThemeType } from '@/lib/plot.config';
import { lineData } from './line/line.models';
import { scatterData } from './scatter/scatter.models';

export type PlotType = 'line' | 'scatter';

export type PlotData = lineData | scatterData;

export interface PlotFigureProps<T extends PlotData> {
  data: T;
  plotType: PlotType;
  title?: string;
  theme?: ThemeType;
  width?: number | string;
  height?: number | string;
  prepareData: (data: T) => Data[];
}
