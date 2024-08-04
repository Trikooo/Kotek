"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const MIN_DISTANCE = 10; // Minimum distance between thumbs

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    value: [number, number]
    onValueChange: (value: [number, number]) => void
  }
>(({ className, value, onValueChange, ...props }, ref) => {
  const handleValueChange = (newValue: [number, number]) => {
    if (newValue[1] - newValue[0] >= MIN_DISTANCE) {
      onValueChange(newValue);
    } else {
      if (newValue[0] === value[0]) {
        onValueChange([newValue[0], newValue[0] + MIN_DISTANCE]);
      } else {
        onValueChange([newValue[1] - MIN_DISTANCE, newValue[1]]);
      }
    }
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      value={value}
      onValueChange={handleValueChange}
      min={0}
      max={100}
      step={1}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-indigo-600" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-indigo-600 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-indigo-600 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
