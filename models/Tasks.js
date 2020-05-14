var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  taskName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  completed: {
    type: Boolean,
    default: "false",
  },

  priority: {
    type: Number,
    default: 0,
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
