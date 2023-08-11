export interface UserHomeInfo {
  squareFootage?: number;
  currentHeatingSystem?: string;
  currentCoolingSystem?: string;
  monthlyEnergyBill?: number;
  monthlyEnergyUsage?: number;
  ageOfHome?: number;
}

export type UserHomeInfoKey = keyof UserHomeInfo;

export interface ProjectRecommendation {
  name: string;
  annualEnergySavings: number;
  totalInstallationCost: number;
  annualInstallationCost: number;
  percentageEmissionsReduction: number;
  rebateAmount: number;
}
