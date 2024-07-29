"use client"

import React, { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Define the interface for the DynamicCard component
interface DynamicCardProps {
  title: ReactNode;
  description?: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function DynamicCard({
  title,
  description,
  content,
  footer,
  className,
}: DynamicCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription className="max-w-lg text-balance leading-relaxed">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
      {footer && (
        <CardFooter>
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}
