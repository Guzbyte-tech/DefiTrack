"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Globe } from "lucide-react"

export interface Network {
  id: string
  name: string
  chainId: number
  color: string
  positions: number
  isTestnet?: boolean
}

// Updated to match your Aave testnet configuration
const networks: Network[] = [
  {
    id: "ethereum",
    name: "Ethereum Sepolia",
    chainId: 11155111,
    color: "bg-blue-500",
    positions: 3,
    isTestnet: true,
  },
  {
    id: "optimism", 
    name: "Optimism Sepolia",
    chainId: 11155420,
    color: "bg-red-500", 
    positions: 1,
    isTestnet: true,
  },
  {
    id: "arbitrum",
    name: "Arbitrum Sepolia", 
    chainId: 421614,
    color: "bg-blue-600",
    positions: 2,
    isTestnet: true,
  },
  {
    id: "base",
    name: "Base Sepolia",
    chainId: 84532,
    color: "bg-green-500",
    positions: 0,
    isTestnet: true,
  },
]

interface NetworkSelectorProps {
  selectedNetwork: Network
  onNetworkChange: (network: Network) => void
}

export function NetworkSelector({ selectedNetwork, onNetworkChange }: NetworkSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Globe className="h-4 w-4" />
          <div className={`w-2 h-2 rounded-full ${selectedNetwork.color}`} />
          <span className="hidden sm:inline">{selectedNetwork.name}</span>
          <span className="sm:hidden">{selectedNetwork.name.split(' ')[0]}</span>
          {selectedNetwork.isTestnet && (
            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
              Testnet
            </Badge>
          )}
          {/* <Badge variant="secondary" className="text-xs">
            {selectedNetwork.positions}
          </Badge> */}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
          Available Testnets
        </div>
        {networks.map((network) => (
          <DropdownMenuItem
            key={network.id}
            onClick={() => onNetworkChange(network)}
            className="flex items-center gap-3 cursor-pointer p-3"
          >
            <div className={`w-3 h-3 rounded-full ${network.color}`} />
            <div className="flex-1">
              <div className="font-medium flex items-center gap-2">
                {network.name}
                {network.isTestnet && (
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                    Testnet
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">Chain ID: {network.chainId}</div>
            </div>
            {/* <Badge variant="secondary" className="text-xs">
              {network.positions} {network.positions === 1 ? 'position' : 'positions'}
            </Badge> */}
          </DropdownMenuItem>
        ))}
        
        {/* Helpful info section */}
        <div className="px-2 py-1.5 mt-1 border-t">
          <div className="text-xs text-muted-foreground">
            💡 Need testnet tokens? Visit faucets for free tokens
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { networks }