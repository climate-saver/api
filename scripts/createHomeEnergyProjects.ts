import {HomeEnergyProject} from '../models';
import {ScriptBase} from './base';

const HOME_ENERGY_PROJECTS = [
  {
    name: 'Air Source Heat Pump',
  },
  {
    name: 'Ground Source Heat Pump',
  },
  {
    name: 'Mini Split Heat Pump',
  },
  {
    name: 'Heat Pump Water Heater',
  },
  {
    name: 'Solar Panels',
  },
];

const main = async function () {
  for (let energyProject of HOME_ENERGY_PROJECTS) {
    let existing = await HomeEnergyProject.findOne({name: energyProject.name});
    if (!existing) {
      await HomeEnergyProject.create(energyProject);
    }
  }
};

if (require.main === module) {
  ScriptBase.dbScriptWrapper(() => main());
}
