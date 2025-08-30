"use client"

import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Shield } from "lucide-react"

interface RiskMeterProps {
  healthFactor: number
  animated?: boolean
}

export function RiskMeter({ healthFactor, animated = true }: RiskMeterProps) {
  // Convert health factor to risk percentage (inverted)
  const getRiskPercentage = (hf: number) => {
    if (hf >= 2.0) return 10 // Very safe
    if (hf >= 1.5) return 25 // Safe
    if (hf >= 1.2) return 60 // At risk
    if (hf >= 1.0) return 90 // High risk
    return 100 // Critical
  }

  const getRiskLevel = (hf: number) => {
    if (hf >= 1.5) return { level: "Safe", color: "text-green-400", icon: Shield, bg: "bg-green-500" }
    if (hf >= 1.2) return { level: "At Risk", color: "text-yellow-400", icon: AlertTriangle, bg: "bg-yellow-500" }
    return { level: "High Risk", color: "text-red-400", icon: AlertTriangle, bg: "bg-red-500" }
  }

  const riskPercentage = getRiskPercentage(healthFactor)
  const risk = getRiskLevel(healthFactor)
  const Icon = risk.icon

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${risk.color}`} />
          <span className="font-medium">Risk Level</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${risk.bg}`} />
          <span className={`font-medium ${risk.color}`}>{risk.level}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Progress
          value={riskPercentage}
          className="h-3"
          style={{
            background: "var(--muted)",
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Safe Zone
          </span>
          <span>Liquidation Risk: {riskPercentage}%</span>
          <span className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Danger Zone
          </span>
        </div>
      </div>

      {/* Threshold indicators */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center p-2 rounded bg-green-500/10 border border-green-500/20">
          <div className="font-medium text-green-400">1.5+</div>
          <div className="text-muted-foreground">Safe</div>
        </div>
        <div className="text-center p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
          <div className="font-medium text-yellow-400">1.2-1.5</div>
          <div className="text-muted-foreground">At Risk</div>
        </div>
        <div className="text-center p-2 rounded bg-red-500/10 border border-red-500/20">
          <div className="font-medium text-red-400">{"<1.2"}</div>
          <div className="text-muted-foreground">Danger</div>
        </div>
      </div>
    </div>
  )
}
