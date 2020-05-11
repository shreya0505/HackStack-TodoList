var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var snSchema = new Schema({
  remind: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
  },
});

module.exports = stickyNote = mongoose.model("stickyNotes", snSchema);
