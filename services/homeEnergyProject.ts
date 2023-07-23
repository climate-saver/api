import {HomeEnergyProjectDocument} from '@modelInterfaces';
import {UserHomeEnergyProjectInfo} from '../global/types';

export const HomeEnergyProjectService = {
  isRecommended: function (project: HomeEnergyProjectDocument, userInfo: UserHomeEnergyProjectInfo): boolean {
    // TODO
    return true;
  },

  estimateAnnualSavings: function (project: HomeEnergyProjectDocument, userInfo: UserHomeEnergyProjectInfo): number {
    // TODO
    return 100;
  },

  estimateCost: function (project: HomeEnergyProjectDocument, userInfo: UserHomeEnergyProjectInfo): number {
    // TODO
    return 1000;
  },

  estimateEmissionReduction: function (project: HomeEnergyProjectDocument, userInfo: UserHomeEnergyProjectInfo): number {
    // TODO
    return 10000;
  },
};
