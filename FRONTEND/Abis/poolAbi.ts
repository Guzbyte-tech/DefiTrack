// export const POOL_ABI = [
//   {
//     "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
//     "name": "getUserAccountData",
//     "outputs": [
//       {"internalType": "uint256", "name": "totalCollateralBase", "type": "uint256"},
//       {"internalType": "uint256", "name": "totalDebtBase", "type": "uint256"},
//       {"internalType": "uint256", "name": "availableBorrowsBase", "type": "uint256"},
//       {"internalType": "uint256", "name": "currentLiquidationThreshold", "type": "uint256"},
//       {"internalType": "uint256", "name": "ltv", "type": "uint256"},
//       {"internalType": "uint256", "name": "healthFactor", "type": "uint256"}
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {"internalType": "address", "name": "asset", "type": "address"},
//       {"internalType": "address", "name": "user", "type": "address"}
//     ],
//     "name": "getUserReserveData",
//     "outputs": [
//       {"internalType": "uint256", "name": "currentATokenBalance", "type": "uint256"},
//       {"internalType": "uint256", "name": "currentStableDebt", "type": "uint256"},
//       {"internalType": "uint256", "name": "currentVariableDebt", "type": "uint256"},
//       {"internalType": "uint256", "name": "principalStableDebt", "type": "uint256"},
//       {"internalType": "uint256", "name": "scaledVariableDebt", "type": "uint256"},
//       {"internalType": "uint256", "name": "stableBorrowRate", "type": "uint256"},
//       {"internalType": "uint256", "name": "liquidityRate", "type": "uint256"},
//       {"internalType": "uint40", "name": "stableRateLastUpdated", "type": "uint40"},
//       {"internalType": "bool", "name": "usageAsCollateralEnabled", "type": "bool"}
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   }
// ] as const;

export const POOL_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserAccountData",
    "outputs": [
      {"internalType": "uint256", "name": "totalCollateralBase", "type": "uint256"},
      {"internalType": "uint256", "name": "totalDebtBase", "type": "uint256"},
      {"internalType": "uint256", "name": "availableBorrowsBase", "type": "uint256"},
      {"internalType": "uint256", "name": "currentLiquidationThreshold", "type": "uint256"},
      {"internalType": "uint256", "name": "ltv", "type": "uint256"},
      {"internalType": "uint256", "name": "healthFactor", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserReservesData",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "underlyingAsset", "type": "address"},
          {"internalType": "uint256", "name": "scaledATokenBalance", "type": "uint256"},
          {"internalType": "bool", "name": "usageAsCollateralEnabledOnUser", "type": "bool"},
          {"internalType": "uint256", "name": "stableBorrowRate", "type": "uint256"},
          {"internalType": "uint256", "name": "scaledVariableDebt", "type": "uint256"},
          {"internalType": "uint256", "name": "principalStableDebt", "type": "uint256"},
          {"internalType": "uint256", "name": "stableBorrowLastUpdateTimestamp", "type": "uint256"}
        ],
        "internalType": "struct DataTypes.UserReserveData[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReservesList",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// AToken ABI for approvals
export const ATOKEN_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Protocol Data Provider ABI for reserve data
export const PROTOCOL_DATA_PROVIDER_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "asset", "type": "address"}],
    "name": "getReserveTokensAddresses",
    "outputs": [
      {"internalType": "address", "name": "aTokenAddress", "type": "address"},
      {"internalType": "address", "name": "stableDebtTokenAddress", "type": "address"},
      {"internalType": "address", "name": "variableDebtTokenAddress", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "asset", "type": "address"}],
    "name": "getReserveData",
    "outputs": [
      {"internalType": "uint256", "name": "unbacked", "type": "uint256"},
      {"internalType": "uint256", "name": "accruedToTreasuryScaled", "type": "uint256"},
      {"internalType": "uint256", "name": "totalAToken", "type": "uint256"},
      {"internalType": "uint256", "name": "totalStableDebt", "type": "uint256"},
      {"internalType": "uint256", "name": "totalVariableDebt", "type": "uint256"},
      {"internalType": "uint256", "name": "liquidityRate", "type": "uint256"},
      {"internalType": "uint256", "name": "variableBorrowRate", "type": "uint256"},
      {"internalType": "uint256", "name": "stableBorrowRate", "type": "uint256"},
      {"internalType": "uint256", "name": "averageStableBorrowRate", "type": "uint256"},
      {"internalType": "uint256", "name": "liquidityIndex", "type": "uint256"},
      {"internalType": "uint256", "name": "variableBorrowIndex", "type": "uint256"},
      {"internalType": "uint40", "name": "lastUpdateTimestamp", "type": "uint40"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;