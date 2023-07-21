import express from 'express';
import * as mongoose from 'mongoose';
import Config from './configuration.json';

const dbUri = process.env.MONGO_URI || Config.Environment.dbUri;
const dbUsername = process.env.MONGO_USERNAME || Config.Environment.dbUsername;
const dbPassword = process.env.MONGO_PASSWORD || Config.Environment.dbPassword;

const app: express.Application = express();
const port = process.env.PORT || 1338;
const securePort = process.env.HTTPS_PORT || 443;

mongoose.connect(dbUri, {
  user: dbUsername,
  pass: dbPassword,
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
