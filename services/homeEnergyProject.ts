import {HomeEnergyProjectDocument} from '@modelInterfaces';
import {ProjectRecommendation, UserHomeInfo} from '../global/types';
import {OpenAI} from '../libs/openAI';
import {HomeEnergyProject, Rebate} from '../models';

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
        },
      },
    },
  },
  ESTIMATE_ANNUAL_SAVINGS: {
    name: 'estimateAnnualSavings',
    description:
      'How many dollars the project installation would save annually from energy ' + 'savings.',
    parameters: {
      type: 'object',
      properties: {
        monthlySavings: {
          type: 'integer',
          description: 'Total monthly savings in dollars from energy savings',
        },
      },
    },
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
        },
      },
    },
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
        },
      },
    },
  },
};

export const HomeEnergyProjectService = {
  getUserInfoAsConversationalMessage: function (userInfo: UserHomeInfo): string {
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
    userInfo: UserHomeInfo
  ): Promise<boolean> {
    const openAi = OpenAI.getApi();
    const prompt =
      `${this.getUserInfoAsConversationalMessage(userInfo)} Would you recommend a ` +
      `${project.name?.toLowerCase()} project installation? Answer in a few words.`;
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
      function_call: {name: GPT_CALL_FUNCTIONS.WOULD_RECOMMEND.name},
      functions: [GPT_CALL_FUNCTIONS.WOULD_RECOMMEND],
    });
    console.log(JSON.stringify(functionCall.data, null, 2));
    let functionCallArgs = functionCall.data.choices.at(0)?.message?.function_call?.arguments;
    if (!functionCallArgs) {
      throw new Error('No value found.');
    }
    return Boolean(JSON.parse(functionCallArgs).isRecommended);
  },

  estimateMonthlySavings: async function (
    project: HomeEnergyProjectDocument,
    userInfo: UserHomeInfo
  ): Promise<number> {
    const openAi = OpenAI.getApi();
    const prompt =
      `${this.getUserInfoAsConversationalMessage(
        userInfo
      )} how many dollars would I save a month ` +
      `in energy savings from a ${project.name?.toLowerCase()} project installation? Give ` +
      `a rough estimate, in a few words, and use average estimates of necessary variables ` +
      `if you don't know the exact values.`;
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
      functions: [GPT_CALL_FUNCTIONS.ESTIMATE_ANNUAL_SAVINGS],
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
    userInfo: UserHomeInfo
  ): Promise<number> {
    const openAi = OpenAI.getApi();
    const prompt =
      `${this.getUserInfoAsConversationalMessage(userInfo)} how much would ` +
      `a ${project.name?.toLowerCase()} installation cost? Give ` +
      `a rough estimate, in a few words, and use average estimates of necessary variables ` +
      `if you don't know the exact values.`;
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
      functions: [GPT_CALL_FUNCTIONS.ESTIMATE_INSTALLATION_COST],
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
    userInfo: UserHomeInfo
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
      functions: [GPT_CALL_FUNCTIONS.ESTIMATE_GREENHOUSE_GAS_REDUCTION],
    });
    console.log(JSON.stringify(functionCall.data, null, 2));
    let functionCallArgs = functionCall.data.choices.at(0)?.message?.function_call?.arguments;
    if (!functionCallArgs) {
      throw new Error('No value found.');
    }
    return parseInt(JSON.parse(functionCallArgs).percentageReduction);
  },

  getRebateAmount: async function (
    project: HomeEnergyProjectDocument,
    cost: number
  ): Promise<number> {
    const rebate = await Rebate.findOne({homeEnergyProjectId: project.id});
    if (!rebate) {
      return 0;
    }
    if (!rebate.calculation?.percent) {
      return rebate.calculation?.max!;
    }
    if (!rebate.calculation?.max) {
      return Math.round((rebate.calculation?.percent! * cost) / 100);
    }
    return Math.min(
      Math.round((rebate.calculation?.percent! * cost) / 100),
      rebate.calculation?.max!
    );
  },

  getRecommendations: async function (
    userHomeInfo: UserHomeInfo
  ): Promise<ProjectRecommendation[]> {
    const projects: HomeEnergyProjectDocument[] = await HomeEnergyProject.find();
    const recommendations = [];
    for (const project of projects) {
      try {
        if (await this.isRecommended(project, userHomeInfo)) {
          const [savings, cost, percentageReduction] = await Promise.all([
            HomeEnergyProjectService.estimateMonthlySavings(project, userHomeInfo),
            HomeEnergyProjectService.estimateCost(project, userHomeInfo),
            HomeEnergyProjectService.estimateEmissionReduction(project, userHomeInfo),
          ]);
          recommendations.push({
            name: project.name!,
            annualEnergySavings: Math.round(savings * 12),
            totalInstallationCost: Math.round(cost),
            annualInstallationCost: Math.round(cost / 11.3),
            percentageEmissionsReduction: Math.round(percentageReduction),
            rebateAmount: await this.getRebateAmount(project, cost),
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return recommendations;
  },
};
