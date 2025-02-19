import { cn } from "@/lib/utils";
import { useState } from "react";
import { Bookmark } from "lucide-react";
import { TooltipConfig } from "@/config/ui";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// We use the hack of setting a state variable to render the tooltip content
// conditionally to avoid a bug where when the sheet is closed, the focus return
// to the trigger, causing the tooltip to re-render. We use the onOpenChange function
// from the Sheet component to set the state to false and change it to true when the mouse
// enters on the trigger component. The idea came from this issue:
// https://github.com/radix-ui/primitives/issues/617

interface Props {
  onToggle?: () => void
}

export const Bookmarks = ({ onToggle }: Props) => {
  const [toggle, setToggle] = useState(false)
  const [open, setOpen] = useState(false)

  const handleToggle = () => {
    setToggle(true);
    if (onToggle) {
      onToggle()
    }
  };

  return (
    <div className="fixed right-0 top-4">
      <Sheet onOpenChange={() => setOpen(false)}>
        <TooltipProvider delayDuration={TooltipConfig.delayDuration} skipDelayDuration={TooltipConfig.skipDelayDuration}>
          <Tooltip>
            <SheetTrigger asChild onMouseEnter={() => setOpen(true)}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "py-2 pl-3 pr-1 rounded-l-full transition-colors bg-muted",
                    toggle
                      ? "bg-zinc-800 hover:bg-zinc-800"
                      : "hover:bg-muted"
                  )}
                  onClick={handleToggle}
                >
                  <Bookmark size={24} className="text-white" />
                </button>
              </TooltipTrigger>
            </SheetTrigger>
            {open &&
              <TooltipContent side="left" sideOffset={TooltipConfig.sideOffset} className={TooltipConfig.tailwindClasses.content}>
                <p>Bookmarked plots</p>
              </TooltipContent>
            }
          </Tooltip>
        </TooltipProvider>
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
    </div>
  )
}


