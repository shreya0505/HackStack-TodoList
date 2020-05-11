var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var scheduleSchema = new Schema({
  repeat: {
    type: Boolean,
    default: false,
  },

  days: {
    type: [String],
  },

  dueDate: {
    type: Date,
  },
  remind: {
    type: Boolean,
    default: false,
  },
  days: {
    type: [String],
  },
  date: {
    type: Date,
  },
  remindMessage: {
    type: Boolean,
    default: "You have a HackStack todolist task reminder",
    required: true,
  },
});

module.exports = Schedule = mongoose.model("schedule", scheduleSchema);
