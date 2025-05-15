/**
 * This index.ts file serves as a central point for exporting components related to the scatter plot.
 * It exports the following:
 *  - PlotScatter: The main component that renders the scatter plot with controls and the figure.
 *  - PlotScatterFigure: The component responsible for rendering the actual scatter plot figure using Plotly.js.
 *  - ScatterControls: The component that provides controls for managing the series displayed on the plot,
 *    including adding series, removing, etc
 */
export * from './plot-scatter.tsx';
export * from './plot-scatter-figure.tsx';
export * from './plot-scatter-controls.tsx';
