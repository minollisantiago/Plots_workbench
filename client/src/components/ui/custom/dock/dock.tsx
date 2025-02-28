import { cn } from "@/lib/utils";
import { TooltipConfig } from "@/config/ui";
import { DockTool, DOCK_TOOLS, DockToolConfig } from "./dock.models";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect } from "react";

interface Props {
  selectedTool: DockTool
  onSelect?: (tool: DockTool) => void
}

export const Dock = ({ selectedTool, onSelect }: Props) => {

  const handleSelect = (tool: DockTool) => {
    onSelect?.(tool)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlKey = event.ctrlKey;

      DOCK_TOOLS.forEach((tool: DockToolConfig) => {
        if (!tool.keybind) return;

        const keybind = tool.keybind.toLowerCase();
        const keyPressed = event.key.toLowerCase();

        if (keybind.includes('+')) {
          const [modifier, targetKey] = keybind.split('+');

          if (modifier === 'ctrl' && isCtrlKey) {
            // Handle ctrl+number cases
            if (targetKey.match(/[1-5]/)) {
              const numberPressed = event.code.replace('Digit', '');
              if (numberPressed === targetKey) {
                event.preventDefault();
                handleSelect(tool.id);
                return;
              }
            }
            // Handle ctrl+del case
            else if (targetKey === 'del' && keyPressed === 'delete') {
              event.preventDefault();
              handleSelect(tool.id);
              return;
            }
          }
        } else if (keyPressed === keybind) {
          // Handle simple keybinds (h, v)
          event.preventDefault();
          handleSelect(tool.id);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center
      gap-2 p-2 rounded-2xl bg-background/90 backdrop-blur-sm border-2 border-white/10 z-50"
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
