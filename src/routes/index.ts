import express, { Router } from "express";
import usersRouter from "./users";
import postsRouter from "./posts";

const router: Router = express.Router();

router.use("/users", usersRouter);
router.use("/posts", postsRouter);

export default router;
