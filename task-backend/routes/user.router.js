import express from "express";
import * as UserController from "../controller/user.controller.js";

var router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/me", UserController.me);

export default router;
