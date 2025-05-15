import { merge } from 'lodash';
import { PlotLayout } from '@/config/plots/models';
import { baseLayout, baseAxisConfig } from './base';

export const scatterLayout: Partial<PlotLayout> = merge({}, baseLayout, {
  hovermode: 'closest',
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
    spikethickness: 2,
    linewidth: 2,
    ticks: '',
    title: {
      standoff: 8
    }
  },
  yaxis2: {
    ...baseAxisConfig,
    automargin: true,
    hoverformat: '.2f',
    overlaying: 'y',
    showgrid: false,
    side: 'right',
    spikethickness: 2,
    linewidth: 2,
    title: {
      standoff: 20
    }
  }
});
