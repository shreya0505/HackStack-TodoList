var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var personalSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },

  pinned: {
    type: Boolean,
    default: false,
  },

  archived: {
    type: Boolean,
    default: false,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  task: [
    {
      type: Schema.Types.ObjectId,
      ref: "tasks",
    },
  ],

  checklist: [
    {
      type: Schema.Types.ObjectId,
      ref: "checkLists",
    },
  ],

  label: {
    type: String,
    default: "",
  },

  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "stickyNotes",
    },
  ],
  startdate: {
    type: Date,
    default: Date.now(),
  },

  enddate: {
    type: Date,
  },

  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Personal = mongoose.model("personal", personalSchema);
