import Plot from 'react-plotly.js';
import { Layout } from 'plotly.js';
import { lineData } from './line.models';
import { prepareLineData } from './line.utils';
import { PlotLayout } from '@/config/plots/models';
import { PlotConfig, ThemeType } from '@/lib/plot.config';

interface Props {
  data: lineData;
  title?: string;
  theme?: ThemeType;
  width?: number | string;
  height?: number | string;
};

export const PlotLineFigure = ({ data, title, theme, width = "100%", height = "100%" }: Props) => {
  // Get the combined layout and theme configuration
  const layout: PlotLayout = PlotConfig.getConfig('line', theme);

  // Transform the data to match Plotly's expected format
  const plotData = prepareLineData(data);

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
