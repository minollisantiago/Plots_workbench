## For LLMs

I want you to take a look at the codebase, specifically the client/ @client folder.

### Our goal
We are going to write a PRD for the app (Product Requirements Document). 

### What is the purpose of the PRD?
A **PRD (Product Requirements Document)** is a detailed document that outlines the features, functionality, and purpose of a product. It serves as a blueprint for the development team, designers, and stakeholders to ensure alignment on what needs to be built.

**Key Components of a PRD:**
1. **Objective** – The overall goal and purpose of the product.
2. **Features & Requirements** – A detailed breakdown of the product's functionality.
3. **User Stories** – Descriptions of how users will interact with the product.
4. **Technical Requirements** – Any necessary infrastructure, API dependencies, performance expectations, etc.
5. **Wireframes/Mockups** – Visual representations of UI/UX.
6. **Constraints & Risks** – Limitations, potential challenges, and dependencies.

A well-written PRD helps prevent misunderstandings, scope creep, and inefficiencies in the software development lifecycle.

**The PRD will be used to:**
- generate the technical specification for the app.
- generate the UI/UX design for the app.
- generate the test plan for the app.

### App overview and approach

**Disclaimer - IMPORTANT!**
This is an ongoing process, the app develoment is already started, so we will adjust to the current state of the app, but suggest changes as we write the PRD, particularly in terms of architecture. 

**The goal**
The goal of the app is to be a plotting tool. A canvas where the user can plot different types of charts to explore financial data. We take inspiration from tools like [excalidraw](https://excalidraw.com/) or [figma](https://www.figma.com/), to a smaller degree.

The user should be able to create plots, bookmark them with their own name, preserving the controls state, and fetch them from a cache, indexDB or local storage (not the entire component, but their props and state).

This way the user can create their own workspaces, as a collection of plots, and load them on the fly.

**Technologies**
For that purpose, we go with a component based approach, using react, shadcn/ui for the UI components, plotly for the plotting, and tailwindcss for the styling.

We are working with typescript for a better dev experience, as types are important on this project, due to the strict typing requirements we'll have from the backend apis.

### Current project structure
To map out the current state of the app, here is the file structure:

```
├── client
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   └── favicon.svg
│   ├── README.md
│   ├── src
│   │   ├── App.tsx
│   │   ├── assets
│   │   ├── components
│   │   │   ├── plots
│   │   │   │   ├── bar
│   │   │   │   ├── curve
│   │   │   │   ├── histogram
│   │   │   │   ├── line
│   │   │   │   │   ├── line.models.ts
│   │   │   │   │   ├── line.utils.ts
│   │   │   │   │   ├── plot-line-controls.tsx
│   │   │   │   │   └── plot-line.tsx
│   │   │   │   ├── plot-canvas.tsx
│   │   │   │   ├── scatter
│   │   │   │   │   ├── plot-scatter-controls.tsx
│   │   │   │   │   ├── plot-scatter.tsx
│   │   │   │   │   ├── scatter.models.ts
│   │   │   │   │   └── scatter.utils.ts
│   │   │   │   └── ui
│   │   │   │       ├── canvas-container.tsx
│   │   │   │       ├── canvas-header.tsx
│   │   │   │       ├── canvas-shadow.tsx
│   │   │   │       ├── color-picker.tsx
│   │   │   │       ├── date-range-picker.tsx
│   │   │   │       ├── index.ts
│   │   │   │       ├── series-card.tsx
│   │   │   │       ├── series-controls.tsx
│   │   │   │       ├── series-date-controls.tsx
│   │   │   │       └── series-search.tsx
│   │   │   └── ui
│   │   │       ├── button.tsx
│   │   │       ├── calendar.tsx
│   │   │       ├── card.tsx
│   │   │       ├── command.tsx
│   │   │       ├── custom
│   │   │       │   ├── bookmarks
│   │   │       │   │   ├── bookmarks-controls.tsx
│   │   │       │   │   └── bookmarks.tsx
│   │   │       │   ├── dock
│   │   │       │   │   ├── dock.models.ts
│   │   │       │   │   └── dock.tsx
│   │   │       │   ├── index.ts
│   │   │       │   └── workspace
│   │   │       │       └── canvas-workspace.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── popover.tsx
│   │   │       ├── scroll-area.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── toggle.tsx
│   │   │       └── tooltip.tsx
│   │   ├── config
│   │   │   ├── index.ts
│   │   │   ├── plots
│   │   │   │   ├── layouts
│   │   │   │   │   ├── bar.ts
│   │   │   │   │   ├── base.ts
│   │   │   │   │   ├── histogram.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── line.ts
│   │   │   │   │   └── scatter.ts
│   │   │   │   ├── models
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── plot.layout.ts
│   │   │   │   └── themes
│   │   │   │       ├── dark.ts
│   │   │   │       ├── index.ts
│   │   │   │       └── light.ts
│   │   │   └── ui
│   │   │       ├── index.ts
│   │   │       └── tooltip.config.ts
│   │   ├── data
│   │   │   └── mock
│   │   │       └── time-series-data.ts
│   │   ├── hooks
│   │   │   ├── use-keybind.ts
│   │   │   └── use-tool-state.ts
│   │   ├── lib
│   │   │   ├── plot.config.ts
│   │   │   └── utils.ts
│   │   ├── main.tsx
│   │   ├── models
│   │   │   ├── index.ts
│   │   │   └── timeseries.models.ts
│   │   ├── styles
│   │   │   ├── fonts.css
│   │   │   ├── globals.css
│   │   │   └── style.css
│   │   └── vite-env.d.ts
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
```

### Structure description
We are using a mix between vectical slice architecture and a layered architecture.

The main building blocks of the application are:
- components
- hooks
- models
- utils

### Components
The components are split into two main groups:
- plots
- ui

```
├── plots
│   ├── bar
│   ├── curve
│   ├── histogram
│   ├── line
│   │   ├── line.models.ts
│   │   ├── line.utils.ts
│   │   ├── plot-line-controls.tsx
│   │   └── plot-line.tsx
│   ├── plot-canvas.tsx
│   ├── scatter
│   │   ├── plot-scatter-controls.tsx
│   │   ├── plot-scatter.tsx
│   │   ├── scatter.models.ts
│   │   └── scatter.utils.ts
│   └── ui
│       ├── canvas-container.tsx
│       ├── canvas-header.tsx
│       ├── canvas-shadow.tsx
│       ├── color-picker.tsx
│       ├── date-range-picker.tsx
│       ├── index.ts
│       ├── series-card.tsx
│       ├── series-controls.tsx
│       ├── series-date-controls.tsx
│       └── series-search.tsx
└── ui
    ├── button.tsx
    ├── calendar.tsx
    ├── card.tsx
    ├── command.tsx
    ├── custom
    │   ├── bookmarks
    │   │   ├── bookmarks-controls.tsx
    │   │   └── bookmarks.tsx
    │   ├── dock
    │   │   ├── dock.models.ts
    │   │   └── dock.tsx
    │   ├── index.ts
    │   └── workspace
    │       └── canvas-workspace.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── label.tsx
    ├── popover.tsx
    ├── scroll-area.tsx
    ├── separator.tsx
    ├── sheet.tsx
    ├── toggle.tsx
    └── tooltip.tsx
```

**plots**
The plots group contains the components for the plotting functionality. Its organized in a vertical slice architecture, each plot type has its own folder, and inside it has the models, utils, controls and the plot component itself.

The folder contains a subfolder named ui/, where we have the ui components, that are used for the control menus for the plot components, some of these are going to be reused between the different plot component types.

At the highest level of the plots folder, we have a common plotting component, the  @plot-canvas.tsx, that handles the common plotting logic, and the state management for the plot components.

**ui**
The ui group contains the reusable components for the UI. These are for the most part the most generic components, like buttons, dialogs, popovers, etc. And they are all shadcn components. 

Additionally, we have a custom folder, where we have the components that are not part of shadcn, but are still generic enough to be reusable throught the app, at the highest level, basically for the application UI. In this folder, we are also using the vertical slice architecture, each component has its own folder, and inside it has the models, utils, controls and the component itself.

We are using this two libraries for our UI components:
- [shadcn](https://ui.shadcn.com/docs/components)
- [OriginUI](https://originui.com/)
- [radix-ui](https://www.radix-ui.com/primitives/docs/overview/introduction)

Radix is the base library used by the other two, so its going to be basically a source for documentation in case we run into issues with shadcn or originUI.

**Hooks**

Here we have all the custom hooks for the app:

*   `@use-keybind.ts`: Hook for handling keyboard shortcuts and bindings
*   `@use-tool-state.ts`: Hook for managing the state of the currently selected tool from the `@dock.tsx` component.
*   `@use-filtered-timeseries.ts`: Hook for managing the filtering of timeseries by series selection as well as time periods or date range selection.

### Plotting Implementation

The current implementation of the plotting components is an experiment, but the pattern we are using is the one we want to keep, albeit more generic and reusable:

*   The `@plot-line-figure.tsx` component is the main component for rendering a line plot. It takes an array of `LineData` objects as input.
*   The `@plot-scatter-figure.tsx` component is the main component for rendering a scatter plot. It takes an array of `ScatterData` objects as input.
*   The `@plot-canvas.tsx` component is a generic canvas component that handles the common plotting logic. It uses a `prepareData` function (e.g., `prepareLineData`, `prepareScatterData`) to transform the data into a format that Plotly.js can understand.  It's designed to work with different plotting components using the composition pattern.

Our plotting system uses TypeScript generics to create a type-safe and reusable architecture. Here's a detailed breakdown of how it works:

#### Defining Plot Data Types

First, we define our base `PlotData` interface:

```typescript
/**
 * @interface PlotData
 * @property {(number | string)[]} x - The x-axis data (e.g., dates or numbers).
 * @property {number[]} y - The y-axis data (e.g., stock prices).
 * @property {string} name - The name of the data series.
 */
export interface PlotData {
  x: (number | string)[];
  y: number[];
  name: string;
};
```

This interface defines the basic structure for all plot data, including the `x` and `y` values, and a `name` for the series.

#### Extending PlotData for Specific Plot Types

We then extend the `PlotData` interface for specific plot types, such as line plots and scatter plots:

```typescript
/**
 * @interface LineData
 * @extends {PlotData}
 * @property {('y' | 'y2')=} yaxis - The y-axis to use for the line plot (optional, defaults to 'y').
 * @property {boolean=} visible - Whether the line plot is visible (optional, defaults to true).
 * @property {number=} opacity - The opacity of the line plot (optional, defaults to 1).
 * @property {Object} line - The line styling properties.
 * @property {number=} line.width - The width of the line (optional).
 * @property {string} line.color - The color of the line.
 */
export interface LineData extends PlotData {
  yaxis?: 'y' | 'y2';
  visible?: boolean;
  opacity?: number;
  line: {
    width?: number;
    color: string;
  };
};

/**
 * @interface ScatterData
 * @extends {PlotData}
 * @property {boolean=} visible - Whether the scatter plot is visible (optional, defaults to true).
 * @property {number=} opacity - The opacity of the scatter plot (optional, defaults to 1).
 * @property {Object} marker - The marker styling properties.
 * @property {number=} marker.size - The size of the markers (optional).
 * @property {string=} marker.symbol - The symbol to use for the markers (optional).
 * @property {string=} marker.color - The color of the markers.
 * @property {number=} marker.opacity - The opacity of the markers (optional).
 * @property {Object} marker.line - The line styling properties for the marker outline (optional).
 * @property {number=} marker.line.width - The width of the marker outline (optional).
 * @property {string=} marker.line.color - The color of the marker outline (optional).
 */
export interface ScatterData extends PlotData {
  visible?: boolean;
  opacity?: number;
  marker: {
    size?: number;
    symbol?: string;
    color: string;
    opacity?: number;
    line?: {
      width?: number;
      color: string;
    }
  }
}
```

These interfaces inherit the properties of `PlotData` and add additional properties that are specific to each plot type.

#### Base Types and Generic Interface on plot-canvas.tsx

First, we define our base types that any plot data must conform to:

```typescript
export type PlotType = 'line' | 'scatter';
type PlotData = LineData | ScatterData;

interface Props<T extends PlotData> {
  data: Array<T>;
  plotType: PlotType;
  title?: string;
  theme?: ThemeType;
  width?: number | string;
  height?: number | string;
  prepareData: (data: Array<T>) => Data[];
}

```

The generic interface `Props<T extends PlotData>` ensures that:
- `T` must be a subtype of `PlotData`.
- When the interface is used, `T` will be replaced with a specific type (either `LineData` or `ScatterData`).
- The `data` prop is an array of elements that must match whatever type `T` is.
- The `prepareData` function must accept an array of elements with that same type `T` and return `Data[]`, a valid plotly model (see imports @/components/plots/models/timeseries.models.ts for more info on plotly types).

#### Generic Plot Component

The main plot component is defined with generics:

```typescript
export const PlotFigure = <T extends PlotData>(
  { data, plotType, title, theme, width = "100%", height = "100%", prepareData }: Props<T>
) => {
  // Get the combined layout and theme configuration
  const layout = PlotConfig.getConfig(plotType, theme);

  // Transform the data to match Plotly's expected format
  const plotData = prepareData(data);

  // Add the title if provided
  if (title) { layout.title = { ...layout.title, text: title }; }

  return (
    <Plot
      data={plotData}
      layout={finalLayout as Partial<Layout>}
      useResizeHandler={true}
      style={{ width, height }}
      config={{
        scrollZoom: true,
        responsive: true,
        autosizable: true,
        displaylogo: false,
        displayModeBar: 'hover',
      }}
      revision={data.length}
    />
  );
};
```


#### Using Plot Data Types in Components

The plot data types are used in the `PlotLineFigure` and `PlotScatterFigure` components to ensure that the correct data is passed to the `CanvasFigure` component:

```typescript
// In PlotLineFigure.tsx:
interface Props {
  data: Array<LineData>;
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
```

#### Benefits of this Approach

1. **Type Safety**:
   - TypeScript ensures data and preparation functions match
   - Prevents mixing incompatible data types and preparation functions
   - Compile-time error checking

2. **Code Reuse with Type Specificity**:
   - `PlotFigure` component is reusable for different plot types
   - Each usage maintains its specific type information
   - No duplicate code between different plot types

3. **Extensibility**:
   - Adding new plot types is straightforward once the new model is created (in this case BarData):
     ```typescript
     export type PlotType = 'line' | 'scatter' | 'bar';
     export type PlotData = LineData | ScatterData | BarData;
     ```
   - TypeScript enforces type safety for new plot types automatically

### Tasks to build the PRD
Here is the process plan with each task we are going to be doing in order:

- [ ] describe with much detail what the application does
- [ ] describe the application in terms of features and requirements, explicitly stating the main dependencies (shadcn, plotly, etc)
- [ ] recommend changes in the project structure to improve the app, take into account the current state of the app.
- [ ] create a diagram of the app structure for the PRD, once the proposed changes are accepted.
- [ ] create a mermaid diagram with the app flow, for the PRD.
- [ ] describe the main components and how they interact with each other
- [ ] separate the description of components into two main groups: UI components (focus on custom components) and plot components (focus on the plotting functionality)
- [ ] Evaluate the way the plotting components work with each other, you can propose imporvements, i prefer to use the composition pattern for this.
- [ ] describe the main features and how they are implemented
- [ ] describe the main technologies used
- [ ] describe the main libraries used
- [ ] describe the main patterns used
- [ ] describe the main architecture used
- [ ] describe the main ui/ux design patterns used
- [ ] describe the main testing strategy
- [ ] describe the main documentation strategy
- [ ] describe the main logging strategy

