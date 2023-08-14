import {Conversation, IMessage} from '../models/conversation';
import {HomeEnergyProject, User} from '../models';
import {UserHomeInfo} from '../global/types';
import {HomeEnergyProjectService} from './homeEnergyProject';
import {HomeEnergyProjectDocument} from '@modelInterfaces';

const MessagesScript = [
  {
    message:
      `Hey there, I'm Home Energy Bot! I can help you find ` +
      `home energy options that save you money and reduce your carbon footprint. ` +
      `I'll ask you a couple questions about your current home energy situation, ` +
      `and get you recommendations within 5 minutes. Ready to get started?`,
    autoFocus: true,
  },
  {
    message: 'How many total square feet (roughly) is your home?',
    homeInfoKey: 'squareFootage',
    autoFocus: true,
  },
  {
    message: 'What is your current heating system?',
    answerSuggestions: ['Boiler', 'Furnace', 'Electric'],
    homeInfoKey: 'currentHeatingSystem',
  },
  {
    message: 'What is your current cooling system?',
    answerSuggestions: ['Central AC', 'Swamp / Evaporative'],
    homeInfoKey: 'currentCoolingSystem',
  },
  {
    message: 'What is your average monthly energy bill?',
    answerSuggestions: ['50', '100', '200', '300'],
    homeInfoKey: 'monthlyEnergyBill',
  },
  {
    message:
      `What is your average monthly energy usage in million BTUs? If you don't ` +
      `know, you can put 7, which is what the average household uses.`,
    answerSuggestions: ['5', '7', '10', '15'],
    homeInfoKey: 'monthlyEnergyUsage',
  },
  {
    message: 'Lastly, what is the age in years (roughly) of your home?',
    homeInfoKey: 'ageOfHome',
    autoFocus: true,
  },
  {
    message: 'Thanks! Give me a second to find the best options for you...',
    readyForRecommendations: true,
  },
];

export const ConversationService = {
  createConversation: async function () {
    return Conversation.create({});
  },

  getConversation: async function (conversationId: string) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error(`Conversation not found. Conversation id = ${conversationId}`);
    }
    return conversation;
  },

  addUserMessage: async function (conversationId: string, message: string) {
    const conversation = await this.getConversation(conversationId);
    conversation.messages.push({message, sender: 'User'});
    await conversation.save();
  },

  addNextMessage: async function (conversationId: string, message: IMessage) {
    const conversation = await this.getConversation(conversationId);
    conversation.messages.push(message);
    await conversation.save();
  },

  getProjectRecommendationMessage: async function (
    homeEnergyProject: HomeEnergyProjectDocument,
    userHomeInfo: UserHomeInfo
  ): Promise<IMessage> {
    const [savings, cost, percentageReduction] = await Promise.all([
      HomeEnergyProjectService.estimateMonthlySavings(homeEnergyProject, userHomeInfo),
      HomeEnergyProjectService.estimateCost(homeEnergyProject, userHomeInfo),
      HomeEnergyProjectService.estimateEmissionReduction(homeEnergyProject, userHomeInfo),
    ]);
    const message =
      `${homeEnergyProject.name}:\n\n` +
      `  Annual energy savings: $${savings * 12}\n` +
      `- Annual installation cost: $${cost / 11.3}\n` +
      `= Annual Net Savings: $${savings * 12 - cost / 11.3}\n\n\n` +
      `Plus, you'll reduce your carbon footprint by ${percentageReduction}%`;
    return this.getBotMessage(message);
  },

  getBotMessage: function (message: string): IMessage {
    return {message, sender: 'Bot'};
  },

  getProjectRecommendationMessages: async function (conversationId: string) {
    const [user, homeEnergyProjects] = await Promise.all([
      User.findByConversationId(conversationId),
      HomeEnergyProject.find({}),
    ]);
    const messages = [
      this.getBotMessage(
        `Ok! Based on your home info, I recommend exploring the following home energy projects:`
      ),
    ];
    for (let homeEnergyProject of homeEnergyProjects) {
      try {
        if (await HomeEnergyProjectService.isRecommended(homeEnergyProject, user.homeInfo)) {
          messages.push(
            await this.getProjectRecommendationMessage(homeEnergyProject, user.homeInfo)
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (messages.length === 1) {
      return [
        this.getBotMessage('Sorry, I cannot recommend any projects based on your home info.'),
      ];
    }
    messages.push(
      this.getBotMessage(
        `Note that all the numbers above are just estimates. Would you like to request` +
          ` free quotes from our network of local contractors?`
      )
    );
    return messages;
  },

  getNextMessage: async function (conversationId: string): Promise<IMessage | undefined> {
    const conversation = await this.getConversation(conversationId);
    const botMessages = conversation.messages.filter((message) => message.sender === 'Bot');
    if (MessagesScript[botMessages.length]) {
      return {...MessagesScript[botMessages.length], sender: 'Bot'};
    }
  },
};
