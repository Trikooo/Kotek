"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Define the props interface
interface InsightCardProps {
  className?: string
  title: string
  description: string
  value: string
  progressValue: number
  ariaLabel: string
}

// Regular function declaration with dynamic props
export default function InsightCard({
  className = "",
  title,
  description,
  value,
  progressValue,
  ariaLabel
}: InsightCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-4xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {title}
        </div>
      </CardContent>
      <CardFooter>
        <Progress value={progressValue} aria-label={ariaLabel} />
      </CardFooter>
    </Card>
  )
}
