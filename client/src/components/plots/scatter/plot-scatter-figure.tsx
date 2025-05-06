import { ThemeType } from '@/config/plots';
import { CanvasFigure } from '../ui/canvas-figure';
import { ScatterData } from '@/components/plots/models';
import { prepareScatterData } from '@/components/plots/utils';

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
      plotType="line"
      title={title}
      theme={theme}
      width={width}
      height={height}
      prepareData={prepareScatterData}
    />
  );
};
