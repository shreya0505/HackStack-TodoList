var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var personalSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },

  tile: {
    type: String,
    required: true,
  },

  pinned: {
    type: Boolean,
    default: false,
  },

  archived: {
    type: Boolean,
    default: false,
  },

  task: {
    type: [Schema.Types.ObjectId],
    ref: "tasks",
  },

  checklist: {
    type: [Schema.Types.ObjectId],
    ref: "checklists",
  },

  notes: {
    type: [Schema.Types.ObjectId],
    ref: "stickyNotes",
  },

  duedate: {
    type: Date,
  },

  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

//model takes argument modelname and schema
module.exports = Personal = mongoose.model("personal", personalSchema);
