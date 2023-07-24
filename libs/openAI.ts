import {Configuration, OpenAIApi} from 'openai';
import 'dotenv/config';

export const OpenAI = {
  getApi: function () {
    const config = new Configuration({
      organization: process.env.OPENAI_ORG_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
    return new OpenAIApi(config);
  },
};
