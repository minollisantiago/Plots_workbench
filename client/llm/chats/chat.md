
Is it a good practice to use snake case to define props on components? like this for example:

<llm_context name="Props" filetype="typescriptreact" kind="Interface">
```typescriptreact
interface Props {
  searchTriggerLabel: string;
  searchPlaceholder: string;
  series?: TimeSeriesData[];
  series_x?: TimeSeriesData[];
  series_y?: TimeSeriesData[];
  availableSeries?: TimeSeriesData[];
  onAddSeries: (series: TimeSeriesData) =&gt; void;
  onRemoveSeries: (id: string) =&gt; void;
}
```
</llm_context>


---
## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

While the code you provided is valid TypeScript, it's generally not considered best practice to use snake_case for prop names in React components.

The React ecosystem and JavaScript/TypeScript style guides typically favor camelCase for variable and property names. This includes props passed to React components.

Here's why:

*   **Consistency:**  Using camelCase consistently throughout your codebase (including prop names) makes the code easier to read and understand. It aligns with the prevailing style in the JavaScript and React community.
*   **JavaScript Conventions:** JavaScript itself uses camelCase for most things.  Sticking to camelCase for props keeps your code aligned with standard JavaScript conventions.
*   **HTML Attributes:**  HTML attributes are case-insensitive, and React automatically converts camelCase props to their kebab-case equivalents when passing them to DOM elements (e.g., `myProp` becomes `my-prop`).  However, this conversion is for DOM attributes, not for props passed between React components.

Here's the `Props` interface refactored to use camelCase:

```typescriptreact
interface Props {
  searchTriggerLabel: string;
  searchPlaceholder: string;
  series?: TimeSeriesData[];
  seriesX?: TimeSeriesData[];
  seriesY?: TimeSeriesData[];
  availableSeries?: TimeSeriesData[];
  onAddSeries: (series: TimeSeriesData) => void;
  onRemoveSeries: (id: string) => void;
}
```

**Suggested next steps:**

*   **Linting:**  Configure a linter (like ESLint with the Airbnb or Standard config) to automatically enforce camelCase for prop names and other JavaScript/TypeScript code. This will help maintain consistency across your project.
*   **Refactor Existing Code:**  If you have existing components that use snake\_case props, refactor them to use camelCase.  This will improve the overall consistency and readability of your codebase.

## >>>>>>>>>>>>> LLM RESPONSE ENDS <<<<<<<<<<<<<<
---


