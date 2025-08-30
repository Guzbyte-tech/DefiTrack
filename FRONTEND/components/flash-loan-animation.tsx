"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Zap, DollarSign } from "lucide-react"

interface FlashLoanAnimationProps {
  isActive: boolean
  onComplete?: () => void
}

export function FlashLoanAnimation({ isActive, onComplete }: FlashLoanAnimationProps) {
  const [step, setStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isActive) {
      setIsVisible(true)
      setStep(0)

      const steps = [
        () => setStep(1), // Flash loan initiated
        () => setStep(2), // Repaying debt
        () => setStep(3), // Position secured
        () => {
          setStep(4)
          setTimeout(() => {
            setIsVisible(false)
            onComplete?.()
          }, 1000)
        },
      ]

      steps.forEach((stepFn, index) => {
        setTimeout(stepFn, (index + 1) * 1000)
      })
    }
  }, [isActive, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full mx-4 space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-2">DeFi Track Protection</h3>
          <p className="text-sm text-muted-foreground">Automated liquidation protection in progress</p>
        </div>

        {/* Animation Steps */}
        <div className="space-y-4">
          {/* Step 1: Flash Loan */}
          <div
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
              step >= 1 ? "bg-blue-500/10 border border-blue-500/20" : "bg-muted/20"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                step >= 1 ? "bg-blue-500 text-white" : "bg-muted"
              }`}
            >
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Flash Loan Initiated</div>
              <div className="text-xs text-muted-foreground">Borrowing USDC to repay debt</div>
            </div>
            {step >= 1 && (
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight
              className={`w-5 h-5 transition-all duration-500 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}
            />
          </div>

          {/* Step 2: Debt Repayment */}
          <div
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
              step >= 2 ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-muted/20"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                step >= 2 ? "bg-yellow-500 text-white" : "bg-muted"
              }`}
            >
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Repaying Debt</div>
              <div className="text-xs text-muted-foreground">Reducing liquidation risk</div>
            </div>
            {step >= 2 && step < 3 && (
              <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight
              className={`w-5 h-5 transition-all duration-500 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}
            />
          </div>

          {/* Step 3: Position Secured */}
          <div
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
              step >= 3 ? "bg-green-500/10 border border-green-500/20" : "bg-muted/20"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                step >= 3 ? "bg-green-500 text-white animate-pulse" : "bg-muted"
              }`}
            >
              ✓
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Position Secured</div>
              <div className="text-xs text-muted-foreground">Health factor restored</div>
            </div>
            {step >= 3 && <div className="text-green-400 text-sm font-medium animate-pulse">SUCCESS</div>}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {step >= 4 && <div className="text-center text-green-400 font-medium animate-pulse">Protection Complete!</div>}
      </div>
    </div>
  )
}
