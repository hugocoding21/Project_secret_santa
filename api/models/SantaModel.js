const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SantaSchema = new Schema({
  assignments: [
    {
      from: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      to: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  group_id: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
});

module.exports = mongoose.model("Santa", SantaSchema);
