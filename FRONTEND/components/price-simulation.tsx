"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, AlertTriangle, Shield, RotateCcw } from "lucide-react"
import { FlashLoanAnimation } from "./flash-loan-animation"
import { ProtectionShield } from "./protection-shield"

interface PriceSimulationProps {
  currentHealthFactor: number
  onHealthFactorChange: (newHealthFactor: number) => void
  onSimulationStart: () => void
  onSimulationEnd: () => void
  onProtectionTrigger?: () => void
  isSimulating: boolean
}

export function PriceSimulation({
  currentHealthFactor,
  onHealthFactorChange,
  onSimulationStart,
  onSimulationEnd,
  onProtectionTrigger,
  isSimulating,
}: PriceSimulationProps) {
  const [priceDropPercentage, setPriceDropPercentage] = useState([10])
  const [originalHealthFactor] = useState(1.76) // Store original value
  const [simulationStep, setSimulationStep] = useState<"idle" | "dropping" | "protecting" | "protected">("idle")
  const [showFlashLoanAnimation, setShowFlashLoanAnimation] = useState(false)

  const calculateNewHealthFactor = (dropPercentage: number) => {
    // Simplified calculation: health factor decreases proportionally with price drop
    const impactFactor = dropPercentage / 100
    return Math.max(originalHealthFactor * (1 - impactFactor * 0.8), 0.8)
  }

  const runSimulation = async () => {
    if (isSimulating) return

    onSimulationStart()
    setSimulationStep("dropping")

    // Step 1: Price drops, health factor decreases
    const newHealthFactor = calculateNewHealthFactor(priceDropPercentage[0])
    onHealthFactorChange(newHealthFactor)

    // Wait 2 seconds to show the drop
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Step 2: DeFi Track protection kicks in
    setSimulationStep("protecting")
    setShowFlashLoanAnimation(true)
    onProtectionTrigger?.()

    // Wait for flash loan animation to complete
    await new Promise((resolve) => setTimeout(resolve, 4000))

    // Step 3: Protection successful, health factor recovers
    setSimulationStep("protected")
    const protectedHealthFactor = Math.max(newHealthFactor + 0.25, 1.3)
    onHealthFactorChange(protectedHealthFactor)

    // Wait 2 seconds to show protection success
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSimulationStep("idle")
    onSimulationEnd()
  }

  const resetSimulation = () => {
    onHealthFactorChange(originalHealthFactor)
    setSimulationStep("idle")
    setPriceDropPercentage([10])
    setShowFlashLoanAnimation(false)
  }

  const getSimulationMessage = () => {
    switch (simulationStep) {
      case "dropping":
        return {
          icon: TrendingDown,
          message: `ETH price dropped ${priceDropPercentage[0]}%! Health factor falling...`,
          color: "text-red-400",
          bg: "bg-red-500/10 border-red-500/20",
        }
      case "protecting":
        return {
          icon: Shield,
          message: "DeFi Track detected liquidation risk! Executing flash loan protection...",
          color: "text-yellow-400",
          bg: "bg-yellow-500/10 border-yellow-500/20",
        }
      case "protected":
        return {
          icon: Shield,
          message: "Protection successful! Position secured with automated repayment.",
          color: "text-green-400",
          bg: "bg-green-500/10 border-green-500/20",
        }
      default:
        return null
    }
  }

  const simulationMessage = getSimulationMessage()
  const projectedHealthFactor = calculateNewHealthFactor(priceDropPercentage[0])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Price Simulation
          </CardTitle>
          <CardDescription>Simulate market conditions to see DeFi Track protection in action</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Drop Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">ETH Price Drop</label>
              <Badge variant="outline">{priceDropPercentage[0]}%</Badge>
            </div>
            <Slider
              value={priceDropPercentage}
              onValueChange={setPriceDropPercentage}
              max={50}
              min={5}
              step={5}
              disabled={isSimulating}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5% (Minor)</span>
              <span>25% (Moderate)</span>
              <span>50% (Severe)</span>
            </div>
          </div>

          {/* Impact Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground">Current Health Factor</div>
              <div className="text-lg font-bold text-green-400">{currentHealthFactor.toFixed(2)}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground">After {priceDropPercentage[0]}% Drop</div>
              <div className={`text-lg font-bold ${projectedHealthFactor >= 1.2 ? "text-yellow-400" : "text-red-400"}`}>
                {projectedHealthFactor.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Protection Shield Visualization */}
          <div className="flex justify-center py-4">
            <ProtectionShield isActive={simulationStep === "protecting" || simulationStep === "protected"} />
          </div>

          {/* Risk Assessment */}
          <div className="p-4 rounded-lg bg-card border">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="font-medium">Risk Assessment</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {projectedHealthFactor < 1.0 ? (
                <span className="text-red-400">
                  ⚠️ Liquidation risk! DeFi Track will automatically protect your position.
                </span>
              ) : projectedHealthFactor < 1.2 ? (
                <span className="text-yellow-400">
                  ⚠️ High risk zone. DeFi Track monitoring will trigger protection if needed.
                </span>
              ) : (
                <span className="text-green-400">✅ Position remains safe after this price drop.</span>
              )}
            </div>
          </div>

          {/* Simulation Message */}
          {simulationMessage && (
            <div className={`p-4 rounded-lg border ${simulationMessage.bg}`}>
              <div className={`flex items-center gap-2 ${simulationMessage.color}`}>
                <simulationMessage.icon className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">{simulationMessage.message}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={runSimulation} disabled={isSimulating} className="flex-1">
              {isSimulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Simulating...
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetSimulation} disabled={isSimulating}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Simulation Steps Indicator */}
          {isSimulating && (
            <div className="flex items-center justify-between text-xs">
              <div
                className={`flex items-center gap-1 ${simulationStep === "dropping" ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${simulationStep === "dropping" ? "bg-primary animate-pulse" : "bg-muted"}`}
                />
                Price Drop
              </div>
              <div
                className={`flex items-center gap-1 ${simulationStep === "protecting" ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${simulationStep === "protecting" ? "bg-primary animate-pulse" : "bg-muted"}`}
                />
                Protection
              </div>
              <div
                className={`flex items-center gap-1 ${simulationStep === "protected" ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${simulationStep === "protected" ? "bg-primary animate-pulse" : "bg-muted"}`}
                />
                Secured
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flash Loan Animation Modal */}
      <FlashLoanAnimation isActive={showFlashLoanAnimation} onComplete={() => setShowFlashLoanAnimation(false)} />
    </>
  )
}
