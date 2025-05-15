import { merge } from 'lodash';
import { themes, ThemeType } from '@/config/plots/themes';
import { layouts, PlotType } from '@/config/plots/layouts';
import { PlotLayout, PlotTheme } from '@/config/plots/models';

/**
 * @class PlotConfig
 *
 * Provides methods for retrieving and merging plot configurations,
 * including themes and layouts.  This class centralizes plot configuration
 * to ensure consistency across the application.
 */
export class PlotConfig {
  private static themes: Record<ThemeType, PlotTheme> = themes;
  private static layouts: Record<PlotType, Partial<PlotLayout>> = layouts;

  /**
   * Retrieves a plot configuration by merging a base layout with a theme.
   *
   * @param {PlotType} plotType - The type of plot to configure.
   * @param {ThemeType} theme - The theme to apply. Defaults to 'dark'.
   * @returns {Partial<PlotLayout>} The merged plot configuration.
   */
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

  /**
   * Merges a layout configuration with a theme configuration.
   *
   * The theme configuration is applied on top of the layout configuration,
   * overriding the base style attributes such as `paper_bgcolor`, `plot_bgcolor`,
   * `font`, `title`, `hoverlabel`, `legend`, `modebar`, `xaxis`, and `yaxis`.
   *
   * @param {Partial<PlotLayout>} layout - The base layout configuration.
   * @param {PlotTheme} theme - The theme configuration.
   * @returns {Partial<PlotLayout>} The merged plot configuration.
   */
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
