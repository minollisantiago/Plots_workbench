import { merge } from 'lodash';
import { themes, ThemeType } from '@/config/plots/themes';
import { layouts, PlotType } from '@/config/plots/layouts';
import { PlotLayout, PlotTheme } from '@/config/plots/models';

export class PlotConfig {
  private static themes: Record<ThemeType, PlotTheme> = themes;
  private static layouts: Record<PlotType, Partial<PlotLayout>> = layouts;

  static getConfig(plotType: PlotType, theme: ThemeType = 'dark'): Partial<PlotLayout> {
    const themeConfig = this.getThemeConfig(theme);
    const layoutConfig = this.getLayoutConfig(plotType);

    return this.mergeConfigs(layoutConfig, themeConfig);
  }

  private static getThemeConfig(theme: ThemeType): PlotTheme {
    return this.themes[theme];
  }

  private static getLayoutConfig(plotType: PlotType): Partial<PlotLayout> {
    return this.layouts[plotType] || this.layouts.line;
  }

  private static mergeConfigs(
    layout: Partial<PlotLayout>,
    theme: PlotTheme
  ): Partial<PlotLayout> {
    return merge({}, layout, {
      paper_bgcolor: theme.base.paper_bgcolor,
      plot_bgcolor: theme.base.plot_bgcolor,
      font: theme.base.font,
      title: {
        ...layout.title,
        font: theme.components.title.font
      },
      hoverlabel: theme.components.hoverlabel,
      legend: {
        ...layout.legend,
        bgcolor: theme.components.legend.bgcolor,
        font: theme.components.legend.font
      },
      modebar: theme.components.modebar,
      xaxis: {
        ...layout.xaxis,
        ...theme.components.axis
      },
      yaxis: {
        ...layout.yaxis,
        ...theme.components.axis
      },
      yaxis2: layout.yaxis2 ? {
        ...layout.yaxis2,
        ...theme.components.axis
      } : undefined
    });
  }
}

export type { PlotType } from "@/config/plots/layouts"
export type { ThemeType } from "@/config/plots/themes"
