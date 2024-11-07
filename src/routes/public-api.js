import express from "express";
import userController from "../controllers/user-controller.js";

const publicRouter = new express.Router();
publicRouter.get("/user/:username", userController.checkUsername);
publicRouter.post("/user/register", userController.registerUser);
publicRouter.post("/user/login", userController.loginUser);

export { publicRouter };
