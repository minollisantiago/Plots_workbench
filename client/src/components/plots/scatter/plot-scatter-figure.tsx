import { scatterData } from './scatter.models';
import { prepareScatterData } from './scatter.utils';
import { ThemeType } from '@/lib/plot.config';
import { PlotFigure } from '../plot-figure';

interface Props {
  data: scatterData;
  title?: string;
  theme?: ThemeType;
  width?: number | string;
  height?: number | string;
}

export const PlotScatterFigure = ({ data, title, theme, width, height }: Props) => {
  return (
    <PlotFigure
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
