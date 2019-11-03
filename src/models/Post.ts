import { Schema, model, Document } from "mongoose";
import { IUserDocument } from "./User";

interface Like {
  username: IPostDocument["username"];
  createdAt: IPostDocument["createdAt"];
}

export interface IPostDocument extends Document {
  body: string;
  createdAt: string;
  username: IUserDocument["username"];
  user: IUserDocument["_id"];
  likes: Like[];
}

export const postSchema: Schema = new Schema({
  body: String,
  createdAt: String,
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  likes: [
    {
      username: String,
      createdAt: String
    }
  ]
});

const Post = model<IPostDocument>("Post", postSchema);

export default Post;
