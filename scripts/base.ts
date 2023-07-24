import mongoose from 'mongoose';
import config from '../configuration.json';

let dbConnection: mongoose.Connection;

const getDbParameters = function () {
  return {
    dbUri: config.Environment.dbUri,
    dbUser: config.Environment.dbUsername,
    dbPass: config.Environment.dbPassword,
  };
};

export const ScriptBase = {
  connectToMongo: function () {
    return new Promise(function (resolve, reject) {
      try {
        const dbParameters = getDbParameters();
        const dbUri = dbParameters.dbUri;
        const options: any = {
          user: dbParameters.dbUser,
          pass: dbParameters.dbPass,
          socketTimeoutMS: 10000000,
        };
        if (dbUri.includes('connectWithNoPrimary')) {
          options.connectWithNoPrimary = true;
        }
        mongoose.connect(dbUri, options);
      } catch (e) {
        console.error('db connection failure: ', e);
        process.exit(1);
      }
      dbConnection = mongoose.connection;

      dbConnection.on('error', function (error) {
        console.error('connection error:', {error: error});
        reject(error);
      });

      dbConnection.once('open', function () {
        console.log('db connection open');
        resolve(null);
      });
    });
  },

  closeMongoConnection: function () {
    // Close DB connection (otherwise hangs open)
    return dbConnection.close();
  },

  // Takes a function that returns a promise, opens that database,
  // runs it, and ensures the process exits.
  dbScriptWrapper: async function (fn: Function) {
    await ScriptBase.connectToMongo();
    await fn();
    try {
      await ScriptBase.closeMongoConnection();
    } catch (e) {
      console.error(e);
    }
  },
};
