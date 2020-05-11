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
    default: "",
  },
  color: {
    type: String,
    default: "white",
  },

  pinned: {
    type: Boolean,
    default: false,
  },

  archived: {
    type: Boolean,
    default: false,
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
  label: {
    type: String,
    default:""
  },

  notes: {
    type: [Schema.Types.ObjectId],
    ref: "stickyNotes",
  },

  duedate: {
    type: Date,
    default:"",
  },

  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

//model takes argument modelname and schema
module.exports = Personal = mongoose.model("personal", personalSchema);
