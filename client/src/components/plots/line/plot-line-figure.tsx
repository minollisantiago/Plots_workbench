import { lineData } from './line.models';
import { ThemeType } from '@/config/plots';
import { prepareLineData } from './line.utils';
import { CanvasFigure } from '../ui/canvas-figure';

interface Props {
  data: lineData;
  title?: string;
  theme?: ThemeType;
  width?: number | string;
  height?: number | string;
}

export const PlotLineFigure = ({ data, title, theme, width, height }: Props) => {
  return (
    <CanvasFigure
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
