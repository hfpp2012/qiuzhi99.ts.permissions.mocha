import "mocha";

import chai from "chai";
import chaiHttp from "chai-http";
import { Application } from "../../app";
import { Express } from "express";
import { before } from "mocha";

chai.use(chaiHttp);

let application: Application;
export let app: Express;

before(async () => {
  application = new Application();
  app = application.app;

  console.log("## Starting test...");
});
