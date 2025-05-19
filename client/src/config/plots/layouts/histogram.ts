import { merge } from 'lodash';
import { PlotLayout } from '@/config/plots/models';
import { baseLayout, baseAxisConfig } from './base';

export const histogramHLayout: Partial<PlotLayout> = merge({}, baseLayout, {
  barmode: 'overlay',
  hovermode: 'x',
  margin: {
    b: 50,
    l: 60,
    r: 10,
    t: 60
  },
  modebar: {},
  xaxis: {
    ...baseAxisConfig,
    hoverformat: '.2f',
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

export const histogramVLayout: Partial<PlotLayout> = merge({}, baseLayout, {
  barmode: 'overlay',
  hovermode: 'y',
  margin: {
    b: 50,
    l: 60,
    r: 10,
    t: 60
  },
  xaxis: {
    ...baseAxisConfig,
    hoverformat: '.2f',
    showgrid: false,
    side: 'left'
  },
  yaxis: {
    ...baseAxisConfig,
    hoverformat: '.2f',
    showgrid: false,
    title: {
      standoff: 8
    }
  }
});
