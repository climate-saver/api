import {HomeEnergyProject, User} from '../models';
import {HomeEnergyProjectService} from '../services/homeEnergyProject';
import {ScriptBase} from './base';
import {Conversation} from '../models/conversation';
import {ConversationService} from '../services/conversation';

const main = async function () {
  const conversation = await Conversation.create({});
  await User.create({
    conversationId: conversation.id,
    homeInfo: {
      ageOfHome: 100,
      squareFootage: 2000,
      monthlyEnergyBill: 200,
      monthlyEnergyUsage: 7500000,
      currentCoolingSystem: 'Central Air Conditioner',
      currentHeatingSystem: 'Furnace',
    },
  });
  const messages = await ConversationService.getProjectRecommendationMessages(conversation.id);
  console.log(messages);
  await Conversation.deleteMany({});
  await User.deleteMany({});
  // const recommended = await HomeEnergyProjectService.isRecommended(groundSourceHeatPump, userInfo);
  // console.log('recommended');
  // console.log(recommended);
  // const savings = await HomeEnergyProjectService.estimateMonthlySavings(
  //   groundSourceHeatPump,
  //   userInfo
  // );
  // console.log('savings');
  // console.log(savings);
  // const installationCost = await HomeEnergyProjectService.estimateCost(
  //   groundSourceHeatPump,
  //   userInfo
  // );
  // console.log('cost');
  // console.log(installationCost);
  // const percentageReduction = await HomeEnergyProjectService.estimateEmissionReduction(
  //   groundSourceHeatPump,
  //   userInfo
  // );
  // console.log('emissions');
  // console.log(percentageReduction);
};

if (require.main === module) {
  ScriptBase.dbScriptWrapper(() => main());
}
