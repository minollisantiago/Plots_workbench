import { PlotLayout } from '@/types/plots';
import { baseLayout, baseAxisConfig } from './base';
import { merge } from 'lodash';

export const scatterLayout: Partial<PlotLayout> = merge({}, baseLayout, {
  legend: {
    orientation: 'h',
    x: 1,
    xanchor: 'auto',
    y: 1.09
  },
  margin: {
    b: 50,
    l: 60,
    r: 42,
    t: 16
  },
  xaxis: {
    ...baseAxisConfig,
    hoverformat: '.2f',
    showline: true,
    showgrid: true,
    showspikes: false,
    spikethickness: 2,
    linewidth: 2
  },
  yaxis: {
    ...baseAxisConfig,
    hoverformat: '.2f',
    showline: true,
    showgrid: true,
    side: 'left',
    title: {
      standoff: 8
    }
  }
});
