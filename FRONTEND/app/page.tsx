"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { metaMask } from "wagmi/connectors"
import Link from "next/link"

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnect = () => {
    connect({ connector: metaMask() })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-[family-name:var(--font-playfair)]">
            DeFi Track
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">Real-Time Liquidation Protection for DeFi</p>
          <p className="text-muted-foreground">
            Protect your Aave positions from liquidation with automated flash loan repayments
          </p>
        </div>

        {/* Connection Card */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Connect your wallet to monitor your DeFi positions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected ? (
              <Button onClick={handleConnect} className="w-full" size="lg">
                Connect Wallet
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Connected:</p>
                  <p className="font-mono text-sm">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href="/dashboard">Open Dashboard</Link>
                  </Button>
                  <Button variant="outline" onClick={() => disconnect()}>
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Real-Time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track your health factor and collateral ratios in real-time
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Auto Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Automated flash loan repayments prevent liquidation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Save Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Avoid costly liquidation penalties up to 12%</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
