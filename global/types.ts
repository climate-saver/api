export interface UserHomeInfo {
  squareFootage?: number;
  currentHeatingSystem?: string;
  currentCoolingSystem?: string;
  monthlyEnergyBill?: number;
  monthlyEnergyUsage?: number;
  ageOfHome?: number;
}

export type UserHomeInfoKey = keyof UserHomeInfo;
