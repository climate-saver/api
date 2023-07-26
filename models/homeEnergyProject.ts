import mongoose from 'mongoose';
import {HomeEnergyProjectDocument, HomeEnergyProjectModel} from '@modelInterfaces';
import {plugins} from './plugins';

const HomeEnergyProjectSchema = new mongoose.Schema({
  name: String,
});

HomeEnergyProjectSchema.plugin(plugins.standardPlugins);

export const HomeEnergyProject = mongoose.model<HomeEnergyProjectDocument, HomeEnergyProjectModel>(
  'HomeEnergyProject',
  HomeEnergyProjectSchema
);
