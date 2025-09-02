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
        {process.env.NODE_ENV === 'development' && (
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
                  {JSON.stringify(aaveData, null, 2)}
                </pre>
              ) : (
                <div className="text-gray-700">No Aave data loaded (using mock data)</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
</div>