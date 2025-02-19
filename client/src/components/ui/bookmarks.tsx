import { cn } from "@/lib/utils";
import { useState } from "react";
import { Bookmark } from "lucide-react";
import { TooltipConfig } from "@/config/ui";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  onToggle?: () => void
}

export const Bookmarks = ({ onToggle }: Props) => {
  const [toggle, setToggle] = useState(false)

  const handleToggle = () => {
    setToggle(true);
    if (onToggle) {
      onToggle()
    }
  };

  return (
    <div className="full">
      <TooltipProvider delayDuration={TooltipConfig.delayDuration} skipDelayDuration={TooltipConfig.skipDelayDuration}>
        <Tooltip>
          <Sheet>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    "absolute right-0 top-4 py-2 pl-3 pr-1 rounded-l-full transition-colors bg-muted",
                    toggle
                      ? "bg-zinc-800 hover:bg-zinc-800"
                      : "hover:bg-muted"
                  )}
                  onClick={handleToggle}
                >
                  <Bookmark size={24} className="text-white" />
                </button>
              </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={TooltipConfig.sideOffset} className={TooltipConfig.tailwindClasses.content}>
              <p>Bookmarked plots</p>
            </TooltipContent>
            <SheetContent>
              <SheetHeader>
                <div className="flex flex-row gap-2">
                  <Bookmark size={20} className="text-white" />
                  <SheetTitle>Bookmarked Plots</SheetTitle>
                </div>
              </SheetHeader>
              <div className="flex items-center justify-center text-muted-foreground">
                Start bookmarking plots to see them here
              </div>
            </SheetContent>
          </Sheet>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}


