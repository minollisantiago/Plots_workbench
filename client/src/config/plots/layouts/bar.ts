import { merge } from 'lodash';
import { PlotLayout } from '@/config/plots/models';
import { baseLayout, baseAxisConfig } from './base';

export const barLayout: Partial<PlotLayout> = merge({}, baseLayout, {
  hovermode: 'x',
  legend: {
    orientation: 'h',
    x: -0.1,
    xanchor: 'auto',
    y: 1.4
  },
  margin: {
    b: 50,
    l: 60,
    r: 10,
    t: 60
  },
  xaxis: {
    ...baseAxisConfig,
    hoverformat: '%d-%m-%Y %H:%M',
    showgrid: false,
    showline: true,
    showspikes: false,
    spikethickness: 2,
    zeroline: false,
    title: {
      standoff: 10
    }
  },
  yaxis: {
    ...baseAxisConfig,
    hoverformat: '.2f',
    linewidth: 0,
    showgrid: true,
    showline: false,
    side: 'left',
    title: {
      standoff: 10
    }
  },
  yaxis2: {
    ...baseAxisConfig,
    automargin: true,
    hoverformat: '.2f',
    overlaying: 'y',
    showgrid: false,
    showline: false,
    side: 'right',
    title: {
      standoff: 20
    }
  }
});
