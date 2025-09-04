"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, Circle } from "lucide-react"

// Fixed mock data for Aave positions
const mockAavePositions = [
  {
    id: 1,
    symbol: "USDC",
    name: "USD Coin",
    balance: 250.0,
    usdValue: 250.0,
    isCollateralEnabled: true,
    aTokenAddress: "0xa0b86a33e6b6b6b6b6b6b6b6b6b6b6b6b6b6b6b6",
    logo: "/img/usdc-logo.png",
  },
  {
    id: 2,
    symbol: "DAI",
    name: "Dai Stablecoin",
    balance: 125.5,
    usdValue: 125.5,
    isCollateralEnabled: false,
    aTokenAddress: "0xb0b86a33e6b6b6b6b6b6b6b6b6b6b6b6b6b6b6b6",
    logo: "/img/dai-logo.png",
  },
  {
    id: 3,
    symbol: "WETH",
    name: "Wrapped Ethereum",
    balance: 0.45,
    usdValue: 1125.0,
    isCollateralEnabled: true,
    aTokenAddress: "0xc0b86a33e6b6b6b6b6b6b6b6b6b6b6b6b6b6b6b6",
    logo: "/img/weth-logo.png",
  },
]

interface AavePositionsProps {
  networkName: string
  onApprovalEvent: (message: string) => void
}

export function AavePositions({ networkName, onApprovalEvent }: AavePositionsProps) {
  const [approvedTokens, setApprovedTokens] = useState<Set<string>>(new Set())
  const [approvingTokens, setApprovingTokens] = useState<Set<string>>(new Set())

  const handleApproveToken = async (tokenId: string, symbol: string) => {
    setApprovingTokens((prev) => new Set([...prev, tokenId]))

    // Simulate approval transaction
    setTimeout(() => {
      setApprovedTokens((prev) => new Set([...prev, tokenId]))
      setApprovingTokens((prev) => {
        const newSet = new Set(prev)
        newSet.delete(tokenId)
        return newSet
      })

      // Notify parent component of approval event
      onApprovalEvent(`${symbol} approved for auto-protection on ${networkName}`)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Your Aave Positions
        </CardTitle>
        <CardDescription>Manage auto-protection for your Aave collateral tokens on {networkName}</CardDescription>
      </CardHeader>
      <CardContent>
        {mockAavePositions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No active Aave positions found on {networkName}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Token</th>
                  <th className="text-right py-3 px-2 font-medium">Balance</th>
                  <th className="text-center py-3 px-2 font-medium">Collateral</th>
                  <th className="text-center py-3 px-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockAavePositions.map((position) => (
                  <tr key={position.id} className="border-b last:border-b-0">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={position.logo || "/placeholder.svg"}
                          alt={position.symbol}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{position.symbol}</div>
                          <div className="text-sm text-muted-foreground">{position.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="font-medium">{position.balance.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">${position.usdValue.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {position.isCollateralEnabled ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">Enabled</span>
                          </>
                        ) : (
                          <>
                            <Circle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Disabled</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      {approvedTokens.has(position.id.toString()) ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Approved</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={approvingTokens.has(position.id.toString())}
                          onClick={() => handleApproveToken(position.id.toString(), position.symbol)}
                          className="text-xs"
                        >
                          {approvingTokens.has(position.id.toString()) ? "Approving..." : "Approve for Auto-Protect"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
