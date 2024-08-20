require("dotenv").config();
const express = require("express");
const route = require("./api/routes");
const mongoose = require("mongoose");
const { PORT = 3000, DB_PORT = "127.0.0.1" } = process.env;

const app = express();

mongoose
  .connect(`mongodb://${DB_PORT}:27017/secret-santa`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(express.json());
app.use("/", route);

app.listen(PORT, () => {
  console.log(`Server is running: http://localhost:${PORT}`);
});
