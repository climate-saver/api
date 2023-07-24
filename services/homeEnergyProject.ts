import {HomeEnergyProjectDocument} from '@modelInterfaces';
import {UserHomeEnergyProjectInfo} from '../global/types';
import {OpenAI} from '../libs/openAI';

const GPT_CALL_FUNCTIONS = {
  WOULD_RECOMMEND: {
    name: 'wouldRecommend',
    description: 'Whether the project installation is recommended or not',
    parameters: {
      type: 'object',
      properties: {
        isRecommended: {
          type: 'boolean',
          description: 'Whether the project installation is recommended or not',
        }
      }
    }
  },
  ESTIMATE_ANNUAL_SAVINGS: {
    name: 'estimateAnnualSavings',
    description: 'How many dollars the project installation would save annually from energy ' +
      'savings.',
    parameters: {
      type: 'object',
      properties: {
        monthlySavings: {
          type: 'integer',
          description: 'Total monthly savings in dollars from energy savings',
        }
      }
    }
  },
  ESTIMATE_INSTALLATION_COST: {
    name: 'estimateInstallationCost',
    description: 'How many dollars the project installation will cost',
    parameters: {
      type: 'object',
      properties: {
        installationCost: {
          type: 'integer',
          description: 'Total cost in dollars of the project installation',
        }
      }
    }
  },
  ESTIMATE_GREENHOUSE_GAS_REDUCTION: {
    name: 'estimateGreenhouseGasReduction',
    description: 'Estimated percentage reduction in greenhouse gas emissions',
    parameters: {
      type: 'object',
      properties: {
        percentageReduction: {
          type: 'integer',
          description: 'Estimated percentage reduction in greenhouse gas emissions',
        }
      }
    }
  },
}

export const HomeEnergyProjectService = {
  getUserInfoAsConversationalMessage: function (userInfo: UserHomeEnergyProjectInfo): string {
    return (
      `I live in a ${userInfo.ageOfHome} year old home with ${userInfo.squareFootage} ` +
      `square feet, have a $${userInfo.monthlyEnergyBill} a month energy bill, ` +
      `${userInfo.monthlyEnergyUsage} BTU monthly energy usage, a ` +
      `${userInfo.currentCoolingSystem} cooling system, and a ` +
      `${userInfo.currentHeatingSystem} heating system.`
    );
  },

  isRecommended: async function (
    project: HomeEnergyProjectDocument,
    userInfo: UserHomeEnergyProjectInfo
  ): Promise<boolean> {
    const openAi = OpenAI.getApi();
    const prompt =
      `${this.getUserInfoAsConversationalMessage(userInfo)} Would you recommend a ` +
      `${project.name?.toLowerCase()} project installation?`;
    const completion = await openAi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [{role: 'user', content: prompt}],
      function_call: {name: GPT_CALL_FUNCTIONS.WOULD_RECOMMEND.name},
      functions: [
        GPT_CALL_FUNCTIONS.WOULD_RECOMMEND
      ]
    });
    console.log(completion);
    console.log(JSON.stringify(completion.data, null, 2));
    return true;
  },

  estimateAnnualSavings: async function (
    project: HomeEnergyProjectDocument,
    userInfo: UserHomeEnergyProjectInfo
  ): Promise<number> {
    const openAi = OpenAI.getApi();
    const prompt =
      `${this.getUserInfoAsConversationalMessage(userInfo)} how many dollars would I save a month ` +
      `in energy savings from a ${project.name?.toLowerCase()} project installation? Give ` +
      `a rough estimate`;
    const completion = await openAi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [{role: 'user', content: prompt}],
    });
    console.log(JSON.stringify(completion.data, null, 2));
    const functionCall = await openAi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [{role: 'user', content: completion.data.choices[0].message?.content}],
      function_call: {name: GPT_CALL_FUNCTIONS.ESTIMATE_ANNUAL_SAVINGS.name},
      functions: [
        GPT_CALL_FUNCTIONS.ESTIMATE_ANNUAL_SAVINGS
      ]
    });
    console.log(JSON.stringify(functionCall.data, null, 2));
    let functionCallArgs = functionCall.data.choices.at(0)?.message?.function_call?.arguments;
    if (!functionCallArgs) {
      throw new Error('No value found.');
    }
    return parseInt(JSON.parse(functionCallArgs).monthlySavings);
  },

  estimateCost: async function (
    project: HomeEnergyProjectDocument,
    userInfo: UserHomeEnergyProjectInfo
  ): Promise<number> {
    const openAi = OpenAI.getApi();
    const prompt =
      `${this.getUserInfoAsConversationalMessage(userInfo)} how much would ` +
      `a ${project.name?.toLowerCase()} installation cost? Give ` +
      `a rough estimate`;
    const completion = await openAi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [{role: 'user', content: prompt}],
    });
    console.log(JSON.stringify(completion.data, null, 2));
    const functionCall = await openAi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [{role: 'user', content: completion.data.choices[0].message?.content}],
      function_call: {name: GPT_CALL_FUNCTIONS.ESTIMATE_INSTALLATION_COST.name},
      functions: [
        GPT_CALL_FUNCTIONS.ESTIMATE_INSTALLATION_COST
      ]
    });
    console.log(JSON.stringify(functionCall.data, null, 2));
    let functionCallArgs = functionCall.data.choices.at(0)?.message?.function_call?.arguments;
    if (!functionCallArgs) {
      throw new Error('No value found.');
    }
    return parseInt(JSON.parse(functionCallArgs).installationCost);
  },

  estimateEmissionReduction: async function (
    project: HomeEnergyProjectDocument,
    userInfo: UserHomeEnergyProjectInfo
  ): Promise<number> {
    const openAi = OpenAI.getApi();
    const prompt =
      `${this.getUserInfoAsConversationalMessage(userInfo)} how much would ` +
      `a ${project.name?.toLowerCase()} installation reduce in greenhouse gas ` +
      `emissions? Give a rough estimate in the form of a percentage, in a few words`;
    const completion = await openAi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [{role: 'user', content: prompt}],
    });
    console.log(JSON.stringify(completion.data, null, 2));
    const functionCall = await openAi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      messages: [{role: 'user', content: completion.data.choices[0].message?.content}],
      function_call: {name: GPT_CALL_FUNCTIONS.ESTIMATE_GREENHOUSE_GAS_REDUCTION.name},
      functions: [
        GPT_CALL_FUNCTIONS.ESTIMATE_GREENHOUSE_GAS_REDUCTION
      ]
    });
    console.log(JSON.stringify(functionCall.data, null, 2));
    let functionCallArgs = functionCall.data.choices.at(0)?.message?.function_call?.arguments;
    if (!functionCallArgs) {
      throw new Error('No value found.');
    }
    return parseInt(JSON.parse(functionCallArgs).percentageReduction);
  },
};
