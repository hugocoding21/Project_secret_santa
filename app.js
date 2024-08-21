require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./api/routes/UserRoutes");
const { groupRouter } = require("./api/routes/GroupRoutes");
const cors = require("cors");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./doc/swagger.yaml");

const { PORT = 3000, DB_PORT = "127.0.0.1" } = process.env;

const app = express();
app.use(cors());

mongoose
  .connect(`mongodb://${DB_PORT}:27017/secret-santa`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(express.json());

// Mounting the routers
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/users", userRouter);
app.use("/group", groupRouter);

app.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT}/api-docs`);
});
