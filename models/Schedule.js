var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var scheduleSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  repeat: {
    type: Boolean,
    default: false,
  },

  daily: {
    type: Boolean,
    default: false,
  },

  days: [{
    type: String,
    default: [],
  }],

  duedate: {
    type: Date,
  },
});

module.exports = Schedule = mongoose.model("schedule", scheduleSchema);
