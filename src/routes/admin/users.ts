import express, { Router } from "express";
import * as usersController from "../../controllers/admin/users";
import permit from "../../middlewares/admin/permission.middleware";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";

const router: Router = express.Router();

router.post("/login", usersController.postLogin);

router
  .get("/", checkAdminAuthMiddleware, usersController.index)
  .post(
    "/",
    checkAdminAuthMiddleware,
    permit("coder", "admin", "basic"),
    usersController.addAdmin
  );

router.put("/:id", usersController.updateAdmin);

router.post("/:id/role", usersController.role);

export default router;
