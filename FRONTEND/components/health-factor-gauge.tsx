"use client"

import { useEffect, useState } from "react"

interface HealthFactorGaugeProps {
  value: number
  size?: number
  strokeWidth?: number
  animated?: boolean
  showProtectionEffect?: boolean
}

export function HealthFactorGauge({
  value,
  size = 200,
  strokeWidth = 12,
  animated = true,
  showProtectionEffect = false,
}: HealthFactorGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(animated ? 0 : value)
  const [isProtecting, setIsProtecting] = useState(false)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(value)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [value, animated])

  useEffect(() => {
    if (showProtectionEffect) {
      setIsProtecting(true)
      const timer = setTimeout(() => {
        setIsProtecting(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showProtectionEffect])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const maxValue = 3 // Max health factor for visualization
  const normalizedValue = Math.min(animatedValue / maxValue, 1)
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - normalizedValue * circumference

  // Color based on health factor
  const getColor = (hf: number) => {
    if (hf >= 1.5) return "#22c55e" // green-500
    if (hf >= 1.2) return "#eab308" // yellow-500
    return "#ef4444" // red-500
  }

  const getGlowColor = (hf: number) => {
    if (hf >= 1.5) return "#22c55e40" // green with opacity
    if (hf >= 1.2) return "#eab30840" // yellow with opacity
    return "#ef444440" // red with opacity
  }

  const color = getColor(animatedValue)
  const glowColor = getGlowColor(animatedValue)

  return (
    <div className="relative flex items-center justify-center">
      {/* Protection effect rings */}
      {isProtecting && (
        <>
          <div
            className="absolute rounded-full border-4 border-green-400/30 animate-ping"
            style={{
              width: size * 1.3,
              height: size * 1.3,
              animationDuration: "1s",
            }}
          />
          <div
            className="absolute rounded-full border-2 border-green-400/20 animate-ping"
            style={{
              width: size * 1.6,
              height: size * 1.6,
              animationDuration: "1.5s",
              animationDelay: "0.3s",
            }}
          />
        </>
      )}

      <svg
        width={size}
        height={size}
        className={`transform -rotate-90 transition-all duration-500 ${isProtecting ? "drop-shadow-lg" : ""}`}
        style={{
          filter: `drop-shadow(0 0 8px ${isProtecting ? "#22c55e80" : glowColor})`,
        }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isProtecting ? "#22c55e" : color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${isProtecting ? "animate-pulse" : ""}`}
          style={{
            filter: `drop-shadow(0 0 4px ${isProtecting ? "#22c55e" : color})`,
          }}
        />

        {/* Critical threshold marker at 1.0 */}
        <circle
          cx={size / 2 + radius * Math.cos((1 / maxValue) * 2 * Math.PI - Math.PI / 2)}
          cy={size / 2 + radius * Math.sin((1 / maxValue) * 2 * Math.PI - Math.PI / 2)}
          r={3}
          fill="#ef4444"
          className="animate-pulse"
        />

        {/* Protection particles */}
        {isProtecting && (
          <>
            <circle
              cx={size / 2 + radius * 0.7 * Math.cos(0)}
              cy={size / 2 + radius * 0.7 * Math.sin(0)}
              r={2}
              fill="#22c55e"
              className="animate-bounce"
            />
            <circle
              cx={size / 2 + radius * 0.7 * Math.cos(Math.PI / 2)}
              cy={size / 2 + radius * 0.7 * Math.sin(Math.PI / 2)}
              r={2}
              fill="#22c55e"
              className="animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <circle
              cx={size / 2 + radius * 0.7 * Math.cos(Math.PI)}
              cy={size / 2 + radius * 0.7 * Math.sin(Math.PI)}
              r={2}
              fill="#22c55e"
              className="animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
            <circle
              cx={size / 2 + radius * 0.7 * Math.cos((3 * Math.PI) / 2)}
              cy={size / 2 + radius * 0.7 * Math.sin((3 * Math.PI) / 2)}
              r={2}
              fill="#22c55e"
              className="animate-bounce"
              style={{ animationDelay: "0.6s" }}
            />
          </>
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className={`text-4xl font-bold font-[family-name:var(--font-playfair)] transition-all duration-500 ${
            isProtecting ? "text-green-400 animate-pulse" : ""
          }`}
          style={{ color: isProtecting ? "#22c55e" : color }}
        >
          {animatedValue.toFixed(2)}
        </div>
        <div className="text-sm text-muted-foreground">Health Factor</div>
        {isProtecting && <div className="text-xs text-green-400 font-medium animate-pulse mt-1">PROTECTING</div>}
      </div>
    </div>
  )
}
