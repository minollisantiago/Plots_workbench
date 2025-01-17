import { merge } from 'lodash';
import { PlotLayout } from '@/types/plots';
import { baseLayout, baseAxisConfig } from './base';

export const lineLayout: Partial<PlotLayout> = merge({}, baseLayout, {
  hovermode: 'x',
  legend: {
    orientation: 'h',
    x: 1,
    xanchor: 'right',
    y: 1.12
  },
  margin: {
    b: 50,
    l: 60,
    r: 42,
    t: 60
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
