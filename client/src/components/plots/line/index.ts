/**
 * This index.ts file serves as a central point for exporting components related to the line plot.
 * It exports the following:
 *  - PlotLine: The main component that renders the line plot with controls and the figure.
 *  - PlotLineFigure: The component responsible for rendering the actual line plot figure using Plotly.js.
 *  - LineControls: The component that provides controls for managing the series displayed on the plot,
 *    including adding, removing, and toggling visibility and highlight.
 */
export * from './plot-line.tsx';
export * from './plot-line-figure.tsx';
export * from './plot-line-controls.tsx';
