var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var scheduleSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  repeat: {
    type: Boolean,
    default: false,
  },

  daily: {
    type: Boolean,
    default: false,
  },

  weekly: [
    {
      type: String,
    },
  ],

  startdate: {
    type: Date,
    default: Date.now(),
  },
  enddate: {
    type: Date,
  },
});

module.exports = Schedule = mongoose.model("schedule", scheduleSchema);
