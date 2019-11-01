import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";

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
