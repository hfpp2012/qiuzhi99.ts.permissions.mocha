import { Request, Response } from "express";
import { IUserDocument } from "../models/User";
import { checkBody } from "../utils/validator";
import Post from "../models/Post";
import {
  throwPostNotFoundError,
  throwCommentNotFoundError,
  throwActionNotAllowedError
} from "../utils/throwError";
import { wrapAsync } from "../helpers/wrap-async";

export const createComment = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.currentUser as IUserDocument;

    const { id } = req.params;
    const { body } = req.body;

    checkBody(body);

    const post = await Post.findById(id);

    if (post) {
      post.comments.unshift({
        username: user.username,
        createdAt: new Date().toISOString(),
        body
      });

      await post.save();

      res.json({
        success: true,
        data: { message: "comment was created successfully", post }
      });
    } else {
      throwPostNotFoundError();
    }
  }
);

export const deleteComment = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { username } = req.currentUser as IUserDocument;

    const { id, commentId } = req.params;

    const post = await Post.findById(id);

    if (post) {
      const commentIndex = post.comments.findIndex(c => c.id === commentId);

      const comment = post.comments[commentIndex];

      if (!comment) {
        throwCommentNotFoundError();
      }

      if (comment.username === username) {
        post.comments.splice(commentIndex, 1);

        await post.save();

        res.json({
          success: true,
          data: { message: "comment was deleted successfully", post }
        });
      } else {
        throwActionNotAllowedError();
      }
    } else {
      throwPostNotFoundError();
    }
  }
);
