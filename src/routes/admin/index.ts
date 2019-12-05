import express, { Router } from "express";
import usersRouter from "./users";
import rolesRouter from "./roles";

const router: Router = express.Router();

router.use("/users", usersRouter);
router.use("/roles", rolesRouter);

export default router;
