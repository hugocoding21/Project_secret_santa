const { verifyToken, checkRole } = require("../middlewares/jwtMiddleware");
const {
  CreateGroup,
  AddUserToGroup,
  getAllGroupName,
  getAllGroup,
  getSanta,
} = require("../controllers/GroupsController");
const express = require("express");

/* Group Routes */
const groupRouter = express.Router();

groupRouter.use(verifyToken);
groupRouter.get("/", getAllGroupName);
groupRouter.post("/create", CreateGroup);
groupRouter.post("/add", AddUserToGroup);
groupRouter.get("/create-santa", getSanta);

// Admin route
groupRouter.get("/admin", checkRole, getAllGroup);

module.exports = { groupRouter };
