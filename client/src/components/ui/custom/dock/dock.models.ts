import { LucideIcon } from "lucide-react";
import { Hand, Trash2, LineChart, BarChart3, ScatterChart, ChartColumnBig, ChartNoAxesCombined } from "lucide-react";

export type DockTool = "hand" | "clear" | "line" | "scatter" | "bar" | "histogram" | "curve"

export interface DockToolConfig {
  id: DockTool
  icon: LucideIcon
  label: string
}

export const DOCK_TOOLS: DockToolConfig[] = [
  { id: "hand", icon: Hand, label: "Hand tool" },
  { id: "clear", icon: Trash2, label: "Clear workspace" },
  { id: "line", icon: LineChart, label: "Add line plot" },
  { id: "scatter", icon: ScatterChart, label: "Add scatter plot" },
  { id: "bar", icon: ChartColumnBig, label: "Add bar plot" },
  { id: "histogram", icon: BarChart3, label: "Add histogram plot" },
  { id: "curve", icon: ChartNoAxesCombined, label: "Add curve plot" },
]
