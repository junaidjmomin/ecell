"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedNumberProps {
  value: number
  duration?: number // in milliseconds
}

export function AnimatedNumber({ value, duration = 2000 }: AnimatedNumberProps) {
  const [currentValue, setCurrentValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          // Start animation when element enters viewport
          startTimeRef.current = performance.now()
          animate()
        } else {
          // Reset or pause animation if it leaves
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }
          setCurrentValue(0) // Reset to 0 when out of view
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [value, duration])

  const animate = (currentTime: DOMHighResTimeStamp = performance.now()) => {
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime
    }

    const elapsed = currentTime - startTimeRef.current
    const progress = Math.min(elapsed / duration, 1) // Ensure progress doesn't exceed 1

    const animatedValue = Math.floor(progress * value)
    setCurrentValue(animatedValue)

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate)
    } else {
      setCurrentValue(value) // Ensure it reaches the exact final value
    }
  }

  return <span ref={ref}>{currentValue}</span>
}
