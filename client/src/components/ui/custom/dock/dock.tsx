import { cn } from "@/lib/utils";
import { TooltipConfig } from "@/config/ui";
import { useKeybind } from "@/hooks/use-keybind";
import { DockTool, DOCK_TOOLS, DockToolConfig } from "./dock.models";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type dockAnchor = "bottom" | "top"

interface Props {
  dockPosition?: dockAnchor
  selectedTool: DockTool
  onSelect?: (tool: DockTool) => void
}

export const Dock = ({ dockPosition = "bottom", selectedTool, onSelect }: Props) => {

  const handleSelect = (tool: DockTool) => {
    onSelect?.(tool)
  }

  // custom hook for keybind actions
  useKeybind(
    DOCK_TOOLS.map((tool: DockToolConfig) => ({
      keybind: tool.keybind || '',
      action: () => handleSelect(tool.id),
    }))
  );

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-2xl bg-background/90 backdrop-blur-sm border-2 z-50",
        dockPosition === "bottom" ? "bottom-6" : dockPosition === "top" ? "top-6" : "bottom-6"
      )}
    >

      {DOCK_TOOLS.map((tool) => {
        const Icon = tool.icon
        return (
          <TooltipProvider key={tool.id} delayDuration={TooltipConfig.delayDuration} skipDelayDuration={TooltipConfig.skipDelayDuration}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "group p-2 rounded-lg hover:bg-muted",
                    selectedTool === tool.id
                      ? "bg-muted"
                      : "hover:bg-muted"
                  )}
                  onClick={() => handleSelect(tool.id)}
                >
                  <Icon size={20} className="text-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent sideOffset={TooltipConfig.sideOffset} className={TooltipConfig.tailwindClasses.content}>
                <div className="flex items-center justify-between gap-2">
                  <p>{tool.label}</p>
                  {tool.keybind &&
                    <kbd
                      className="px-2 py-1 pointer-events-none inline-flex select-none
                      items-center gap-1 rounded-sm font-mono font-bold bg-muted text-foreground">
                      {tool.keybind.toUpperCase()}
                    </kbd>
                  }
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  );
};
