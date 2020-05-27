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

  subtasks: [
    {
      sub: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        default: false,
      },
      due: {
        type: Date,
      },
    },
  ],
});

module.exports = Tasks = mongoose.model("tasks", taskSchema);
