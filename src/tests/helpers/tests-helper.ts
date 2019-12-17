import "mocha";
import mongoose from "mongoose";

import chai from "chai";
import chaiHttp from "chai-http";
import { Application } from "../../app";
import { Express } from "express";
import { before, after } from "mocha";

chai.use(chaiHttp);

let application: Application;
export let app: Express;

before(async () => {
  application = new Application();
  await application.setupDbAndServer();
  app = application.app;

  console.log("## Starting test...");
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
