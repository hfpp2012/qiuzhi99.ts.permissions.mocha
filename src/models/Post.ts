import { Schema, model, Document, PaginateModel } from "mongoose";
import { IUserDocument } from "./User";
import mongoosePaginate from "mongoose-paginate-v2";
// @ts-ignore
import mongooseAutopopulate from "mongoose-autopopulate";
import { ICommentDocument } from "./Comment";

type Like = IUserDocument["_id"];

type Comment = ICommentDocument["_id"];

interface IPostModel extends PaginateModel<IPostDocument> {}

export interface IPostDocument extends Document {
  body: string;
  user: IUserDocument["_id"];
  likes: Like[];
  comments: Comment[];
}

export const postSchema: Schema = new Schema(
  {
    body: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: { select: "-password" }
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        autopopulate: { select: "-password" }
      }
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        autopopulate: {
          path: "comments",
          populate: { path: "user", select: "-password" }
        }
      }
    ]
  },
  { timestamps: true }
);

postSchema.plugin(mongoosePaginate);
postSchema.plugin(mongooseAutopopulate);

const Post: IPostModel = model<IPostDocument, IPostModel>("Post", postSchema);

export default Post;
