import { LucideIcon } from "lucide-react";
import { Hand, MousePointer2, Trash2, LineChart, BarChart3, ScatterChart, ChartColumnBig, ChartNoAxesCombined } from "lucide-react";

export type DockTool = "hand" | "selection" | "clear" | "line" | "scatter" | "bar" | "histogram" | "curve";

export interface DockToolConfig {
  id: DockTool;
  icon: LucideIcon;
  label?: string;
  keybind?: string | undefined;
};

export const DOCK_TOOLS: DockToolConfig[] = [
  { id: "hand", icon: Hand, label: "Hand tool", keybind: "h" },
  { id: "selection", icon: MousePointer2, label: "Selection tool", keybind: "v" },
  { id: "clear", icon: Trash2, label: "Clear workspace", keybind: "ctrl+del" },
  { id: "line", icon: LineChart, label: "Add line plot", keybind: "ctrl+1" },
  { id: "scatter", icon: ScatterChart, label: "Add scatter plot", keybind: "ctrl+2" },
  { id: "bar", icon: ChartColumnBig, label: "Add bar plot", keybind: "ctrl+3" },
  { id: "histogram", icon: BarChart3, label: "Add histogram plot", keybind: "ctrl+4" },
  { id: "curve", icon: ChartNoAxesCombined, label: "Add curve plot", keybind: "ctrl+5" },
];

export const DOCK_TOOLS_MAP: Map<DockTool, DockToolConfig> = new Map(
  DOCK_TOOLS.map((tool) => [tool.id, tool])
);
