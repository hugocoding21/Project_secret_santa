const { hashPassword } = require("../middlewares/hashPassword");
const { verifyToken } = require("../middlewares/jwtMiddleware");
const { register, login, handleInvitation, getAll, getMySanta } = require("../controllers/UserController");
const express = require("express");

/* User Routes */
const userRouter = express.Router();

userRouter.post("/register", hashPassword, register);
userRouter.post("/login", login);
userRouter.post("/group/:groupId", verifyToken, handleInvitation);
userRouter.get("/getsanta", verifyToken, getMySanta);
userRouter.get("/", getAll);

module.exports = { userRouter };
