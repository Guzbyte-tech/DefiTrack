import { clsx, type ClassValue } from "clsx"
import { ethers } from "ethers";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatHealthFactor(healthFactorBigInt: bigint): any {
  // Aave returns type(uint256).max when user has no debt (infinite health factor)
  const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
  
  if (healthFactorBigInt >= maxUint256) {
    return 'Infinity';
  }
  
  // Health factor is already in 18 decimal format, so we can safely format it
  try {
    return ethers.formatEther(healthFactorBigInt);
  } catch (error) {
    // Fallback for any other overflow cases
    return 'Infinity';
  }
}

export function calculateRiskStatus(healthFactorBigInt: bigint): boolean {
  const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
  
  if (healthFactorBigInt >= maxUint256) {
    return false; // Infinite health factor = no risk
  }
  
  try {
    const healthFactorNum = Number(ethers.formatEther(healthFactorBigInt));
    return healthFactorNum < 1.0;
  } catch {
    return false; // If we can't calculate, assume no risk
  }
}
