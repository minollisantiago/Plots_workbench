import Plot from 'react-plotly.js';
import { Layout } from 'plotly.js';
import { scatterData } from './scatter.models';
import { prepareScatterData } from './scatter.utils';
import { PlotConfig, ThemeType } from '@/lib/plot.config';

interface Props {
  data: scatterData;
  title?: string;
  theme?: ThemeType;
  width?: number | string;
  height?: number | string;
}

export const PlotScatter = ({ data, title, theme, width = "100%", height = "100%" }: Props) => {
  // Get the combined layout and theme configuration
  const layout = PlotConfig.getConfig('scatter', theme);

  // Transform the data to match Plotly's expected format
  const plotData = prepareScatterData(data);

  // Add the title if provided
  if (title) {
    layout.title = { ...layout.title, text: title };
  }

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
