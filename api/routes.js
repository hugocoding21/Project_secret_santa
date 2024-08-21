const express = require("express");
const router = express.Router();

/* Middleware */
const { hashPassword } = require("./middlewares/hashPassword");
const { verifyToken, checkRole } = require("./middlewares/jwtMiddleware");

/* Fonction */
const { register, login, handleInvitation, getAll, getMySanta } = require("./controllers/UserController");
const {
  CreateGroup,
  AddUserToGroup,
  getAllGroupName,
  getAllGroup,
  getSanta,
} = require("./controllers/GroupsController");

router.get("/", (req, res) => {
  console.log("Serveur opérationnel !");
  res.send("Serveur opérationnel !");
});

/* User Routes */
const userRouter = express.Router();

router.use("/users", userRouter);
userRouter.post("/register", hashPassword, register);
userRouter.post("/login", login);
userRouter.post("/group/:groupId", verifyToken, handleInvitation);
userRouter.get("/getsanta", verifyToken, getMySanta);
userRouter.get("/", getAll);

/* Group Routes */
const groupRouter = express.Router();

router.use("/group", verifyToken, groupRouter);
groupRouter.get("/", getAllGroupName);
groupRouter.post("/create", CreateGroup);
groupRouter.post("/add", AddUserToGroup);
groupRouter.get("/create-santa", getSanta);

//admin
groupRouter.get("/admin", checkRole, getAllGroup);

module.exports = router;
