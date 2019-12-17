import "mocha";
import mongoose from "mongoose";

import chai from "chai";
import chaiHttp from "chai-http";
import { Application } from "../../app";
import { Express } from "express";
import { before, after } from "mocha";
import config from "../../config/config";

chai.use(chaiHttp);

let application: Application;
export let app: Express;
export let authToken: string;

before(async () => {
  application = new Application();
  await application.setupDbAndServer();
  app = application.app;

  console.log("## Authenticating to get token...");
  const res = await chai
    .request(app)
    .post("/api/users/login")
    .send({ username: config.user.username, password: config.user.password });
  authToken = "Bearer " + res.body.data.token;

  console.log("## Starting test...");
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
