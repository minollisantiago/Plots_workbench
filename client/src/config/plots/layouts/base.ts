import { PlotLayout, AxisLayout } from '@/config/plots/models';

export const baseLayout: Partial<PlotLayout> = {
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
    duration: 150
  }
};

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
