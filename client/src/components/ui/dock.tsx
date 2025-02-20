import { cn } from "@/lib/utils";
import { useState } from "react";
import { TooltipConfig } from "@/config/ui";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Hand, Trash2, LineChart, BarChart3, ScatterChart, ChartColumnBig, ChartNoAxesCombined } from "lucide-react";

export type DockTool = string

interface Props {
  onSelect?: (tool: DockTool) => void
}

export const Dock = ({ onSelect }: Props) => {
  const [selected, setSelected] = useState<string>("hand")

  const tools = [
    { id: "hand", icon: Hand, label: "Hand tool" },
    { id: "clear", icon: Trash2, label: "Clear workspace" },
    { id: "line", icon: LineChart, label: "Add line plot" },
    { id: "scatter", icon: ScatterChart, label: "Add scatter plot" },
    { id: "bar", icon: ChartColumnBig, label: "Add bar plot" },
    { id: "histogram", icon: BarChart3, label: "Add histogram plot" },
    { id: "curve", icon: ChartNoAxesCombined, label: "Add curve plot" },
  ]

  const handleSelect = (tool: DockTool) => {
    setSelected(tool)
    onSelect?.(tool)
  }

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center
      gap-2 p-2 rounded-2xl bg-background/90 backdrop-blur-sm border-2 border-white/10 z-50"
    >

      {tools.map((tool) => {
        const Icon = tool.icon
        return (
          <TooltipProvider key={tool.id} delayDuration={TooltipConfig.delayDuration} skipDelayDuration={TooltipConfig.skipDelayDuration}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "group p-2 rounded-lg transition-colors hover:bg-muted",
                    selected === tool.id
                      ? "bg-muted"
                      : "hover:bg-muted"
                  )}
                  onClick={() => handleSelect(tool.id)}
                >
                  <Icon size={20} className="text-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent sideOffset={TooltipConfig.sideOffset} className={TooltipConfig.tailwindClasses.content}>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  );
};
