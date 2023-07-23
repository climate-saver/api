import mongoose from 'mongoose';
import {RebateDocument, RebateModel} from '@modelInterfaces';

const RebateSchema = new mongoose.Schema({
  name: String,
});

export const Rebate = mongoose.model<RebateDocument, RebateModel>('Rebate', RebateSchema);
