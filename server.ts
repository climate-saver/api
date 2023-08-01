import express from 'express';
import mongoose from 'mongoose';
import Config from './configuration.json';
import {createApp} from './app';

const dbUri = process.env.MONGO_URI;
const dbUsername = process.env.MONGO_USERNAME;
const dbPassword = process.env.MONGO_PASSWORD;

export const app = createApp();
const port = process.env.PORT || 1338;
const securePort = process.env.HTTPS_PORT || 443;

mongoose.connect(dbUri!, {
  user: dbUsername,
  pass: dbPassword,
});

app.listen(port, () => {
  console.log(`Listening at port ${port}/`);
});
