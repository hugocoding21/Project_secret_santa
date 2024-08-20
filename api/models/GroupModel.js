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
  count: {
    type: Number,
  },
  max_count: {
    type: Number,
  },
});

GroupSchema.pre("save", function (next) {
  this.count = this.user_ids.length;
  next();
});

module.exports = mongoose.model("Group", GroupSchema);
