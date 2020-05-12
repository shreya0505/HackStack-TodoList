var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teamSchema = new Schema({
  manager: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },

  teamJoinCode: {
    type: String,
    required: true,
  },

  teamMembers: {
    type: [Schema.Types.ObjectId],
    ref: "users",
  },

  teamName: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "Ongoing",
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
  completed: {
    type: Boolean,
    default: false,
  },

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
  activityLog: [
    {
      member: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      action: {
        type: String,
        required: true,
      },

      target: {
        type: String,
        required: true,
      },
      targetid: {
        type: Schema.Types.ObjectId,
      },
      time: {
        type: Date,
        default: Date.now(),
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
  label: {
    type: "String",
  },
});

//model takes argument modelname and schema
module.exports = Team = mongoose.model("team", teamSchema);
