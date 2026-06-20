import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const TooltipTimingContext = React.createContext<{
  delay?: number
  closeDelay?: number
}>({})

type TooltipProps = TooltipPrimitive.Root.Props & {
  delay?: number
  closeDelay?: number
  hoverable?: boolean
}

function Tooltip({
  delay,
  closeDelay,
  hoverable,
  disableHoverablePopup,
  ...props
}: TooltipProps) {
  const resolvedDisableHoverablePopup =
    disableHoverablePopup ??
    (hoverable === false ? true : hoverable === true ? false : undefined)

  return (
    <TooltipTimingContext.Provider value={{ delay, closeDelay }}>
      <TooltipPrimitive.Root
        disableHoverablePopup={resolvedDisableHoverablePopup}
        {...props}
      />
    </TooltipTimingContext.Provider>
  )
}

function TooltipTrigger({
  delay,
  closeDelay,
  ...props
}: TooltipPrimitive.Trigger.Props) {
  const timing = React.useContext(TooltipTimingContext)

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      delay={delay ?? timing.delay}
      closeDelay={closeDelay ?? timing.closeDelay}
      {...props}
    />
  )
}

function TooltipPopup({
  className,
  align = "center",
  sideOffset = 4,
  side = "top",
  children,
  ...props
}: TooltipPrimitive.Popup.Props & {
  align?: TooltipPrimitive.Positioner.Props["align"]
  side?: TooltipPrimitive.Positioner.Props["side"]
  sideOffset?: TooltipPrimitive.Positioner.Props["sideOffset"]
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        data-slot="tooltip-positioner"
        className="z-50"
        sideOffset={sideOffset}
        align={align}
        side={side}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "relative flex w-fit origin-(--transform-origin) rounded-md border bg-popover bg-clip-padding px-2 py-1 text-xs text-balance text-popover-foreground transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_2px_1px_--theme(--color-black/4%)] data-ending-style:scale-98 data-ending-style:opacity-0 data-instant:duration-0 data-starting-style:scale-98 data-starting-style:opacity-0 dark:bg-clip-border dark:before:shadow-[0_-1px_--theme(--color-white/8%)]",
            className
          )}
          {...props}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipPopup,
  TooltipPopup as TooltipContent,
}
