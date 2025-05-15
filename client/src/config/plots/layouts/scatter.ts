import { merge } from 'lodash';
import { PlotLayout } from '@/config/plots/models';
import { baseLayout, baseAxisConfig } from './base';

export const scatterLayout: Partial<PlotLayout> = merge({}, baseLayout, {
  margin: {
    b: 44,
    l: 60,
    r: 0,
    t: 0
  },
  xaxis: {
    ...baseAxisConfig,
    showline: true,
    showgrid: false,
    showspikes: false,
    spikethickness: 2,
    linewidth: 2,
    title: {
      standoff: 0
    }
  },
  yaxis: {
    ...baseAxisConfig,
    hoverformat: '.2f',
    side: 'left',
    showline: true,
    showgrid: true,
    title: {
      standoff: 8
    }
  }
});
