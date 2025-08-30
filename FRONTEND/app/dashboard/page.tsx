"use client"

import { useState, useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Wallet, LogOut, Activity } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { HealthFactorGauge } from "@/components/health-factor-gauge"
import { RiskMeter } from "@/components/risk-meter"
import { PriceSimulation } from "@/components/price-simulation"

// Mock data for demo purposes
const mockPositionData = {
  collateral: 15000,
  debt: 8500,
  healthFactor: 1.76,
  liquidationThreshold: 1.0,
  collateralAsset: "ETH",
  debtAsset: "USDC",
  apy: 3.2,
}

const mockEvents = [
  {
    id: 1,
    type: "protection",
    message: "DeFi Track protection triggered at block 18,234,567",
    timestamp: "2 minutes ago",
    saved: 1020,
  },
  {
    id: 2,
    type: "warning",
    message: "Health factor dropped below 1.2 threshold",
    timestamp: "5 minutes ago",
  },
  {
    id: 3,
    type: "info",
    message: "Position monitoring started",
    timestamp: "1 hour ago",
  },
]

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [currentHealthFactor, setCurrentHealthFactor] = useState(mockPositionData.healthFactor)
  const [isSimulating, setIsSimulating] = useState(false)
  const [events, setEvents] = useState(mockEvents)
  const [showProtectionEffect, setShowProtectionEffect] = useState(false)

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      redirect("/")
    }
  }, [isConnected])

  if (!isConnected) {
    return null
  }

  const getRiskLevel = (hf: number) => {
    if (hf >= 1.5) return { level: "Safe", color: "bg-green-500" }
    if (hf >= 1.2) return { level: "At Risk", color: "bg-yellow-500" }
    return { level: "Danger", color: "bg-red-500" }
  }

  const handleSimulationStart = () => {
    setIsSimulating(true)
  }

  const handleSimulationEnd = () => {
    setIsSimulating(false)
    // Add new protection event to the log
    const newEvent = {
      id: events.length + 1,
      type: "protection" as const,
      message: "DeFi Track successfully protected position during simulation",
      timestamp: "Just now",
      saved: Math.floor(Math.random() * 500) + 500, // Random savings between 500-1000
    }
    setEvents([newEvent, ...events])
  }

  const handleProtectionTrigger = () => {
    setShowProtectionEffect(true)
    setTimeout(() => setShowProtectionEffect(false), 3000)
  }

  const risk = getRiskLevel(currentHealthFactor)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold font-[family-name:var(--font-playfair)]">
              DeFi Track
            </Link>
            <Badge variant="secondary">Testnet</Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Wallet className="h-4 w-4" />
              <span className="font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => disconnect()}>
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold font-[family-name:var(--font-playfair)]">Position Overview</h1>

          {/* Main Health Factor Gauge */}
          <div className="flex justify-center">
            <HealthFactorGauge
              value={currentHealthFactor}
              size={240}
              animated={true}
              showProtectionEffect={showProtectionEffect}
            />
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge className={risk.color} variant="outline">
              {risk.level}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Risk Analysis
            </CardTitle>
            <CardDescription>Comprehensive risk assessment based on your current health factor</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskMeter healthFactor={currentHealthFactor} />
          </CardContent>
        </Card>

        {/* Position Details Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Collateral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockPositionData.collateral.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">{mockPositionData.collateralAsset}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockPositionData.debt.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">{mockPositionData.debtAsset}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Liquidation Threshold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{mockPositionData.liquidationThreshold.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">Critical level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Borrow APY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPositionData.apy}%</div>
              <p className="text-sm text-muted-foreground">Variable rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Price Simulation */}
        <PriceSimulation
          currentHealthFactor={currentHealthFactor}
          onHealthFactorChange={setCurrentHealthFactor}
          onSimulationStart={handleSimulationStart}
          onSimulationEnd={handleSimulationEnd}
          onProtectionTrigger={handleProtectionTrigger}
          isSimulating={isSimulating}
        />

        {/* Event Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Protection Events
            </CardTitle>
            <CardDescription>Real-time log of DeFi Track interventions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={event.id}>
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        event.type === "protection"
                          ? "bg-green-500"
                          : event.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{event.message}</p>
                      <div className="flex items-center gap-4">
                        <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                        {event.saved && (
                          <Badge variant="secondary" className="text-xs">
                            Saved ${event.saved}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < events.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
