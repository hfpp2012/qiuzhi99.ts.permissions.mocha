import express, { Router } from "express";
import * as userController from "../controllers/user";

let router: Router = express.Router();

router.post("/register", userController.postRegister);
router.post("/login", userController.postLogin);

export default router;
