const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: false,
  },
  gender: {
    type: Boolean,
    required: true,
  },
  groups_id: [
    {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  admin: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
