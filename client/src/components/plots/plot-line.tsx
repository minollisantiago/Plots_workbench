import Plot from 'react-plotly.js';
import { Data, Layout } from 'plotly.js';
import { PlotConfig, ThemeType } from '@/lib/plot-config';

interface PlotLineProps {
  data: Array<{
    x: (number | string)[];
    y: number[];
    name?: string;
    yaxis?: 'y' | 'y2';
    visible?: boolean;
  }>;
  title?: string;
  theme?: ThemeType;
  width?: number | string;
  height?: number | string;
}

export const PlotLine = ({ data, title, theme = 'dark', width = '100%', height = '100%' }: PlotLineProps) => {
  // Get the combined layout and theme configuration
  const config = PlotConfig.getConfig('line', theme);

  // Add the title if provided
  if (title) {
    config.title = {
      ...config.title,
      text: title
    };
  }

  // Transform the data to match Plotly's expected format
  const plotData: Data[] = data.map(series => ({
    type: 'scatter',
    mode: 'lines',
    visible: series.visible ?? true,
    ...series
  }));

  return (
    <Plot
      data={plotData}
      layout={config as Partial<Layout>}
      useResizeHandler
      style={{ width, height }}
      config={{
        displaylogo: false,
        displayModeBar: 'hover',
        responsive: true,
        autosizable: true,
        scrollZoom: true,
      }}
    />
  );
};
