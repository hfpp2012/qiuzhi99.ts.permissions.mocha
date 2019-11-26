import express, { Router } from "express";
import * as usersController from "../controllers/users";

let router: Router = express.Router();

router.post("/register", usersController.postRegister);
router.post("/login", usersController.postLogin);

export default router;
