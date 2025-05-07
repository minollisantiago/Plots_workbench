import Plot from 'react-plotly.js';
import { Data, Layout } from 'plotly.js';
import { PlotConfig, ThemeType, PlotType } from '@/config/plots';

// TODO: Need to add x and yaxis titles props
// NOTE: We are using the Data plotly type across the app for plotting data
// see @/components/plots/models/timeseries.models.ts for our time series types

interface Props {
  data: Data[];
  plotType: PlotType;
  title?: string;
  theme?: ThemeType;
  width?: number | string;
  height?: number | string;
}

export const CanvasFigure = (
  { data, plotType, title, theme, width = "100%", height = "100%" }: Props) => {

  // Get the combined layout and theme configuration
  const layout = PlotConfig.getConfig(plotType, theme);

  // Add the title if provided
  if (title) { layout.title = { ...layout.title, text: title }; }

  // Force data refresh (and re-render on any modification that dont change the data structure)
  const finalLayout = { ...layout, datarevision: Date.now() }

  return (
    <Plot
      data={data}
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
