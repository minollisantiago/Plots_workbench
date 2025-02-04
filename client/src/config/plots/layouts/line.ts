import { merge } from 'lodash';
import { PlotLayout } from '@/config/plots/models';
import { baseLayout, baseAxisConfig } from './base';

export const lineLayout: Partial<PlotLayout> = merge({}, baseLayout, {
  hovermode: 'x',
  margin: {
    b: 44,
    l: 60,
    r: 120,
    t: 0
  },
  xaxis: {
    ...baseAxisConfig,
    hoverformat: '%d-%m-%Y %H:%M',
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
