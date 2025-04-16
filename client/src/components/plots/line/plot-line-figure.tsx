import { lineData } from './line.models';
import { prepareLineData } from './line.utils';
import { ThemeType } from '@/lib/plot.config';
import { PlotFigure } from '../plot-figure';

interface Props {
  data: lineData;
  title?: string;
  theme?: ThemeType;
  width?: number | string;
  height?: number | string;
}

export const PlotLineFigure = ({ data, title, theme, width, height }: Props) => {
  return (
    <PlotFigure
      data={data}
      plotType="line"
      title={title}
      theme={theme}
      width={width}
      height={height}
      prepareData={prepareLineData}
    />
  );
};
