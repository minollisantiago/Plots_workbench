import { ThemeType } from '@/config/plots';
import { CanvasFigure } from '../ui/canvas-figure';
import { prepareScatterData } from './scatter.utils';
import { ScatterData } from '@/components/plots/models';

interface Props {
  data: Array<ScatterData>;
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
