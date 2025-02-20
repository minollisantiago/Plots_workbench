import { cn } from "@/lib/utils";
import { useState } from "react";
import { Bookmark } from "lucide-react";
import { TooltipConfig } from "@/config/ui";
import { BookmarksControls } from "@/components/ui";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// We use the hack of setting a state variable to render the tooltip content
// conditionally to avoid a bug where when the sheet is closed, the focus return
// to the trigger, causing the tooltip to re-render. We can use the onOpenChange function
// from the Sheet component or our own method handleOpen to set the state to true and (opened sheet)
// change it to false when the mouse enters the trigger component (sheet closed). The idea came from this issue:
// https://github.com/radix-ui/primitives/issues/617

interface Props {
  onOpen?: () => void
}

export const Bookmarks = ({ onOpen }: Props) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true);
    if (onOpen) {
      onOpen()
    }
  };

  return (
    <div className="fixed right-0 top-4">
      <Sheet>
        <TooltipProvider delayDuration={TooltipConfig.delayDuration} skipDelayDuration={TooltipConfig.skipDelayDuration}>
          <Tooltip>
            <SheetTrigger asChild onMouseEnter={() => setOpen(false)}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "py-2 pl-3 pr-1 rounded-l-full transition-all duration-200 bg-muted hover:pr-3",
                  )}
                  onClick={handleOpen}
                >
                  <Bookmark size={24} className="text-foreground" />
                </button>
              </TooltipTrigger>
            </SheetTrigger>
            {!open &&
              <TooltipContent side="left" sideOffset={TooltipConfig.sideOffset} className={TooltipConfig.tailwindClasses.content}>
                <p>Bookmarked plots</p>
              </TooltipContent>
            }
          </Tooltip>
        </TooltipProvider>
        <SheetContent showClose={false} className="border-l-2">

          <SheetHeader>
            <div className="flex flex-row justify-between gap-2 items-center">
              <SheetTitle>Bookmarks</SheetTitle>
              <BookmarksControls />
            </div>
          </SheetHeader>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center h-full relative text-muted-foreground">
            <Bookmark size={192} className="absolute opacity-5" />
            <p className="text-xl font-medium text-center">Start bookmarking plots to see them here</p>
          </div>

        </SheetContent>
      </Sheet>
    </div>
  )
}


