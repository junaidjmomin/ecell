"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedNumberProps {
  value: number
  duration?: number // in milliseconds
}

export function AnimatedNumber({ value, duration = 2000 }: AnimatedNumberProps) {
  const [currentValue, setCurrentValue] = useState(0)

  const spanRef = useRef<HTMLSpanElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    const target = spanRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasAnimatedRef.current) {
            startTimeRef.current = performance.now()
            animate()
            hasAnimatedRef.current = true
          }
        } else {
          resetAnimation()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
      cancelAnimation()
    }
  }, [value, duration])

  const animate = (timestamp: DOMHighResTimeStamp = performance.now()) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp
    }

    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(elapsed / duration, 1)
    const newValue = Math.floor(progress * value)

    setCurrentValue(newValue)

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate)
    } else {
      setCurrentValue(value) // Ensure it finishes cleanly
    }
  }

  const resetAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    startTimeRef.current = null
    hasAnimatedRef.current = false
    setCurrentValue(0)
  }

  const cancelAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  return <span ref={spanRef}>{currentValue}</span>
}
