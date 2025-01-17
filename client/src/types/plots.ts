export interface PlotLayout {
  autosize?: boolean;
  title?: {
    x?: number;
    y?: number;
    text?: string;
  };
  barmode?: 'overlay' | 'group' | 'stack';
  hovermode?: 'x' | 'y' | 'closest' | 'false' | false;
  legend?: {
    orientation?: 'h' | 'v';
    x?: number;
    y?: number;
    xanchor?: 'auto' | 'left' | 'center' | 'right';
  };
  margin?: {
    b?: number;
    l?: number;
    r?: number;
    t?: number;
  };
  modebar?: Record<string, unknown>;
  transition?: {
    duration?: number;
  };
  xaxis?: AxisLayout;
  yaxis?: AxisLayout;
  yaxis2?: AxisLayout & {
    overlaying?: 'y';
    automargin?: boolean;
  };
}

export interface AxisLayout {
  hoverformat?: string;
  showline?: boolean;
  showgrid?: boolean;
  showspikes?: boolean;
  side?: 'left' | 'right';
  spikethickness?: number;
  linewidth?: number;
  zeroline?: boolean;
  ticklen?: number;
  ticks?: 'outside' | 'inside';
  mirror?: boolean;
  title?: {
    text?: string;
    standoff?: number;
  };
}

export interface PlotTheme {
  base: {
    paper_bgcolor: string;
    plot_bgcolor: string;
    font: FontConfig;
  };
  components: {
    title: {
      font: Partial<FontConfig>;
    };
    hoverlabel: {
      bgcolor: string;
      bordercolor: string;
      font: Partial<FontConfig>;
    };
    legend: {
      bgcolor: string;
      font?: Partial<FontConfig>;
    };
    modebar: {
      bgcolor: string;
      color: string;
      orientation: 'v' | 'h';
    };
    axis: {
      color: string;
      linecolor: string;
      gridcolor: string;
      spikecolor: string;
      tickcolor: string;
      font?: Partial<FontConfig>;
    };
  };
}

interface FontConfig {
  family: string;
  color: string;
  size: number;
}
