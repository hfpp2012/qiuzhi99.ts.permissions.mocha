import express, { Router } from "express";
import * as postController from "../controllers/post";
import * as commentsController from "../controllers/comments";
import checkAuthMiddleware from "../middlewares/check-auth.middleware";

let router: Router = express.Router();

router
  .route("/")
  .get(postController.getPosts)
  .post(checkAuthMiddleware, postController.createPost);

router
  .route("/:id")
  .get(postController.getPost)
  .put(checkAuthMiddleware, postController.updatePost)
  .delete(checkAuthMiddleware, postController.deletePost);

router.post("/:id/like", checkAuthMiddleware, postController.likePost);

router.post(
  "/:id/comments",
  checkAuthMiddleware,
  commentsController.createComment
);

router.delete(
  "/:id/comments/:commentId",
  checkAuthMiddleware,
  commentsController.deleteComment
);

export default router;
