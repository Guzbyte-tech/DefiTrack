// /lib/aave-positions.ts
import { ethers, getAddress } from 'ethers';
import { NETWORK_CONFIGS } from './aave-integration';
import { ATOKEN_ABI, POOL_ABI, PROTOCOL_DATA_PROVIDER_ABI } from '@/Abis/poolAbi';

// Extended interfaces for position management
export interface TokenPosition {
  tokenAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceUSD: string;
  collateralEnabled: boolean;
  canBeCollateral: boolean;
  aTokenAddress: string;
  variableDebtTokenAddress?: string;
  stableDebtTokenAddress?: string;
  liquidityRate: string;
  variableBorrowRate: string;
  stableBorrowRate: string;
  utilizationRate: string;
  isApprovedForRebalancing: boolean;
}

export interface UserPositions {
  userAddress: string;
  networkKey: string;
  networkName: string;
  supplyPositions: TokenPosition[];
  borrowPositions: TokenPosition[];
  totalSupplyUSD: string;
  totalBorrowUSD: string;
  netWorthUSD: string;
  healthFactor: string;
  isAtRisk: boolean;
  canRebalance: boolean;
  timestamp: string;
}

export interface RebalanceApproval {
  tokenAddress: string;
  aTokenAddress: string;
  approved: boolean;
  allowance: string;
  txHash?: string;
}


// Your rebalance contract address (deploy this contract first)
export const REBALANCE_CONTRACT_ADDRESSES: Record<string, string> = {
  ethereum: process.env.NEXT_PUBLIC_REBALANCE_CONTRACT_ETHEREUM || '',
  optimism: process.env.NEXT_PUBLIC_REBALANCE_CONTRACT_OPTIMISM || '',
  arbitrum: process.env.NEXT_PUBLIC_REBALANCE_CONTRACT_ARBITRUM || '',
  base: process.env.NEXT_PUBLIC_REBALANCE_CONTRACT_BASE || '',
};

// Protocol Data Provider addresses for each network
const PROTOCOL_DATA_PROVIDER_ADDRESSES: Record<string, string> = {
  ethereum: '0x3e9708d80f7B3e43118013075F7e95CE3AB31F31', // Sepolia 
  optimism: '0x501B4c19dd9C2e06E94dA7b6D5Ed4ddA013EC741', // OP Sepolia 0x1236010cecea55998e4d32288d6ab65203d603be
  arbitrum: '0x12373B5085e3b42D42C1D4ABF3B3Cf4Df0E0Fa01', // Arbitrum Sepolia
  base: '0xBc9f5b7E248451CdD7cA54e717a2BFe1F32b566b', // Base Sepolia
};

// Main function to fetch all user positions
export async function getUserPositions(
  userAddress: string, 
  networkKey: string = 'optimism',
  rebalanceContractAddress?: string
): Promise<UserPositions> {
  console.log('🔍 Fetching all user positions...');
  
  try {
    const networkConfig = NETWORK_CONFIGS[networkKey];
    if (!networkConfig) {
      throw new Error(`Network ${networkKey} not supported`);
    }

    // const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl, {
      name: networkConfig.name,
      chainId: networkConfig.chainId
    }, {
      staticNetwork: ethers.Network.from(networkConfig.chainId)
    });
    
    const aavePool = new ethers.Contract(networkConfig.aavePoolAddress, POOL_ABI, provider);
    const protocolDataProvider = new ethers.Contract(
      PROTOCOL_DATA_PROVIDER_ADDRESSES[networkKey], 
      PROTOCOL_DATA_PROVIDER_ABI, 
      provider
    );

    // Get basic account data
    const accountData = await aavePool.getUserAccountData(userAddress);

    console.log('Account Data:', accountData);
    
    // Get list of all reserves
    const reservesList = await aavePool.getReservesList();
    console.log('Reserves List:', reservesList);
    
    const supplyPositions: TokenPosition[] = [];
    const borrowPositions: TokenPosition[] = [];

    // Process each reserve
    for (const reserveAddress of reservesList) {
      try {
        // Get token addresses for this reserve
        const reservePoolAddr = getAddress(reserveAddress).toLowerCase();
        const tokenAddresses = await protocolDataProvider.getReserveTokensAddresses(reservePoolAddr);
        const reserveData = await protocolDataProvider.getReserveData(reserveAddress);
        
        // Get aToken contract to check balance and get token info
        const aTokenContract = new ethers.Contract(tokenAddresses.aTokenAddress, ATOKEN_ABI, provider);
        
        const [balance, symbol, decimals] = await Promise.all([
          aTokenContract.balanceOf(userAddress),
          aTokenContract.symbol(),
          aTokenContract.decimals()
        ]);

        if (balance > 0) {
          // Check if approved for rebalancing
          let isApprovedForRebalancing = false;
        //   if (rebalanceContractAddress) {
        //     const allowance = await aTokenContract.allowance(userAddress, rebalanceContractAddress);
        //     isApprovedForRebalancing = allowance > 0;
        //   }

          const position: TokenPosition = {
            tokenAddress: reserveAddress,
            symbol: symbol.replace('a', ''), // Remove 'a' prefix from aToken symbol
            name: symbol.replace('a', ''), // Simplified name
            decimals,
            balance: ethers.formatUnits(balance, decimals),
            balanceUSD: '0', // Would need price oracle for accurate USD value
            collateralEnabled: true, // Default, would need to check user config
            canBeCollateral: true,
            aTokenAddress: tokenAddresses.aTokenAddress,
            variableDebtTokenAddress: tokenAddresses.variableDebtTokenAddress,
            stableDebtTokenAddress: tokenAddresses.stableDebtTokenAddress,
            liquidityRate: ethers.formatUnits(reserveData.liquidityRate, 27), // Ray format
            variableBorrowRate: ethers.formatUnits(reserveData.variableBorrowRate, 27),
            stableBorrowRate: ethers.formatUnits(reserveData.stableBorrowRate, 27),
            utilizationRate: '0', // Would need calculation
            isApprovedForRebalancing
          };

          console.log("Position:", position);

          supplyPositions.push(position);
        }

        // TODO: Check for borrow positions using debt tokens
        // This would require checking balances of variable and stable debt tokens
        
      } catch (error) {
        console.warn(`Failed to process reserve ${reserveAddress}:`, error);
        continue;
      }
    }

    const healthFactor = formatHealthFactor(accountData.healthFactor);
    const isAtRisk = Number(healthFactor) < 1.5 && healthFactor !== 'Infinity';

    return {
      userAddress,
      networkKey,
      networkName: networkConfig.name,
      supplyPositions,
      borrowPositions, // Empty for now, implement debt token checking
      totalSupplyUSD: ethers.formatEther(accountData.totalCollateralBase),
      totalBorrowUSD: ethers.formatEther(accountData.totalDebtBase),
      netWorthUSD: (
        Number(ethers.formatEther(accountData.totalCollateralBase)) - 
        Number(ethers.formatEther(accountData.totalDebtBase))
      ).toString(),
      healthFactor,
      isAtRisk,
      canRebalance: supplyPositions.some(pos => pos.isApprovedForRebalancing),
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error fetching user positions:', error);
    throw new Error(`Failed to fetch positions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to approve rebalance contract
export async function approveForRebalancing(
  tokenPosition: TokenPosition,
  userAddress: string,
  networkKey: string,
  signer: ethers.Signer
): Promise<RebalanceApproval> {
  console.log('🔐 Approving token for rebalancing...');
  
  try {
    const rebalanceContractAddress = REBALANCE_CONTRACT_ADDRESSES[networkKey];
    if (!rebalanceContractAddress) {
      throw new Error(`Rebalance contract not deployed on ${networkKey}`);
    }

    const aTokenContract = new ethers.Contract(tokenPosition.aTokenAddress, ATOKEN_ABI, signer);
    
    // Approve maximum amount
    const maxAmount = ethers.MaxUint256;
    const tx = await aTokenContract.approve(rebalanceContractAddress, maxAmount);
    
    console.log('📝 Approval transaction sent:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    
    return {
      tokenAddress: tokenPosition.tokenAddress,
      aTokenAddress: tokenPosition.aTokenAddress,
      approved: true,
      allowance: maxAmount.toString(),
      txHash: receipt?.hash
    };

  } catch (error) {
    console.error('❌ Error approving for rebalancing:', error);
    throw new Error(`Failed to approve: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to check approval status
export async function checkApprovalStatus(
  aTokenAddress: string,
  userAddress: string,
  networkKey: string
): Promise<boolean> {
  try {
    const networkConfig = NETWORK_CONFIGS[networkKey];
    const rebalanceContractAddress = REBALANCE_CONTRACT_ADDRESSES[networkKey];
    
    if (!rebalanceContractAddress) return false;

    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    const aTokenContract = new ethers.Contract(aTokenAddress, ATOKEN_ABI, provider);
    
    const allowance = await aTokenContract.allowance(userAddress, rebalanceContractAddress);
    return allowance > 0;
    
  } catch (error) {
    console.error('Error checking approval status:', error);
    return false;
  }
}

function formatHealthFactor(healthFactorBigInt: bigint): string {
  const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
  
  if (healthFactorBigInt >= maxUint256) {
    return 'Infinity';
  }
  
  try {
    return ethers.formatEther(healthFactorBigInt);
  } catch (error) {
    return 'Infinity';
  }
}


