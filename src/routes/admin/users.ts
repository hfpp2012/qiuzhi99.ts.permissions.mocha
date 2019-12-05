import express, { Router } from "express";
import * as usersController from "../../controllers/admin/users";
import permit from "../../middlewares/admin/permission.middleware";
import checkAdminAuthMiddleware from "../../middlewares/admin/check-auth.middleware";

const router: Router = express.Router();

router.post("/login", usersController.postLogin);

router
  .get(
    "/",
    checkAdminAuthMiddleware,
    permit("admin", "basic"),
    usersController.index
  )
  .post(
    "/",
    checkAdminAuthMiddleware,
    permit("coder", "admin", "basic"),
    usersController.addAdmin
  );

router.put("/:id", usersController.updateAdmin);

export default router;
