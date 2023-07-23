import mongoose from 'mongoose';
import {HomeEnergyProjectDocument, HomeEnergyProjectModel} from '@modelInterfaces';

const HomeEnergyProjectSchema = new mongoose.Schema({
  name: String,
});

export const HomeEnergyProject = mongoose.model<HomeEnergyProjectDocument, HomeEnergyProjectModel>(
  'HomeEnergyProject',
  HomeEnergyProjectSchema
);
