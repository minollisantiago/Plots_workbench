import { ThemeType } from '@/lib/plot.config';
import { scatterData } from './scatter.models';
import { CanvasFigure } from '../ui/canvas-figure';
import { prepareScatterData } from './scatter.utils';

interface Props {
  data: scatterData;
  title?: string;
  theme?: ThemeType;
  width?: number | string;
  height?: number | string;
}

export const PlotScatterFigure = ({ data, title, theme, width, height }: Props) => {
  return (
    <CanvasFigure
      data={data}
      plotType="scatter"
      title={title}
      theme={theme}
      width={width}
      height={height}
      prepareData={prepareScatterData}
    />
  );
};
