import {HomeEnergyProject, Rebate} from '../models';

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

const REBATES = [
  {
    name: 'Air Source Heat Pump',
    projectName: 'Air Source Heat Pump',
    calculation: {
      percent: 40,
      max: 1500,
    },
  },
  {
    name: 'Ground Source Heat Pump',
    projectName: 'Ground Source Heat Pump',
    calculation: {
      percent: 80,
      max: 3500,
    },
  },
  {
    name: 'Mini Split Heat Pump',
    projectName: 'Mini Split Heat Pump',
    calculation: {
      percent: 40,
      max: 1500,
    },
  },
  {
    name: 'Heat Pump Water Heater',
    projectName: 'Heat Pump Water Heater',
    calculation: {
      percent: 60,
      max: 1000,
    },
  },
  {
    name: 'Solar Panels',
    projectName: 'Solar Panels',
    calculation: {
      percent: 80,
      max: 4000,
    },
  },
];

export const SeedDatabaseService = {
  createHomeEnergyProjects: async function () {
    for (let energyProject of HOME_ENERGY_PROJECTS) {
      let projectDoc = await HomeEnergyProject.findOne({name: energyProject.name});
      if (!projectDoc) {
        await HomeEnergyProject.create(energyProject);
      } else {
        projectDoc.set(energyProject);
        await projectDoc.save();
      }
    }
  },

  createRebates: async function () {
    for (let rebate of REBATES) {
      let rebateDoc = await Rebate.findOne({name: rebate.name});
      if (!rebateDoc) {
        rebateDoc = await Rebate.create(rebate);
      }
      rebateDoc.set(rebate);
      let homeEnergyProject = await HomeEnergyProject.findOne({name: rebate.projectName});
      if (!homeEnergyProject) {
        throw new Error(`No home energy project found for rebate ${rebate.name}`);
      }
      rebateDoc.homeEnergyProjectId = homeEnergyProject!.id;
      await rebateDoc.save();
    }
  },
};
