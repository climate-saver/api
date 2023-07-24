import {HomeEnergyProject} from '../models';
import {HomeEnergyProjectService} from '../services/homeEnergyProject';
import {ScriptBase} from './base';

const main = async function () {
  const groundSourceHeatPump = await HomeEnergyProject.create({name: 'Air Source Heat Pump'});
  const userInfo = {
    ageOfHome: 100,
    squareFootage: 2000,
    monthlyEnergyBill: 300,
    monthlyEnergyUsage: 7500000,
    currentCoolingSystem: 'Central Air Conditioner',
    currentHeatingSystem: 'Furnace',
  }
  const savings = await HomeEnergyProjectService.estimateAnnualSavings(groundSourceHeatPump, userInfo);
  console.log('savings');
  console.log(savings);
  const installationCost = await HomeEnergyProjectService.estimateCost(groundSourceHeatPump, userInfo);
  console.log('cost');
  console.log(installationCost);
  const percentageReduction = await HomeEnergyProjectService.estimateEmissionReduction(groundSourceHeatPump, userInfo);
  console.log('emissions');
  console.log(percentageReduction);
};

if (require.main === module) {
  ScriptBase.dbScriptWrapper(() => main());
}
