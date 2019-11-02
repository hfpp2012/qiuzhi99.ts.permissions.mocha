import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";
import { isEmpty } from "validator";
import HttpException from "../exceptions/HttpException";
import { UNPROCESSABLE_ENTITY } from "http-status-codes";

export const getPosts = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = await Post.find();

    res.json({
      success: true,
      data: { posts }
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body } = req.body;

    if (isEmpty(body.trim())) {
      throw new HttpException(UNPROCESSABLE_ENTITY, "Body must be not empty", {
        body: "The body must be not empty"
      });
    }

    const newPost = new Post({
      body,
      createdAt: new Date().toISOString()
    });

    await newPost.save();

    res.json({ success: true, data: { message: "created successfully" } });
  } catch (error) {
    next(error);
  }
};
