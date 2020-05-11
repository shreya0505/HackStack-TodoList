var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var snSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

module.exports = stickyNote = mongoose.model("stickyNotes", snSchema);
