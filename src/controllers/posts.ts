import { Request, Response } from "express";
import Post from "../models/Post";
import { IUserDocument } from "../models/User";
import {
  throwPostNotFoundError,
  throwActionNotAllowedError
} from "../utils/throwError";
import { checkBody } from "../utils/validator";
import { wrapAsync } from "../helpers/wrap-async";

export const getPosts = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { page } = req.query;

    const myCustomLabels = {
      totalDocs: "total_count",
      docs: "posts",
      limit: "limit_value",
      page: "current_page",
      nextPage: "next",
      prevPage: "prev",
      totalPages: "num_pages",
      pagingCounter: "slNo",
      meta: "page"
    };

    const options = {
      page: page,
      limit: 20,
      customLabels: myCustomLabels,
      sort: { createdAt: -1 }
    };

    const posts = await Post.paginate({}, options);

    res.json({
      success: true,
      data: posts
    });
  }
);

export const getPost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (post) {
      res.json({
        success: true,
        data: { post }
      });
    } else {
      throwPostNotFoundError();
    }
  }
);

export const updatePost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);

    const { body } = req.body;

    checkBody(body);

    const user = req.currentUser as IUserDocument;

    if (post) {
      if (post.username === user.username) {
        const resPost = await Post.findByIdAndUpdate(
          id,
          { body },
          { new: true }
        );

        res.json({
          success: true,
          data: { message: "updated successfully", post: resPost }
        });
      } else {
        throwActionNotAllowedError();
      }
    } else {
      throwPostNotFoundError();
    }
  }
);

export const deletePost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);

    const user = req.currentUser as IUserDocument;

    if (post) {
      if (post.username === user.username) {
        await Post.findByIdAndDelete(id);

        res.json({
          success: true,
          data: { message: "deleted successfully" }
        });
      } else {
        throwActionNotAllowedError();
      }
    } else {
      throwPostNotFoundError();
    }
  }
);

export const createPost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.currentUser as IUserDocument;

    const { body } = req.body;

    checkBody(body);

    const newPost = new Post({
      body,
      createdAt: new Date().toISOString(),
      username: user.username,
      user: user.id
    });

    const post = await newPost.save();

    res.json({
      success: true,
      data: { message: "created successfully", post }
    });
  }
);

export const likePost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);

    const user = req.currentUser as IUserDocument;

    if (post) {
      if (post.likes.find(like => like.username === user.username)) {
        post.likes = post.likes.filter(like => like.username !== user.username);
      } else {
        post.likes.push({
          username: user.username,
          createdAt: new Date().toISOString()
        });
      }

      await post.save();

      res.json({
        success: true,
        data: { post }
      });
    } else {
      throwPostNotFoundError();
    }
  }
);