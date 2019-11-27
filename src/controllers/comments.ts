import { Request, Response } from "express";
import { IUserDocument } from "../models/User";
import { checkBody } from "../utils/validator";
import Post from "../models/Post";
import Comment from "../models/Comment";
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
      const newComment = new Comment({
        body,
        post: post._id,
        user: user._id
      });

      const comment = await newComment.save();

      post.comments.unshift(comment._id);

      await post.save();

      // just for fix autopopulate bug
      const resPost = await Post.findById(post.id);

      res.json({
        success: true,
        data: { message: "comment was created successfully", post: resPost }
      });
    } else {
      throwPostNotFoundError();
    }
  }
);

export const deleteComment = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.currentUser as IUserDocument;

    const { id, commentId } = req.params;

    const post = await Post.findById(id);

    if (post) {
      const commentIndex = post.comments.findIndex(
        c => c._id.toString() === commentId.toString()
      );

      const comment = post.comments[commentIndex];

      if (!comment) {
        throwCommentNotFoundError();
      }

      if (comment.user._id.toString() === user._id.toString()) {
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
