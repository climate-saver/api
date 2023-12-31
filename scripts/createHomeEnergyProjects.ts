import {ScriptBase} from './base';
import {SeedDatabaseService} from '../services/seedDatabase';

const main = async function () {
  await SeedDatabaseService.createHomeEnergyProjects();
};

if (require.main === module) {
  ScriptBase.dbScriptWrapper(() => main());
}
