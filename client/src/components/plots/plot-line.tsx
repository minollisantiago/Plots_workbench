import { FC } from 'react';
import Plot from 'react-plotly.js';
import { Data, Layout } from 'plotly.js';
import { PlotConfig, ThemeType } from '@/lib/plot-config';

interface PlotLineProps {
  data: Array<{
    x: (number | string)[];
    y: number[];
    name?: string;
    yaxis?: 'y' | 'y2';
  }>;
  title?: string;
  theme?: ThemeType;
  width?: number | string;
  height?: number | string;
}

export const PlotLine: FC<PlotLineProps> = ({
  data,
  title,
  theme = 'dark',
  width = '100%',
  height = '100%'
}) => {
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
    ...series
  }));

  return (
    <Plot
      data={plotData}
      layout={config as Partial<Layout>}
      useResizeHandler
      style={{ width, height }}
      config={{
        displayModeBar: true,
        responsive: true,
        scrollZoom: true
      }}
    />
  );
};
