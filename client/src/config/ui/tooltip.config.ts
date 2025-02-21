
export interface TooltipParams {
  delayDuration: number
  skipDelayDuration: number
  sideOffset: number
  sideOffsetSmall: number
  tailwindClasses: {
    content: string,
  }
}

export const TooltipConfig: TooltipParams = {
  delayDuration: 200,
  skipDelayDuration: 0,
  sideOffset: 16,
  sideOffsetSmall: 8,
  tailwindClasses: {
    content: "py-2 px-3 bg-background border rounded-lg text-foreground font-medium",
  }
}
