import { PlotLayout, AxisLayout } from "@/types/plots";

export const baseLayout: Partial<PlotLayout> = {
  autosize: true,
  title: {
    x: 0.5,
    y: 0.9
  },
  margin: {
    b: 50,
    l: 60,
    r: 42,
    t: 60
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
