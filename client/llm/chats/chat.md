
What type of data structure is the DOCK_TOOLS object?

<llm_context kind="Variable" filetype="typescript" name="DOCK_TOOLS">
```typescript
export const DOCK_TOOLS: DockToolConfig[] = [
  { id: "hand", icon: Hand, label: "Hand tool", keybind: "h" },
  { id: "selection", icon: MousePointer2, label: "Selection tool", keybind: "v" },
  { id: "clear", icon: Trash2, label: "Clear workspace", keybind: "ctrl+del" },
  { id: "line", icon: LineChart, label: "Add line plot", keybind: "ctrl+1" },
  { id: "scatter", icon: ScatterChart, label: "Add scatter plot", keybind: "ctrl+2" },
  { id: "bar", icon: ChartColumnBig, label: "Add bar plot", keybind: "ctrl+3" },
  { id: "histogram", icon: BarChart3, label: "Add histogram plot", keybind: "ctrl+4" },
  { id: "curve", icon: ChartNoAxesCombined, label: "Add curve plot", keybind: "ctrl+5" },
]
```
</llm_context>


---
## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

The `DOCK_TOOLS` object is an array of `DockToolConfig` objects. Each `DockToolConfig` object appears to have properties like `id`, `icon`, `label`, and `keybind`.

Here are some follow-up ideas:

*   Consider defining a formal `interface` or `type` for `DockToolConfig`. This would provide better type safety and autocompletion.
*   Think about whether the `keybind` property should be optional, or if every tool should have a keybinding.
*   Explore whether the `DOCK_TOOLS` array should be configurable at runtime, perhaps by reading from a configuration file.

## >>>>>>>>>>>>> LLM RESPONSE ENDS <<<<<<<<<<<<<<
---

Here is DockToolConfig:

<llm_context kind="Interface" filetype="typescript" name="DockToolConfig">
```typescript
export interface DockToolConfig {
  id: DockTool
  icon: LucideIcon
  label?: string
  keybind?: string | undefined
}
```
</llm_context>


---
## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

Thanks for providing the `DockToolConfig` interface.

To reiterate, `DOCK_TOOLS` is an array of objects, where each object conforms to the `DockToolConfig` interface. This interface defines the structure of each tool configuration, including its `id` (of type `DockTool`), `icon` (a `LucideIcon`), an optional `label` (string), and an optional `keybind` (string or undefined).

Here are some follow-up ideas:

*   Given that `keybind` is optional, consider providing a default keybinding or a mechanism to assign one if it's missing.
*   You might want to add validation to ensure that `id` values are unique within the `DOCK_TOOLS` array.
*   Think about whether the `icon` property should be restricted to a specific set of icons or allow any `LucideIcon`.
*   Consider using a `Map` instead of an array if you need to quickly look up tools by their `id`.

## >>>>>>>>>>>>> LLM RESPONSE ENDS <<<<<<<<<<<<<<

## >>>>>>>>>>>>> LLM RESPONSE ENDS <<<<<<<<<<<<<<
---

How would the map version be?


---
## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

```typescript
const DOCK_TOOLS_MAP: Map<DockTool, DockToolConfig> = new Map(
  DOCK_TOOLS.map((tool) => [tool.id, tool])
);
```

This code snippet transforms the existing `DOCK_TOOLS` array into a `Map` called `DOCK_TOOLS_MAP`. The keys of the `Map` are the `id` values (of type `DockTool`) from each `DockToolConfig` object, and the values are the corresponding `DockToolConfig` objects themselves.

Here are some follow-up ideas:

*   Consider how you would handle potential duplicate `id` values if the original `DOCK_TOOLS` array contained them. The `Map` would simply overwrite earlier entries with the same `id`. You might want to add a check for duplicates and throw an error or log a warning.
*   Explore the performance implications of using a `Map` versus an array for your specific use case. If you frequently need to look up tools by their `id`, a `Map` will offer faster lookups (O(1) on average) compared to iterating through an array (O(n)).
*   Think about whether you still need the original `DOCK_TOOLS` array, or if you can replace it entirely with the `DOCK_TOOLS_MAP`.
*   If you need to iterate over the tools in a specific order, consider using a `LinkedHashMap` implementation (if available in your environment) to preserve the insertion order from the original array.

## >>>>>>>>>>>>> LLM RESPONSE ENDS <<<<<<<<<<<<<<
---

How would i look for a specific tool on both DOCK_TOOLS and DOCK_TOOLS_MAP?


---
## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

Okay, here's how you would look for a specific tool in both `DOCK_TOOLS` (the array) and `DOCK_TOOLS_MAP` (the `Map`), assuming you're searching by the `id` property:

**1. Searching in `DOCK_TOOLS` (the array):**

```typescript
function findToolInArray(toolId: DockTool): DockToolConfig | undefined {
  return DOCK_TOOLS.find((tool) => tool.id === toolId);
}

// Example usage:
const handTool = findToolInArray("hand");
if (handTool) {
  console.log("Found tool:", handTool);
} else {
  console.log("Tool not found");
}
```

This code uses the `find` method of the array to iterate through the `DOCK_TOOLS` array and return the first `DockToolConfig` object whose `id` matches the provided `toolId`. If no matching tool is found, it returns `undefined`.

**2. Searching in `DOCK_TOOLS_MAP` (the Map):**

```typescript
function findToolInMap(toolId: DockTool): DockToolConfig | undefined {
  return DOCK_TOOLS_MAP.get(toolId);
}

// Example usage:
const selectionTool = findToolInMap("selection");
if (selectionTool) {
  console.log("Found tool:", selectionTool);
} else {
  console.log("Tool not found");
}
```

This code uses the `get` method of the `Map` to directly retrieve the `DockToolConfig` object associated with the provided `toolId`. If no tool with that `id` exists in the `Map`, it returns `undefined`.

**Comparison and when to use which:**

*   **Array (`DOCK_TOOLS`):**  Use when you need to iterate through all the tools or when the order of the tools matters.  Searching an array has a time complexity of O(n), where n is the number of tools.
*   **Map (`DOCK_TOOLS_MAP`):** Use when you need to quickly look up tools by their `id`.  Searching a map has an average time complexity of O(1), making it much faster for lookups, especially when you have a large number of tools.

Here are some follow-up ideas:

*   Consider adding error handling to these functions, such as throwing an error if the `toolId` is not a valid `DockTool` value.
*   You could create a single function that abstracts away the underlying data structure, allowing you to switch between the array and the map implementation without modifying the calling code.
*   If you need to perform more complex searches (e.g., searching by label or keybinding), you might want to create separate functions for each search criteria, or use a more advanced data structure like a search index.

## >>>>>>>>>>>>> LLM RESPONSE ENDS <<<<<<<<<<<<<<
---

Could you please document with JSDoc this custom hook:

<llm_context path="/home/santiago/projects/testApps/components_workbench/client/src/hooks/use-tool-state.ts" filetype="ts" name="use-tool-state.ts">
```ts
import { useState, useCallback } from "react";
import { DockTool } from '@/components/ui/custom';

type xyPosition = { x: number, y: number };
type canvasOffset = Record&lt;string, number&gt;;

interface UseToolStateReturn {
  selectedDockTool: DockTool;
  canvases: string[];
  IsWorkspaceDraggable: boolean;
  IsCanvasDraggable: boolean;
  workspacePosition: xyPosition;
  offsetIndex: canvasOffset;
  handleToolSelect: (tool: DockTool) =&gt; void;
  handleCanvasFocus: (id: string) =&gt; void;
  handleCanvasRemove: (id: string) =&gt; void;
  setWorkspacePosition: (position: xyPosition) =&gt; void;
}

export function useToolState(): UseToolStateReturn {
  const [selectedDockTool, setSelectedDockTool] = useState&lt;DockTool&gt;("hand");
  const [canvases, setCanvases] = useState&lt;string[]&gt;([]);
  const [workspacePosition, setWorkspacePosition] = useState&lt;xyPosition&gt;({ x: 0, y: 0 });
  const [offsetIndex, setOffsetIndex] = useState&lt;canvasOffset&gt;({});

  const IsWorkspaceDraggable: boolean = selectedDockTool === "hand";
  const IsCanvasDraggable: boolean = !IsWorkspaceDraggable;

  const handleToolSelect = useCallback((tool: DockTool) =&gt; {
    setSelectedDockTool(tool);

    switch (tool) {
      case "line":
      case "scatter":
      case "bar":
      case "histogram":
      case "curve":
        const newCanvasId = `canvas-${Date.now()}`;
        setCanvases(prev =&gt; [...prev, newCanvasId]);

        // Wrote by monke:
        // As new canvases are created we store their index for position offseting purposes (set at the App level)
        // If the workspace position changes when the user pans around the screen, the Offset index is reset back to 0,
        // this way new canvases begin offseting their position relative to the first canvas rendered at the center of the workspace
        // after the user is done panning.
        setOffsetIndex(prev =&gt; {
          const newOffset = Object.keys(prev).length;
          return { ...prev, [newCanvasId]: newOffset };
        })
        break;

      case "clear":
        setCanvases([]);
        setOffsetIndex({});
        break;
    }
  }, []);

  const handleWorkspacePositionChange = useCallback((position: xyPosition) =&gt; {
    setWorkspacePosition(position);
    setOffsetIndex({});
  }, []);

  const handleCanvasFocus = useCallback((id: string) =&gt; {
    setCanvases(prev =&gt; {
      const filtered = prev.filter(canvasId =&gt; canvasId !== id);
      return [...filtered, id];
    });
  }, []);

  const handleCanvasRemove = useCallback((id: string) =&gt; {
    setCanvases(prev =&gt; prev.filter(canvasId =&gt; canvasId !== id));
  }, []);

  return {
    selectedDockTool,
    canvases,
    IsWorkspaceDraggable,
    IsCanvasDraggable,
    workspacePosition,
    offsetIndex,
    handleToolSelect,
    handleCanvasFocus,
    handleCanvasRemove,
    setWorkspacePosition: handleWorkspacePositionChange,
  };

};

```
</llm_context>

Here are the types for the dock tool:

<llm_context path="/home/santiago/projects/testApps/components_workbench/client/src/components/ui/custom/dock/dock.models.ts" filetype="ts" name="dock.models.ts">
```ts
import { LucideIcon } from "lucide-react";
import { Hand, MousePointer2, Trash2, LineChart, BarChart3, ScatterChart, ChartColumnBig, ChartNoAxesCombined } from "lucide-react";

export type DockTool = "hand" | "selection" | "clear" | "line" | "scatter" | "bar" | "histogram" | "curve"

export interface DockToolConfig {
  id: DockTool
  icon: LucideIcon
  label?: string
  keybind?: string | undefined
}

export const DOCK_TOOLS: DockToolConfig[] = [
  { id: "hand", icon: Hand, label: "Hand tool", keybind: "h" },
  { id: "selection", icon: MousePointer2, label: "Selection tool", keybind: "v" },
  { id: "clear", icon: Trash2, label: "Clear workspace", keybind: "ctrl+del" },
  { id: "line", icon: LineChart, label: "Add line plot", keybind: "ctrl+1" },
  { id: "scatter", icon: ScatterChart, label: "Add scatter plot", keybind: "ctrl+2" },
  { id: "bar", icon: ChartColumnBig, label: "Add bar plot", keybind: "ctrl+3" },
  { id: "histogram", icon: BarChart3, label: "Add histogram plot", keybind: "ctrl+4" },
  { id: "curve", icon: ChartNoAxesCombined, label: "Add curve plot", keybind: "ctrl+5" },
]

export const DOCK_TOOLS_MAP: Map&lt;DockTool, DockToolConfig&gt; = new Map(
  DOCK_TOOLS.map((tool) =&gt; [tool.id, tool])
);
```
</llm_context>


---
## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

```typescript
import { useState, useCallback } from "react";
import { DockTool } from '@/components/ui/custom';

type xyPosition = { x: number, y: number };
type canvasOffset = Record<string, number>;

interface UseToolStateReturn {
  selectedDockTool: DockTool;
  canvases: string[];
  IsWorkspaceDraggable: boolean;
  IsCanvasDraggable: boolean;
  workspacePosition: xyPosition;
  offsetIndex: canvasOffset;
  handleToolSelect: (tool: DockTool) => void;
  handleCanvasFocus: (id: string) => void;
  handleCanvasRemove: (id: string) => void;
  setWorkspacePosition: (position: xyPosition) => void;
}

/**
 * Custom hook for managing the state of tools and canvases in the workspace.
 *
 * @returns {UseToolStateReturn} An object containing the state and functions for managing tools and canvases.
 */
export function useToolState(): UseToolStateReturn {
  const [selectedDockTool, setSelectedDockTool] = useState<DockTool>("hand");
  const [canvases, setCanvases] = useState<string[]>([]);
  const [workspacePosition, setWorkspacePosition] = useState<xyPosition>({ x: 0, y: 0 });
  const [offsetIndex, setOffsetIndex] = useState<canvasOffset>({});

  const IsWorkspaceDraggable: boolean = selectedDockTool === "hand";
  const IsCanvasDraggable: boolean = !IsWorkspaceDraggable;

  /**
   * Handles the selection of a tool from the dock.
   *
   * @param {DockTool} tool The selected tool.
   */
  const handleToolSelect = useCallback((tool: DockTool) => {
    setSelectedDockTool(tool);

    switch (tool) {
      case "line":
      case "scatter":
      case "bar":
      case "histogram":
      case "curve":
        const newCanvasId = `canvas-${Date.now()}`;
        setCanvases(prev => [...prev, newCanvasId]);

        // Wrote by monke:
        // As new canvases are created we store their index for position offseting purposes (set at the App level)
        // If the workspace position changes when the user pans around the screen, the Offset index is reset back to 0,
        // this way new canvases begin offseting their position relative to the first canvas rendered at the center of the workspace
        // after the user is done panning.
        setOffsetIndex(prev => {
          const newOffset = Object.keys(prev).length;
          return { ...prev, [newCanvasId]: newOffset };
        })
        break;

      case "clear":
        setCanvases([]);
        setOffsetIndex({});
        break;
    }
  }, []);

  /**
   * Handles changes to the workspace position.
   *
   * @param {xyPosition} position The new workspace position.
   */
  const handleWorkspacePositionChange = useCallback((position: xyPosition) => {
    setWorkspacePosition(position);
    setOffsetIndex({});
  }, []);

  /**
   * Handles focusing a canvas by moving it to the end of the canvases array.
   *
   * @param {string} id The ID of the canvas to focus.
   */
  const handleCanvasFocus = useCallback((id: string) => {
    setCanvases(prev => {
      const filtered = prev.filter(canvasId => canvasId !== id);
      return [...filtered, id];
    });
  }, []);

  /**
   * Handles removing a canvas from the workspace.
   *
   * @param {string} id The ID of the canvas to remove.
   */
  const handleCanvasRemove = useCallback((id: string) => {
    setCanvases(prev => prev.filter(canvasId => canvasId !== id));
  }, []);

  return {
    selectedDockTool,
    canvases,
    IsWorkspaceDraggable,
    IsCanvasDraggable,
    workspacePosition,
    offsetIndex,
    handleToolSelect,
    handleCanvasFocus,
    handleCanvasRemove,
    setWorkspacePosition: handleWorkspacePositionChange,
  };

};
```

Here are some follow-up ideas:

*   Consider adding more detailed JSDoc comments to the `UseToolStateReturn` interface to describe each property and function.
*   You could add JSDoc comments to the `xyPosition` and `canvasOffset` types for better clarity.
*   Think about whether the "Wrote by monke" comment should be replaced with a more formal explanation of the offset logic in the JSDoc.
*   Explore the possibility of using a more robust state management library like Redux or Zustand if the complexity of your application grows.

## >>>>>>>>>>>>> LLM RESPONSE ENDS <<<<<<<<<<<<<<
---

Yes, include the wrote by monke section on the JSDoc please.


---
## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

```typescript
import { useState, useCallback } from "react";
import { DockTool } from '@/components/ui/custom';

type xyPosition = { x: number, y: number };
type canvasOffset = Record<string, number>;

interface UseToolStateReturn {
  selectedDockTool: DockTool;
  canvases: string[];
  IsWorkspaceDraggable: boolean;
  IsCanvasDraggable: boolean;
  workspacePosition: xyPosition;
  offsetIndex: canvasOffset;
  handleToolSelect: (tool: DockTool) => void;
  handleCanvasFocus: (id: string) => void;
  handleCanvasRemove: (id: string) => void;
  setWorkspacePosition: (position: xyPosition) => void;
}

/**
 * Custom hook for managing the state of tools and canvases in the workspace.
 *
 * @returns {UseToolStateReturn} An object containing the state and functions for managing tools and canvases.
 * @property {DockTool} selectedDockTool - The currently selected dock tool.
 * @property {string[]} canvases - An array of canvas IDs.
 * @property {boolean} IsWorkspaceDraggable - A boolean indicating whether the workspace is draggable.
 * @property {boolean} IsCanvasDraggable - A boolean indicating whether the canvas is draggable.
 * @property {xyPosition} workspacePosition - The current position of the workspace.
 * @property {canvasOffset} offsetIndex - An object mapping canvas IDs to their offset index.
 * @property {function} handleToolSelect - A function to handle the selection of a tool.
 * @property {function} handleCanvasFocus - A function to handle focusing a canvas.
 * @property {function} handleCanvasRemove - A function to handle removing a canvas.
 * @property {function} setWorkspacePosition - A function to set the workspace position.
 */
export function useToolState(): UseToolStateReturn {
  const [selectedDockTool, setSelectedDockTool] = useState<DockTool>("hand");
  const [canvases, setCanvases] = useState<string[]>([]);
  const [workspacePosition, setWorkspacePosition] = useState<xyPosition>({ x: 0, y: 0 });
  const [offsetIndex, setOffsetIndex] = useState<canvasOffset>({});

  const IsWorkspaceDraggable: boolean = selectedDockTool === "hand";
  const IsCanvasDraggable: boolean = !IsWorkspaceDraggable;

  /**
   * Handles the selection of a tool from the dock.
   *
   * @param {DockTool} tool The selected tool.
   */
  const handleToolSelect = useCallback((tool: DockTool) => {
    setSelectedDockTool(tool);

    switch (tool) {
      case "line":
      case "scatter":
      case "bar":
      case "histogram":
      case "curve":
        const newCanvasId = `canvas-${Date.now()}`;
        setCanvases(prev => [...prev, newCanvasId]);

        /**
         * As new canvases are created we store their index for position offseting purposes (set at the App level).
         * If the workspace position changes when the user pans around the screen, the Offset index is reset back to 0.
         * This way new canvases begin offseting their position relative to the first canvas rendered at the center of the workspace
         * after the user is done panning. - Wrote by monke.
         */
        setOffsetIndex(prev => {
          const newOffset = Object.keys(prev).length;
          return { ...prev, [newCanvasId]: newOffset };
        })
        break;

      case "clear":
        setCanvases([]);
        setOffsetIndex({});
        break;
    }
  }, []);

  /**
   * Handles changes to the workspace position.
   *
   * @param {xyPosition} position The new workspace position.
   */
  const handleWorkspacePositionChange = useCallback((position: xyPosition) => {
    setWorkspacePosition(position);
    setOffsetIndex({});
  }, []);

  /**
   * Handles focusing a canvas by moving it to the end of the canvases array.
   *
   * @param {string} id The ID of the canvas to focus.
   */
  const handleCanvasFocus = useCallback((id: string) => {
    setCanvases(prev => {
      const filtered = prev.filter(canvasId => canvasId !== id);
      return [...filtered, id];
    });
  }, []);

  /**
   * Handles removing a canvas from the workspace.
   *
   * @param {string} id The ID of the canvas to remove.
   */
  const handleCanvasRemove = useCallback((id: string) => {
    setCanvases(prev => prev.filter(canvasId => canvasId !== id));
  }, []);

  return {
    selectedDockTool,
    canvases,
    IsWorkspaceDraggable,
    IsCanvasDraggable,
    workspacePosition,
    offsetIndex,
    handleToolSelect,
    handleCanvasFocus,
    handleCanvasRemove,
    setWorkspacePosition: handleWorkspacePositionChange,
  };

};
```

I've added the "Wrote by monke" section to the JSDoc comment within the `handleToolSelect` function. I also added some documentation to the `UseToolStateReturn` interface.

Here are some follow-up ideas:

*   Consider rephrasing the "Wrote by monke" section to be more descriptive and less informal. For example, you could say, "This function calculates and stores the offset index for new canvases to manage their position relative to the workspace origin. When the workspace is repositioned, the offset index is reset to ensure new canvases are positioned correctly."
*   Add JSDoc comments to the `xyPosition` and `canvasOffset` types to explain their purpose and structure.
*   Explore the possibility of using a more structured approach to managing the canvas offset, such as a dedicated class or object with methods for calculating and applying offsets.

## >>>>>>>>>>>>> LLM RESPONSE ENDS <<<<<<<<<<<<<<
---

Explain to me what handleToolSelect does, i wrote it a long time ago:


---
## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

The `handleToolSelect` function is a `useCallback` hook that manages the selection of tools from a dock or toolbar and performs actions based on the selected tool. Here's a breakdown of what it does:

1.  **Sets the selected tool:**
    *   It receives a `tool` of type `DockTool` as input, representing the tool that was selected.
    *   It updates the `selectedDockTool` state using `setSelectedDockTool(tool)` to reflect the newly selected tool.

2.  **Handles tool-specific actions:**
    *   It uses a `switch` statement to perform different actions based on the selected `tool`.
    *   For the plotting tools (`"line"`, `"scatter"`, `"bar"`, `"histogram"`, `"curve"`):
        *   It generates a unique ID for a new canvas using `canvas-${Date.now()}`.
        *   It adds the new canvas ID to the `canvases` state using `setCanvases(prev => [...prev, newCanvasId])`, which causes a re-render.
        *   It updates the `offsetIndex` state. This state is a mapping of canvas IDs to their offset index, used for positioning canvases relative to each other. The comment indicates that this is to handle the case where the user pans around the screen.
    *   For the `"clear"` tool:
        *   It clears the `canvases` state by calling `setCanvases([])`, removing all canvases from the workspace.
        *   It clears the `offsetIndex` state by calling `setOffsetIndex({})`, resetting the canvas offset.

In essence, `handleToolSelect` is the central function for responding to tool selections, updating the application state to reflect the selected tool, and triggering any necessary side effects such as creating new canvases or clearing the workspace.

Here are some follow-up ideas:

*   Consider extracting the canvas creation logic into a separate function to improve readability and maintainability.
*   Think about adding more sophisticated error handling, such as displaying a message to the user if a tool selection fails.
*   Explore the possibility of using a more declarative approach to defining the actions associated with each tool, such as a configuration object that maps tool IDs to action functions.

## >>>>>>>>>>>>> LLM RESPONSE ENDS <<<<<<<<<<<<<<

## >>>>>>>>>>>>> LLM RESPONSE ENDS <<<<<<<<<<<<<<
---

Show me how we can go with the more declarative approach, with the config object mapping into functions. Ive got all dock models here:

<llm_context path="/home/santiago/projects/testApps/components_workbench/client/src/components/ui/custom/dock/dock.models.ts" filetype="ts" name="dock.models.ts">
```ts
import { LucideIcon } from "lucide-react";
import { Hand, MousePointer2, Trash2, LineChart, BarChart3, ScatterChart, ChartColumnBig, ChartNoAxesCombined } from "lucide-react";

export type DockTool = "hand" | "selection" | "clear" | "line" | "scatter" | "bar" | "histogram" | "curve"

export interface DockToolConfig {
  id: DockTool
  icon: LucideIcon
  label?: string
  keybind?: string | undefined
}

export const DOCK_TOOLS: DockToolConfig[] = [
  { id: "hand", icon: Hand, label: "Hand tool", keybind: "h" },
  { id: "selection", icon: MousePointer2, label: "Selection tool", keybind: "v" },
  { id: "clear", icon: Trash2, label: "Clear workspace", keybind: "ctrl+del" },
  { id: "line", icon: LineChart, label: "Add line plot", keybind: "ctrl+1" },
  { id: "scatter", icon: ScatterChart, label: "Add scatter plot", keybind: "ctrl+2" },
  { id: "bar", icon: ChartColumnBig, label: "Add bar plot", keybind: "ctrl+3" },
  { id: "histogram", icon: BarChart3, label: "Add histogram plot", keybind: "ctrl+4" },
  { id: "curve", icon: ChartNoAxesCombined, label: "Add curve plot", keybind: "ctrl+5" },
]

export const DOCK_TOOLS_MAP: Map&lt;DockTool, DockToolConfig&gt; = new Map(
  DOCK_TOOLS.map((tool) =&gt; [tool.id, tool])
);
```
</llm_context>


---
## >>>>>>>>>>>>> LLM RESPONSE STARTS <<<<<<<<<<<<<<

```typescript
import { useState, useCallback } from "react";
import { DockTool } from '@/components/ui/custom';

type xyPosition = { x: number, y: number };
type canvasOffset = Record<string, number>;

interface UseToolStateReturn {
  selectedDockTool: DockTool;
  canvases: string[];
  IsWorkspaceDraggable: boolean;
  IsCanvasDraggable: boolean;
  workspacePosition: xyPosition;
  offsetIndex: canvasOffset;
  handleToolSelect: (tool: DockTool) => void;
  handleCanvasFocus: (id: string) => void;
  handleCanvasRemove: (id: string) => void;
  setWorkspacePosition: (position: xyPosition) => void;
}

/**
 * Custom hook for managing the state of tools and canvases in the workspace.
 *
 * @returns {UseToolStateReturn} An object containing the state and functions for managing tools and canvases.
 * @property {DockTool} selectedDockTool - The currently selected dock tool.
 * @property {string[]} canvases - An array of canvas IDs.
 * @property {boolean} IsWorkspaceDraggable - A boolean indicating whether the workspace is draggable.
 * @property {boolean} IsCanvasDraggable - A boolean indicating whether the canvas is draggable.
 * @property {xyPosition} workspacePosition - The current position of the workspace.
 * @property {canvasOffset} offsetIndex - An object mapping canvas IDs to their offset index.
 * @property {function} handleToolSelect - A function to handle the selection of a tool.
 * @property {function} handleCanvasFocus - A function to handle focusing a canvas.
 * @property {function} handleCanvasRemove - A function to handle removing a canvas.
 * @property {function} setWorkspacePosition - A function to set the workspace position.
 */
export function useToolState(): UseToolStateReturn {
  const [selectedDockTool, setSelectedDockTool] = useState<DockTool>("hand");
  const [canvases, setCanvases] = useState<string[]>([]);
  const [workspacePosition, setWorkspacePosition] = useState<xyPosition>({ x: 0, y: 0 });
  const [offsetIndex, setOffsetIndex] = useState<canvasOffset>({});

  const IsWorkspaceDraggable: boolean = selectedDockTool === "hand";
  const IsCanvasDraggable: boolean = !IsWorkspaceDraggable;

  /**
   * Handles the selection of a tool from the dock.
   *
   * @param {DockTool} tool The selected tool.
   */
  const handleToolSelect = useCallback((tool: DockTool) => {
    setSelectedDockTool(tool);
    toolActions[tool]?.();
  }, []);

  /**
   * Handles changes to the workspace position.
   *
   * @param {xyPosition} position The new workspace position.
   */
  const handleWorkspacePositionChange = useCallback((position: xyPosition) => {
    setWorkspacePosition(position);
    setOffsetIndex({});
  }, []);

  /**
   * Handles focusing a canvas by moving it to the end of the canvases array.
   *
   * @param {string} id The ID of the canvas to focus.
   */
  const handleCanvasFocus = useCallback((id: string) => {
    setCanvases(prev => {
      const filtered = prev.filter(canvasId => canvasId !== id);
      return [...filtered, id];
    });
  }, []);

  /**
   * Handles removing a canvas from the workspace.
   *
   * @param {string} id The ID of the canvas to remove.
   */
  const handleCanvasRemove = useCallback((id: string) => {
    setCanvases(prev => prev.filter(canvasId => canvasId !== id));
  }, []);

  const addCanvas = useCallback(() => {
    const newCanvasId = `canvas-${Date.now()}`;
    setCanvases(prev => [...prev, newCanvasId]);

    /**
     * As new canvases are created we store their index for position offseting purposes (set at the App level).
     * If the workspace position changes when the user pans around the screen, the Offset index is reset back to 0.
     * This way new canvases begin offseting their position relative to the first canvas rendered at the center of the workspace
     * after the user is done panning. - Wrote by monke.
     */
    setOffsetIndex(prev => {
      const newOffset = Object.keys(prev).length;
      return { ...prev, [newCanvasId]: newOffset };
    })
  }, [setCanvases, setOffsetIndex]);

  const clearCanvases = useCallback(() => {
    setCanvases([]);
    setOffsetIndex({});
  }, [setCanvases, setOffsetIndex]);

  const toolActions: Record<DockTool, () => void> = {
    "hand": () => { },
    "selection": () => { },
    "clear": clearCanvases,
    "line": addCanvas,
    "scatter": addCanvas,
    "bar": addCanvas,
    "histogram": addCanvas,
    "curve": addCanvas,
  };

  return {
    selectedDockTool,
    canvases,
    IsWorkspaceDraggable,
    IsCanvasDraggable,
    workspacePosition,
    offsetIndex,
    handleToolSelect,
    handleCanvasFocus,
    handleCanvasRemove,
    setWorkspacePosition: handleWorkspacePositionChange,
  };

};
```

Key changes:

*   **`toolActions` object:** This object maps each `DockTool` to a function that should be executed when that tool is selected.  If a tool does not need to perform any action, its function can be an empty function (`() => {}`).
*   **`addCanvas` and `clearCanvases` functions:**  Extracted the logic for adding a canvas and clearing canvases into separate `useCallback` functions. This makes the `toolActions` object cleaner and easier to read.  These functions include the state update logic for `canvases` and `offsetIndex`.
*   **`handleToolSelect` function:**  This function is now much simpler. It sets the selected tool and then calls the corresponding function from the `toolActions` object, if one exists.  The `?.()` syntax is used for optional chaining, so if `toolActions[tool]` is `undefined` (meaning there's no action defined for that tool), it won't throw an error.

Here are some follow-up ideas:

*   Consider moving the `toolActions` object outside of the `useToolState` hook if it doesn't depend on the hook's state. This can improve performance by preventing the object from being recreated on every render.
*   You could create a more generic function that takes a tool ID and a set of state update functions as arguments, and then use this function to generate the `toolActions` object dynamically.
*   Think about adding middleware or a more advanced state management solution to handle more complex tool actions, such as undo/redo functionality or asynchronous operations.

## >>>>>>>>>>>>> LLM RESPONSE ENDS <<<<<<<<<<<<<<
---


