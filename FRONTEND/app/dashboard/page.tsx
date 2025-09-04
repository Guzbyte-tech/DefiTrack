"use client"

import { useState, useEffect } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Wallet, LogOut, Activity, RefreshCw } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { HealthFactorGauge } from "@/components/health-factor-gauge"
import { RiskMeter } from "@/components/risk-meter"
import { PriceSimulation } from "@/components/price-simulation"
import { NetworkSelector, networks, type Network } from "@/components/network-selector"

// Import your new Aave integration
import { getUserAccountData, type UserAccountData } from "@/lib/aave-integration"

// Mock data for demo purposes (keep for fallback)
import { mockPositionData } from "@/data/mockPosition"
import { mockEvents } from "@/data/mockEvents";
import { mockPositionDataByNetwork } from "@/data/mockPositionData"
import { mockEventsByNetwork } from "@/data/mockEventByNetwork"
import { AavePositions } from "@/components/aave-positions"

type Event =
  | { id: number; type: "protection"; message: string; timestamp: string; saved: number }
  | { id: number; type: "warning"; message: string; timestamp: string; saved?: undefined }
  | { id: number; type: "info"; message: string; timestamp: string; saved?: undefined };

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  
  // States for real Aave data
  const [aaveData, setAaveData] = useState<UserAccountData | null>(null)
  const [isLoadingAave, setIsLoadingAave] = useState(false)
  const [aaveError, setAaveError] = useState<string | null>(null)
  
  // Existing states
  const [isSimulating, setIsSimulating] = useState(false)
  const [events, setEvents] = useState<Event[]>(mockEventsByNetwork.ethereum)
  const [showProtectionEffect, setShowProtectionEffect] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0])
  const [currentHealthFactor, setCurrentHealthFactor] = useState(0)

  // Function to fetch real Aave data
  const fetchAaveData = async () => {
    if (!address) return;

    setIsLoadingAave(true);
    setAaveError(null);

    try {
      console.log('🚀 Fetching Aave data for:', address);
      console.log('🌐 Network:', selectedNetwork.id);

      const data = await getUserAccountData(address, selectedNetwork.id); // Change to selectedNetwork.id for dynamic network
      
      console.log('✅ Aave data received:', data);
      setAaveData(data);
      
      // Update health factor for your existing components
      setCurrentHealthFactor(Number(data.healthFactor));

      // Add success event to log
      const successEvent: Event = {
        id: events.length + 1,
        type: "info",
        message: `Successfully loaded real Aave data from ${data.networkName}`,
        timestamp: "Just now",
      };
      setEvents(prev => [successEvent, ...prev]);

    } catch (error) {
      console.error('❌ Failed to fetch Aave data:', error);
      setAaveError(error instanceof Error ? error.message : 'Unknown error');
      
      // Add error event to log
      const errorEvent: Event = {
        id: events.length + 1,
        type: "warning",
        message: `Failed to load Aave data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: "Just now",
      };
      setEvents(prev => [errorEvent, ...prev]);
    } finally {
      setIsLoadingAave(false);
    }
  };

  // Load Aave data when user connects or network changes
  useEffect(() => {
    if (isConnected && address) {
      fetchAaveData();
    }
  }, [address, isConnected, selectedNetwork]);

  // Handle mock data fallback for network changes
  useEffect(() => {
    if (!aaveData) {
      const networkData = mockPositionDataByNetwork[selectedNetwork.id as keyof typeof mockPositionDataByNetwork]
      const networkEvents = mockEventsByNetwork[selectedNetwork.id as keyof typeof mockEventsByNetwork]

      setCurrentHealthFactor(networkData.healthFactor)
      setEvents(networkEvents)
    }
  }, [selectedNetwork, aaveData])

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      redirect("/")
    }
  }, [isConnected])

  if (!isConnected) {
    return null
  }

  // Use real Aave data if available, otherwise fallback to mock data
  const positionData = aaveData || mockPositionDataByNetwork[selectedNetwork.id as keyof typeof mockPositionDataByNetwork]

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
    const newEvent = {
      id: events.length + 1,
      type: "protection" as const,
      message: "DeFi Track successfully protected position during simulation",
      timestamp: "Just now",
      saved: Math.floor(Math.random() * 500) + 500,
    }
    setEvents([newEvent, ...events])
  }

  const handleProtectionTrigger = () => {
    setShowProtectionEffect(true)
    setTimeout(() => setShowProtectionEffect(false), 3000)
  }

  const handleApprovalEvent = (message: string) => {
    const approvalEvent = {
      id: events.length + 1,
      type: "info" as const,
      message,
      timestamp: "Just now",
    }
    setEvents([approvalEvent, ...events])
  }

  const handleNetworkChange = (network: Network) => {
    setSelectedNetwork(network)
    // Clear previous Aave data when switching networks
    setAaveData(null)
    
    const switchEvent = {
      id: events.length + 1,
      type: "info" as const,
      message: `Switched to ${network.name} network`,
      timestamp: "Just now",
    }
    setEvents([switchEvent, ...events])
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
            <Badge variant="secondary">Multi-Chain</Badge>
            {/* Show data source indicator */}
            {aaveData ? (
              <Badge variant="default" className="bg-green-600">
                Live Data
              </Badge>
            ) : (
              <Badge variant="outline">
                Demo Data
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <NetworkSelector selectedNetwork={selectedNetwork} onNetworkChange={handleNetworkChange} />
            
            {/* Refresh button for Aave data */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAaveData}
              disabled={isLoadingAave}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingAave ? 'animate-spin' : ''}`} />
              {isLoadingAave ? 'Loading...' : 'Refresh'}
            </Button>

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
        {/* Error display */}
        {aaveError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <span className="font-medium">Aave Data Error:</span>
                <span>{aaveError}</span>
              </div>
              <p className="text-sm text-red-600 mt-2">
                Showing demo data instead. Check console for details.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold font-[family-name:var(--font-playfair)]">
            {selectedNetwork.name} Positions {aaveData ? '(Live)' : '(Demo)'}
          </h1>

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

          {/* Real-time data info */}
          {aaveData && (
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date(aaveData.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Risk Analysis
            </CardTitle>
            <CardDescription>
              {aaveData 
                ? `Real-time risk assessment from ${aaveData.networkName}`
                : `Demo risk assessment for ${selectedNetwork.name}`
              }
            </CardDescription>
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
              <div className="text-2xl font-bold">
                ${aaveData 
                  ? Number(aaveData.totalCollateral).toLocaleString(undefined, { maximumFractionDigits: 2 })
                  : positionData.collateral?.toLocaleString() || '0'
                }
              </div>
              <p className="text-sm text-muted-foreground">
                {aaveData ? 'ETH' : positionData.collateralAsset || 'ETH'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${aaveData 
                  ? Number(aaveData.totalDebt).toLocaleString(undefined, { maximumFractionDigits: 2 })
                  : positionData.debt?.toLocaleString() || '0'
                }
              </div>
              <p className="text-sm text-muted-foreground">
                {aaveData ? 'ETH' : positionData.debtAsset || 'USDC'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Liquidation Threshold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {aaveData 
                  ? `${aaveData.liquidationThreshold.toFixed(1)}%`
                  : `${positionData.liquidationThreshold?.toFixed(1) || '0.0'}%`
                }
              </div>
              <p className="text-sm text-muted-foreground">Critical level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">LTV Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {aaveData 
                  ? `${aaveData.ltv.toFixed(1)}%`
                  : `${positionData.apy || '0.0'}%`
                }
              </div>
              <p className="text-sm text-muted-foreground">
                {aaveData ? 'Loan to Value' : 'Borrow APY'}
              </p>
            </CardContent>
          </Card>
        </div>

        <AavePositions networkName={selectedNetwork.name} onApprovalEvent={handleApprovalEvent} />

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
            <CardDescription>Real-time log of DeFi Track interventions on {selectedNetwork.name}</CardDescription>
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

        {/* Debug info (remove in production) */}
        {process.env.NEXT_PUBLIC_TEST === 'development' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Debug: Aave Data Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAave ? (
                <div className="text-blue-700">Loading Aave data...</div>
              ) : aaveError ? (
                <div className="text-red-700">Error: {aaveError}</div>
              ) : aaveData ? (
                <pre className="text-xs text-blue-700 overflow-auto">
                  {JSON.stringify(aaveData, (key, value) => {
                    // Convert BigInt to string for JSON serialization
                    return typeof value === 'bigint' ? value.toString() : value;
                  }, 2)}
                </pre>
              ) : (
                <div className="text-gray-700">No Aave data loaded (using mock data)</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
</div>
  )
}
