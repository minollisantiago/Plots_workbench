import { PlotLayout, AxisLayout } from "@/config/plots/models";

export const baseLayout: Partial<PlotLayout> = {
  autosize: true,
  title: {
    x: 0.5,
    y: 0.9
  },
  legend: {
    x: 1.02,
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
  showline: true,
  showgrid: true,
  showspikes: false,
  spikethickness: 2,
  linewidth: 2,
  ticklen: 8,
  ticks: 'outside',
  zeroline: false,
  mirror: true
};
