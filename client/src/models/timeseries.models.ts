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
