import mongoose from "mongoose";
import "dotenv/config";
import faker from "faker";
import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";
import bcrypt from "bcryptjs";
import config from "../config/config";

const main = async () => {
  mongoose.set("useFindAndModify", false);
  await mongoose.connect(config.db.hostUrl!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log("connected");

  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash(faker.internet.password(), 10);

    const newUser = new User({
      username: faker.name.findName(),
      email: faker.internet.email(),
      password: hashedPassword
    });

    const user = await newUser.save();

    for (let i = 0; i < 10; i++) {
      const newPost = new Post({
        user: user._id,
        body: faker.lorem.paragraphs()
      });

      const post = await newPost.save();

      for (let i = 0; i < 2; i++) {
        const newComment = new Comment({
          user: user._id,
          body: faker.lorem.paragraphs(),
          post: post._id
        });

        const comment = await newComment.save();

        post.comments.unshift(comment._id);

        await post.save();
      }
    }
  }

  await mongoose.connection.close();

  console.log("disconnected");
};

process.on("beforeExit", async () => {
  await main();
  process.exit(0); // if you don't close yourself this will run forever
});
