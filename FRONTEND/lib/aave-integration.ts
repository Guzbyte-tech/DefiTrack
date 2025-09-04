// /lib/aave-integration.ts
import { ethers } from 'ethers';
import { formatHealthFactor } from './utils';
import { POOL_ABI } from '@/Abis/poolAbi';

// Type definitions
export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  aavePoolAddress: string;
}

export interface UserAccountData {
  network: string;
  networkName: string;
  userAddress: string;
  totalCollateral: string;
  totalDebt: string;
  availableBorrows: string;
  liquidationThreshold: number;
  ltv: number;
  healthFactor: string;
  isAtRisk: boolean;
  timestamp: string;
  collateral?: string; // Optional, for compatibility with mock data
  debt?: string;       // Optional, for compatibility with mock data
  apy?: number;       // Optional, for compatibility with mock data
  debtAsset?: string; // Optional, for compatibility with mock data
  collateralAsset?: string; // Optional, for compatibility with mock data

  // Raw values for calculations
  rawData: {
    totalCollateralBase: bigint;
    totalDebtBase: bigint;
    availableBorrowsBase: bigint;
    currentLiquidationThreshold: bigint;
    ltv: bigint;
    healthFactor: bigint;
  };
}

// Network configurations for AAVE TESTNETS
export const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
  ethereum: {
    name: 'Ethereum Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!,
    aavePoolAddress: '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951', // Aave V3 Pool Sepolia 
  },
  optimism: {
    name: 'Optimism Sepolia Testnet', 
    chainId: 11155420,
    rpcUrl: process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL!,
    aavePoolAddress: '0xb50201558B00496A145fE76f7424749556E326D8', // Aave V3 Pool Optimism Sepolia
  },
  arbitrum: {
    name: 'Arbitrum Sepolia Testnet',
    chainId: 421614, 
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL!,
    aavePoolAddress: '0xBfC91D59fdAA134A4ED45f7B584cAf96D7792Eff', // Aave V3 Pool Arbitrum Sepolia
  },
  
  base: {
    name: 'Base Sepolia Testnet',
    chainId: 84532,
    rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL!,
    aavePoolAddress: '0x8bAB6d1b75f19e9eD9fCe8b9BD338844fF79aE27', // Aave V3 Pool Base Sepolia 
  },
};

// Simple function to get user data from Aave
export async function getUserAccountData(
  userAddress: string, 
  networkKey: string = 'ethereum'
): Promise<UserAccountData> {
  console.log('🔍 Starting to fetch Aave data...');
  console.log('User Address:', userAddress);
  console.log('Network:', networkKey);

  try {
    // Get network configuration
    const networkConfig = NETWORK_CONFIGS[networkKey];
    if (!networkConfig) {
      throw new Error(`Network ${networkKey} not supported`);
    }

    console.log('Network Config:', networkConfig);
    console.log('🌐 Using RPC URL:', networkConfig.rpcUrl);

    // Create provider with timeout and proper config
    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl, {
      name: networkConfig.name,
      chainId: networkConfig.chainId
    }, {
      staticNetwork: ethers.Network.from(networkConfig.chainId)
    });

    console.log('✅ Provider created for chain:', networkConfig.chainId);

    // Test connection with timeout
    console.log('📡 Testing connection...');
    const connectionTest = Promise.race([
      provider.getBlockNumber(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
      )
    ]);

    const blockNumber = await connectionTest as number;
    console.log('📡 Connected to network. Current block:', blockNumber);

    // Create contract instance
    const aavePool = new ethers.Contract(
      networkConfig.aavePoolAddress,
      POOL_ABI,
      provider
    );
    console.log('✅ Contract instance created for address:', networkConfig.aavePoolAddress);

    // Call getUserAccountData with timeout
    console.log('📞 Calling getUserAccountData...');
    const contractCall = Promise.race([
      aavePool.getUserAccountData(userAddress),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Contract call timeout after 15 seconds')), 15000)
      )
    ]);

    const accountData = await contractCall;
    console.log('✅ Raw data received:', accountData);

    // Format the data
    const formattedData: UserAccountData = {
      network: networkKey,
      networkName: networkConfig.name,
      userAddress,
      totalCollateral: ethers.formatEther(accountData.totalCollateralBase),
      totalDebt: ethers.formatEther(accountData.totalDebtBase),
      availableBorrows: ethers.formatEther(accountData.availableBorrowsBase),
      liquidationThreshold: Number(accountData.currentLiquidationThreshold) / 100, // Convert to percentage
      ltv: Number(accountData.ltv) / 100, // Convert to percentage
      healthFactor: formatHealthFactor(accountData.healthFactor),
      isAtRisk: Number(ethers.formatEther(accountData.healthFactor)) < 1.0,
      timestamp: new Date().toISOString(),
      rawData: {
        totalCollateralBase: accountData.totalCollateralBase,
        totalDebtBase: accountData.totalDebtBase,
        availableBorrowsBase: accountData.availableBorrowsBase,
        currentLiquidationThreshold: accountData.currentLiquidationThreshold,
        ltv: accountData.ltv,
        healthFactor: accountData.healthFactor
      }
    };

    console.log('✅ Formatted data:', formattedData);
    return formattedData;

  } catch (error) {
    console.error('❌ Error fetching Aave data:', error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('CONNECTION_REFUSED')) {
        throw new Error(`Cannot connect to ${networkKey} network. Please check your internet connection.`);
      }
      if (error.message.includes('timeout')) {
        throw new Error(`${networkKey} network request timed out. Please try again.`);
      }
      if (error.message.includes('NETWORK_ERROR')) {
        throw new Error(`${networkKey} network is currently unavailable.`);
      }
    }
    
    throw new Error(`Failed to fetch user data from ${networkKey}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to check if user has any positions
export async function hasAavePosition(userAddress: string, networkKey: string = 'ethereum'): Promise<boolean> {
  try {
    const data = await getUserAccountData(userAddress, networkKey);
    return Number(data.totalCollateral) > 0 || Number(data.totalDebt) > 0;
  } catch {
    return false;
  }
}

// Helper function to get health factor only (faster)
export async function getHealthFactor(userAddress: string, networkKey: string = 'ethereum'): Promise<number> {
  try {
    const data = await getUserAccountData(userAddress, networkKey);
    return Number(data.healthFactor);
  } catch {
    return 0;
  }
}