import { Db, MongoClient } from "mongodb";
const config = require('./config.js');
export const connectDB = async (): Promise<Db> => {
  // const usr: string  = config.usr;
  // const pwd: string  = config.pwd;
  // const dbName: string = config.dbName;
  // const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster0.xqzvr.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  // const client = new MongoClient(mongouri);


  const usr = "Mateo";
  const pwd = "hG28d7HHpi4MK2C";
  const dbName: string = "GraphQL";
  const mongouri: string = `mongodb+srv://${usr}:${pwd}@ClusterMateo.xarym.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  const client = new MongoClient(mongouri);


  try {
    await client.connect();
    console.info("MongoDB connected");

    return client.db(dbName);
  } catch (e) {
    throw e;
  }
};
