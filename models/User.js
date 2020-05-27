var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
    required: true,
  },

  personal: [
    {
      type: Schema.Types.ObjectId,
      ref: "personal",
    },
  ],

  team: [
    {
      type: Schema.Types.ObjectId,
      ref: "team",
    },
  ],
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
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "stickyNotes",
    },
  ],

  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = User = mongoose.model("users", userSchema);
