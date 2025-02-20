import { useState } from "react";
import { cn } from "@/lib/utils";
import { TooltipConfig } from "@/config/ui";
import { ListTree, Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type BookmarksControl = string

interface Props {
  onSelect?: (control: BookmarksControl) => void
}

export const BookmarksControls = ({ onSelect }: Props) => {
  const [selected, setSelected] = useState<string>("")

  const handleSelect = (control: BookmarksControl) => {
    setSelected(control)
    onSelect?.(control)
  };

  const controls = [
    { id: "group", icon: ListTree, label: "New group" },
    { id: "search", icon: Search, label: "Search for plot" },
  ]
  return (
    <div
      className="flex flex-row gap-2"
    >

      {controls.map((tool) => {
        const Icon = tool.icon
        return (
          <TooltipProvider key={tool.id} delayDuration={TooltipConfig.delayDuration} skipDelayDuration={TooltipConfig.skipDelayDuration}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "group p-2 rounded-lg transition-colors bg-primary-foreground hover:bg-muted",
                    selected === tool.id
                      ? "bg-muted"
                      : "hover:bg-muted"
                  )}
                  onClick={() => handleSelect(tool.id)}
                >
                  <Icon size={20} className="text-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent sideOffset={TooltipConfig.sideOffsetSmall} className={TooltipConfig.tailwindClasses.content}>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  );
};
