"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { getUserPositions } from '@/lib/aave-positions';

// Mock data structure - replace with actual data from your integration
const mockPositions = [
  {
    tokenAddress: '0xA0b86a33E6411E89F89E9C8F5D8B2F8F1234567890',
    symbol: 'USDC',
    name: 'USD Coin',
    balance: '250.00',
    balanceUSD: '250.00',
    collateralEnabled: true,
    aTokenAddress: '0xaTokenUSDC...',
    isApprovedForRebalancing: true,
    liquidityRate: '0.03',
    canBeCollateral: true
  },
  {
    tokenAddress: '0xB0b86a33E6411E89F89E9C8F5D8B2F8F1234567891',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    balance: '125.50',
    balanceUSD: '125.50',
    collateralEnabled: false,
    aTokenAddress: '0xaTokenDAI...',
    isApprovedForRebalancing: false,
    liquidityRate: '0.025',
    canBeCollateral: true
  },
  {
    tokenAddress: '0xC0b86a33E6411E89F89E9C8F5D8B2F8F1234567892',
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    balance: '0.45',
    balanceUSD: '1125.00',
    collateralEnabled: true,
    aTokenAddress: '0xaTokenWETH...',
    isApprovedForRebalancing: true,
    liquidityRate: '0.02',
    canBeCollateral: true
  }
];

const AavePositionsDashboard = () => {
  const [positions, setPositions] = useState(mockPositions);
  const [isLoading, setIsLoading] = useState(false);
  const [approvingTokens, setApprovingTokens] = useState(new Set());
  const [userAddress, setUserAddress] = useState('0x51816a1b29569fbB1a56825C375C254742a9c5e1');
  const [networkKey, setNetworkKey] = useState('optimism');
  const [healthFactor, setHealthFactor] = useState('2.45');
  const [isAtRisk, setIsAtRisk] = useState(false);

  // Simulated data fetching
  useEffect(() => {
    fetchPositions();
  }, [userAddress, networkKey]);

  const fetchPositions = async () => {
    setIsLoading(true);
    try {
      // In your real implementation, replace this with:
    //   const userPositions = await getUserPositions(userAddress, networkKey, REBALANCE_CONTRACT_ADDRESSES[networkKey]); // Use this to call the rebalance contract to be able to check if allowance is set for the collateral tokens.
      const userPositions = await getUserPositions(userAddress, networkKey);
      setPositions(userPositions.supplyPositions);
      setHealthFactor(userPositions.healthFactor);
      setIsAtRisk(userPositions.isAtRisk);

      console.log('Fetched positions:', userPositions);
      
      // Simulate API call
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    //   setPositions(mockPositions);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveForRebalancing = async (position: any) => {
    const tokenKey = position.tokenAddress;
    setApprovingTokens(prev => new Set(prev).add(tokenKey));

    try {
      // In your real implementation, replace this with:
      // const signer = await provider.getSigner();
      // const approval = await approveForRebalancing(position, userAddress, networkKey, signer);
      
      // Simulate approval transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update position approval status
      setPositions(prev => 
        prev.map(pos => 
          pos.tokenAddress === tokenKey 
            ? { ...pos, isApprovedForRebalancing: true }
            : pos
        )
      );

      console.log(`Successfully approved ${position.symbol} for rebalancing`);
      
    } catch (error: any) {
      console.error('Error approving token:', error);
      alert(`Failed to approve ${position.symbol}: ${error.message}`);
    } finally {
      setApprovingTokens(prev => {
        const newSet = new Set(prev);
        newSet.delete(tokenKey);
        return newSet;
      });
    }
  };

  const getHealthFactorColor = (hf: any) => {
    const healthFactor = parseFloat(hf);
    if (healthFactor === Infinity || hf === 'Infinity') return 'text-green-600';
    if (healthFactor >= 2) return 'text-green-600';
    if (healthFactor >= 1.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthFactorIcon = (hf: any) => {
    const healthFactor = parseFloat(hf);
    if (healthFactor === Infinity || hf === 'Infinity') return <CheckCircle className="h-4 w-4" />;
    if (healthFactor >= 2) return <CheckCircle className="h-4 w-4" />;
    if (healthFactor >= 1.5) return <AlertTriangle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Shield className="h-5 w-5" />
            Your Aave Positions
          </CardTitle>
          <p className="text-sm text-blue-600">Loading your positions...</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Factor Summary */}
      <Card className={`border-2 ${isAtRisk ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {getHealthFactorIcon(healthFactor)}
              Position Health Factor
            </span>
            <Badge variant={isAtRisk ? "destructive" : "default"} className="text-sm">
              {healthFactor === 'Infinity' ? '∞' : parseFloat(healthFactor).toFixed(2)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Status</p>
              <p className={`font-semibold ${isAtRisk ? 'text-red-700' : 'text-green-700'}`}>
                {isAtRisk ? 'At Risk' : 'Healthy'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Network</p>
              <p className="font-semibold capitalize">{networkKey}</p>
            </div>
            <div>
              <p className="text-gray-600">Auto-Rebalance</p>
              <p className="font-semibold">
                {positions.some(p => p.isApprovedForRebalancing) ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Positions Table */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Aave Positions
          </CardTitle>
          <p className="text-sm text-gray-600">
            Manage auto-protection for your Aave collateral tokens on {networkKey.charAt(0).toUpperCase() + networkKey.slice(1)}
          </p>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No Aave positions found for this address.</p>
              <p className="text-sm mt-2">Supply assets to Aave to see them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 pb-3 border-b border-gray-200 text-sm font-medium text-gray-700">
                <div>Token</div>
                <div>Balance</div>
                <div>Collateral</div>
                <div>APY</div>
                <div>Action</div>
              </div>

              {/* Table Rows */}
              {positions.map((position, index) => (
                <div 
                  key={position.tokenAddress} 
                  className="grid grid-cols-5 gap-4 py-4 border-b border-gray-100 items-center"
                >
                  {/* Token Info */}
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      position.symbol === 'USDC' ? 'bg-blue-500' :
                      position.symbol === 'DAI' ? 'bg-orange-500' :
                      position.symbol === 'WETH' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}>
                      {position.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{position.symbol}</p>
                      <p className="text-xs text-gray-500">{position.name}</p>
                    </div>
                  </div>

                  {/* Balance */}
                  <div>
                    <p className="font-semibold text-gray-900">{parseFloat(position.balance).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">${parseFloat(position.balanceUSD).toLocaleString()}</p>
                  </div>

                  {/* Collateral Status */}
                  <div>
                    {position.collateralEnabled ? (
                      <Badge variant={isAtRisk ? "destructive" : "default"} className="text-sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <XCircle className="h-3 w-3 mr-1" />
                        Disabled
                      </Badge>
                    )}
                  </div>

                  {/* APY */}
                  <div>
                    <p className="font-semibold text-green-600">
                      {(parseFloat(position.liquidityRate) * 100).toFixed(2)}%
                    </p>
                  </div>

                  {/* Action Button */}
                  <div>
                    {position.isApprovedForRebalancing ? (
                      <Badge variant={isAtRisk ? "destructive" : "default"} className="text-sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Auto-Protect Enabled
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => handleApproveForRebalancing(position)}
                        disabled={approvingTokens.has(position.tokenAddress)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {approvingTokens.has(position.tokenAddress) ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          'Approve for Auto-Protect'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 text-sm">How Auto-Protection Works</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-blue-700 space-y-2">
          <p>• Monitor your health factor 24/7 for liquidation risk</p>
          <p>• Automatically rebalance positions using flashloans when at risk</p>
          <p>• Small fee (0.5%) only charged when rebalancing occurs</p>
          <p>• You maintain full control - revoke approval anytime</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AavePositionsDashboard;