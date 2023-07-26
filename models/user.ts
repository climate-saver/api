import mongoose from 'mongoose';
import {UserDocument, UserModel} from '@modelInterfaces';
import {plugins} from './plugins';

const UserSchema = new mongoose.Schema({
  homeInfo: {
    squareFootage: Number,
    currentHeatingSystem: String,
    currentCoolingSystem: String,
    monthlyEnergyBill: Number,
    monthlyEnergyUsage: Number,
    ageOfHome: Number,
  },
  conversationId: {type: mongoose.Types.ObjectId, ref: 'Conversation'},
});

UserSchema.plugin(plugins.standardPlugins);

UserSchema.statics.findByConversationId = async function (
  conversationId: string
): Promise<UserDocument> {
  const user = await this.findOne({conversationId});
  if (!user) {
    throw new Error(`User not found. Conversation id = ${conversationId}`);
  }
  return user;
};

export const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);
