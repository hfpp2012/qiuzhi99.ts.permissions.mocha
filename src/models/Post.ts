import { Schema, model, Document } from "mongoose";
import { IUserDocument } from "./User";

interface IPostDocument extends Document {
  body: string;
  createdAt: string;
  username: string;
  user: IUserDocument["_id"];
}

const postSchema: Schema = new Schema({
  body: String,
  createdAt: String,
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  }
});

const Post = model<IPostDocument>("Post", postSchema);

export default Post;
