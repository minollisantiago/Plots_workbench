
export interface TooltipParams {
  delayDuration: number
  skipDelayDuration: number
  sideOffset: number
  tailwindClasses: {
    content: string,
  }
}

export const TooltipConfig: TooltipParams = {
  delayDuration: 300,
  skipDelayDuration: 0,
  sideOffset: 16,
  tailwindClasses: {
    content: "bg-background text-foreground border",
  }
}
