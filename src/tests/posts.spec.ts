import chai, { expect } from "chai";
import { app, authToken } from "./helpers/tests-helper";
import { UNAUTHORIZED, OK, UNPROCESSABLE_ENTITY } from "http-status-codes";

const postToTest = {
  body: "body"
};

let resPost: any;

before(async () => {
  resPost = await chai
    .request(app)
    .post("/api/posts")
    .set("Authorization", authToken)
    .send(postToTest);
});

describe("Read Post", () => {
  describe("GET /api/posts", () => {
    it("显示所有的 posts", async () => {
      const res = await chai.request(app).get("/api/posts");

      expect(res).to.have.status(OK);
      expect(res.body.success).to.equal(true);
      expect(res.body.data.docs).to.have.lengthOf(1);
      expect(res.body.data).to.have.property("page");
    });

    it("分页", async () => {
      const res = await chai.request(app).get("/api/posts?page=2");

      expect(res).to.have.status(OK);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property("docs");
      expect(res.body.data).to.have.property("page");
      expect(res.body.data.page).to.equal("2");
    });
  });

  describe("GET /api/posts/:id", () => {
    it("显示单个 post", async () => {
      const res = await chai
        .request(app)
        .get(`/api/posts/${resPost.body.data.post._id}`);

      expect(res).to.have.status(OK);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property("post");
    });
  });
});

describe("Create Post", () => {
  describe("POST /api/posts", () => {
    context("如果没有登录时", () => {
      it("不能创建 Post", async () => {
        const res = await chai
          .request(app)
          .post("/api/posts")
          .send(postToTest);

        expect(res).to.have.status(UNAUTHORIZED);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.have.property("message");
      });
    });

    context("如果有登录时", () => {
      it("没有填写 body 不能可以创建 Post", async () => {
        const res = await chai
          .request(app)
          .post("/api/posts")
          .set("Authorization", authToken)
          .send({ body: "" });

        expect(res).to.have.status(UNPROCESSABLE_ENTITY);
        expect(res.body.success).to.equal(false);
        expect(res.body.errors).to.have.property("body");
      });

      it("填写了 body 可以创建 Post", async () => {
        const res = await chai
          .request(app)
          .post("/api/posts")
          .set("Authorization", authToken)
          .send(postToTest);

        expect(res).to.have.status(OK);
        expect(res.body.success).to.equal(true);
        expect(res.body.data).to.have.property("message");
        expect(res.body.data).to.have.property("post");
      });
    });
  });
});
