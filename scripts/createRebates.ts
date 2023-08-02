import {ScriptBase} from './base';
import {SeedDatabaseService} from '../services/seedDatabase';

const main = async function () {
  await SeedDatabaseService.createRebates();
};

if (require.main === module) {
  ScriptBase.dbScriptWrapper(() => main());
}
