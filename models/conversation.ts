import mongoose from 'mongoose';
import {ConversationDocument, ConversationModel} from '@modelInterfaces';
import {plugins} from './plugins';

export interface IMessage {
  message: string;
  sender: 'User' | 'Bot';
  homeInfoKey?: string;
  answerSuggestions?: string[];
  more?: boolean;
}

const MessageSchema = new mongoose.Schema({
  message: String,
  sender: {type: String, enum: ['User', 'Bot']},
  homeInfoKey: String,
  answerSuggestions: [String],
  more: Boolean,
});

const ConversationSchema = new mongoose.Schema({
  messages: [MessageSchema],
});

ConversationSchema.plugin(plugins.standardPlugins);

export const Conversation = mongoose.model<ConversationDocument, ConversationModel>(
  'Conversation',
  ConversationSchema
);
