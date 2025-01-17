import { PlotLayout } from '@/types/plots';
import { baseLayout, baseAxisConfig } from './base';
import { merge } from 'lodash';

export const histogramHLayout: Partial<PlotLayout> = merge({}, baseLayout, {
  barmode: 'overlay',
  hovermode: 'x',
  legend: {
    orientation: 'h',
    x: 1,
    xanchor: 'auto',
    y: 1.1
  },
  margin: {
    b: 50,
    l: 60,
    r: 42,
    t: 16
  },
  modebar: {},
  xaxis: {
    ...baseAxisConfig,
    hoverformat: '.2f'
  },
  yaxis: {
    ...baseAxisConfig,
    hoverformat: '.2f',
    side: 'left',
    title: {
      standoff: 0
    }
  }
});

export const histogramVLayout: Partial<PlotLayout> = merge({}, baseLayout, {
  barmode: 'overlay',
  hovermode: 'y',
  legend: {
    orientation: 'h',
    x: 1,
    xanchor: 'auto',
    y: 1.1
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
