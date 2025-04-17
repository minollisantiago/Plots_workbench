import Plot from 'react-plotly.js';
import { Data, Layout } from 'plotly.js';
import { lineData } from '../line/line.models';
import { scatterData } from '../scatter/scatter.models';
import { PlotConfig, ThemeType } from '@/lib/plot.config';

type PlotType = 'line' | 'scatter';
type PlotData = lineData | scatterData;

interface Props<T extends PlotData> {
  data: T;
  plotType: PlotType;
  title?: string;
  theme?: ThemeType;
  width?: number | string;
  height?: number | string;
  prepareData: (data: T) => Data[];
}

export const CanvasFigure = <T extends PlotData>(
  { data, plotType, title, theme, width = "100%", height = "100%", prepareData }: Props<T>
) => {

  // Get the combined layout and theme configuration
  const layout = PlotConfig.getConfig(plotType, theme);

  // Transform the data to match Plotly's expected format
  const plotData = prepareData(data);

  // Add the title if provided
  if (title) { layout.title = { ...layout.title, text: title }; }

  // Force data refresh (and re-render on any modification that dont change the data structure)
  const finalLayout = { ...layout, datarevision: Date.now() }

  return (
    <Plot
      data={plotData}
      layout={finalLayout as Partial<Layout>}
      useResizeHandler={true}
      style={{ width, height }}
      config={{
        scrollZoom: true,
        responsive: true,
        autosizable: true,
        displaylogo: false,
        displayModeBar: 'hover',
      }}
      // Force rerender when series count changes
      revision={data.length}
    />
  );
};
