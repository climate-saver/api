import {ConversationDocument} from '@modelInterfaces';
import {User} from '../models';
import {UserHomeInfoKey} from '../global/types';

const getHomeInfoType = function (key: UserHomeInfoKey): 'string' | 'number' {
  if (['squareFootage', 'monthlyEnergyBill', 'monthlyEnergyUsage', 'ageOfHome'].includes(key)) {
    return 'number';
  } else {
    return 'string';
  }
};

export const UserService = {
  createUser: async function (conversation?: ConversationDocument) {
    return User.create({conversationId: conversation?.id});
  },

  maybeAddUserInfoFromMessage: async function (
    conversationId: string,
    message: string,
    userHomeInfoKey?: UserHomeInfoKey
  ) {
    if (!userHomeInfoKey) {
      return;
    }
    const user = await User.findByConversationId(conversationId);
    if (!user.homeInfo) {
      user.homeInfo = {};
    }
    if (getHomeInfoType(userHomeInfoKey) === 'number') {
      user.homeInfo = {...user.homeInfo, [userHomeInfoKey]: parseInt(message)};
    } else {
      user.homeInfo = {...user.homeInfo, [userHomeInfoKey]: message.trim()};
    }
    await user.save();
  },
};
