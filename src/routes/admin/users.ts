import express, { Router } from "express";
import * as usersController from "../../controllers/admin/users";

const router: Router = express.Router();

router.post("/login", usersController.postLogin);

router.get("/", usersController.index).post("/", usersController.addAdmin);

export default router;
