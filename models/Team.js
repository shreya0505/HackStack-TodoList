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

  creators: [
    {
      object: {
        type: [Schema.Types.ObjectId],
        ref: "tasks",
      },
      owner: {
        type: [Schema.Types.ObjectId],
        ref: "users",
      },
    },
  ],

  chat: [
    {
      sender: {
        type: [Schema.Types.ObjectId],
        ref: "users",
      },
      tag: {
        type: [Schema.Types.ObjectId],
        ref: "users",
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],

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
