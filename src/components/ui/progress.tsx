"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  parts?: number
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, parts = 1, ...props }, ref) => {
  const segmentWidth = 100 / parts
  const gap = parts > 1 ? 1 : 0 // Gap between segments in percentage, 0 if only one part

  const renderSegments = () => {
    return Array.from({ length: parts }).map((_, index) => {
      const segmentValue = (index + 1) * segmentWidth
      const isActive = (value ?? 0) > index * segmentWidth
      const segmentFillPercentage = parts === 1
        ? (value ?? 0)
        : Math.min(100, Math.max(0, (value ?? 0) - index * segmentWidth) / segmentWidth * 100)

      const isFirst = index === 0
      const isLast = index === parts - 1
      const segmentStyle = {
        width: `calc(${segmentWidth}% - ${gap}%)`,
        marginRight: index < parts - 1 ? `${gap}%` : 0,
      }

      return (
        <div
          key={index}
          className={cn(
            "h-full transition-all relative overflow-hidden bg-indigo-50",
            isFirst ? "rounded-l-full" : "",
            isLast ? "rounded-r-full" : ""
          )}
          style={segmentStyle}
        >
          <div
            className="absolute inset-0 bg-indigo-600 transition-all"
            style={{
              width: `${segmentFillPercentage}%`,
              opacity: isActive ? 1 : 0
            }}
          />
        </div>
      )
    })
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full",
        className
      )}
      value={value}
      {...props}
    >
      <div className="absolute inset-0 flex">
        {renderSegments()}
      </div>
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }