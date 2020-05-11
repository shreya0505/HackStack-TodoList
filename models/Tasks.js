var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskSchema = new Schema({
  taskName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },

  priority: {
    type: Number,
    default: 0,
  },

  reminders: {
    type: [Schema.Types.ObjectId],
    ref: "reminders",
  },

  schedule: {
    type: Schema.Types.ObjectId,
    ref: "schedule",
  },

  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Tasks = mongoose.model("tasks", taskSchema);
