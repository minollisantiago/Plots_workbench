import { PlotLayout, AxisLayout } from '@/config/plots/models';

/**
 * Base layout configuration for all plot types.
 *
 * This configuration provides default settings for the overall plot appearance,
 * including size, legend position, margins, and transition effects.
 */
export const baseLayout: Partial<PlotLayout> = {
  hovermode: 'closest',
  autosize: true,
  width: undefined,
  height: undefined,
  showlegend: false,
  title: {
    x: 0.5,
    y: 0.9
  },
  legend: {
    x: 1.04,
    y: 1.02,
    xanchor: 'left',
    orientation: 'v',
  },
  margin: {
    b: 44,
    l: 60,
    r: 120,
    t: 0
  },
  transition: {
    duration: 500
  }
};

/**
 * Base axis configuration for all plot types.
 *
 * This configuration provides default settings for the appearance of x and y axes,
 * including grid lines, ticks, line styles, and titles.
 */
export const baseAxisConfig: Partial<AxisLayout> = {
  showline: false,
  showgrid: true,
  showspikes: false,
  spikethickness: 2,
  linewidth: 2,
  ticklen: 6,
  ticks: 'inside',
  ticklabelstandoff: 8,
  griddash: 'solid',
  zeroline: false,
  mirror: false
};
