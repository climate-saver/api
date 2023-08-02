import mongoose from 'mongoose';
import {RebateDocument, RebateModel} from '@modelInterfaces';

const CalculationSchema = new mongoose.Schema({
  percent: Number,
  max: Number,
});

const RebateSchema = new mongoose.Schema({
  name: String,
  homeEnergyProjectId: {type: mongoose.Types.ObjectId, ref: 'HomeEnergyProject', index: true},
  calculation: CalculationSchema,
});

export const Rebate = mongoose.model<RebateDocument, RebateModel>('Rebate', RebateSchema);
