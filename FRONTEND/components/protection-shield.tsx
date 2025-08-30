"use client"

import { useEffect, useState } from "react"
import { Shield } from "lucide-react"

interface ProtectionShieldProps {
  isActive: boolean
  size?: number
}

export function ProtectionShield({ isActive, size = 120 }: ProtectionShieldProps) {
  const [pulseCount, setPulseCount] = useState(0)

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setPulseCount((prev) => prev + 1)
      }, 800)
      return () => clearInterval(interval)
    }
  }, [isActive])

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse rings */}
      {isActive && (
        <>
          <div
            className="absolute rounded-full border-2 border-green-400/30 animate-ping"
            style={{
              width: size * 1.5,
              height: size * 1.5,
              animationDuration: "2s",
            }}
          />
          <div
            className="absolute rounded-full border-2 border-green-400/20 animate-ping"
            style={{
              width: size * 1.8,
              height: size * 1.8,
              animationDuration: "2.5s",
              animationDelay: "0.5s",
            }}
          />
        </>
      )}

      {/* Main shield container */}
      <div
        className={`relative flex items-center justify-center rounded-full transition-all duration-500 ${
          isActive
            ? "bg-green-500/20 border-2 border-green-400 shadow-lg shadow-green-400/50"
            : "bg-muted/50 border-2 border-muted"
        }`}
        style={{ width: size, height: size }}
      >
        {/* Shield icon */}
        <Shield
          className={`transition-all duration-500 ${
            isActive ? "text-green-400 animate-pulse" : "text-muted-foreground"
          }`}
          size={size * 0.4}
        />

        {/* Energy particles */}
        {isActive && (
          <>
            <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-bounce top-4 left-8" />
            <div
              className="absolute w-1 h-1 bg-green-300 rounded-full animate-bounce top-8 right-6"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="absolute w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce bottom-6 left-6"
              style={{ animationDelay: "0.4s" }}
            />
            <div
              className="absolute w-1 h-1 bg-green-400 rounded-full animate-bounce bottom-4 right-8"
              style={{ animationDelay: "0.6s" }}
            />
          </>
        )}
      </div>

      {/* Protection text */}
      {isActive && (
        <div className="absolute -bottom-8 text-center">
          <div className="text-sm font-medium text-green-400 animate-pulse">PROTECTED</div>
        </div>
      )}
    </div>
  )
}
