import { Data } from 'plotly.js';
import { ThemeType } from '@/config/plots';
import { CanvasFigure } from '../ui/canvas-figure';

interface Props {
  data: Array<Data>;
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
    />
  );
};
