import { Schema, model, Document, PaginateModel } from "mongoose";
import { IUserDocument } from "./User";
import mongoosePaginate from "mongoose-paginate-v2";

interface Like {
  username: IPostDocument["username"];
  createdAt: IPostDocument["createdAt"];
}

interface IPostModel extends PaginateModel<IPostDocument> {}

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
    ref: "User",
    required: true
  },
  likes: [
    {
      username: String,
      createdAt: String
    }
  ]
});

postSchema.plugin(mongoosePaginate);

const Post: IPostModel = model<IPostDocument, IPostModel>("Post", postSchema);

export default Post;
