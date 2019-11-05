import { Schema, model, Document, PaginateModel } from "mongoose";
import { IUserDocument } from "./User";
import mongoosePaginate from "mongoose-paginate-v2";

interface Like {
  username: IPostDocument["username"];
  createdAt: IPostDocument["createdAt"];
}

interface Comment {
  username: IPostDocument["username"];
  createdAt: IPostDocument["createdAt"];
  body: IPostDocument["body"];
  id?: IPostDocument["_id"];
}

interface IPostModel extends PaginateModel<IPostDocument> {}

export interface IPostDocument extends Document {
  body: string;
  createdAt: string;
  username: IUserDocument["username"];
  user: IUserDocument["_id"];
  likes: Like[];
  comments: Comment[];
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
  ],
  comments: [
    {
      username: String,
      body: String,
      createdAt: String
    }
  ]
});

postSchema.plugin(mongoosePaginate);

const Post: IPostModel = model<IPostDocument, IPostModel>("Post", postSchema);

export default Post;
