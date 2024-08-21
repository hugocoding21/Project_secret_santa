const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let GroupSchema = new Schema({
  user_ids: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  name: {
    type: String,
    required: true,
  },

  invitation_status: [
    {
      user_id: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        default: null /* null: pending, true: accepted, false: refused */,
      },
    },
  ],
  santa_id: {
    type: Schema.Types.ObjectId,
    ref: "Santa",
    default: null,
  },
});

module.exports = mongoose.model("Group", GroupSchema);
