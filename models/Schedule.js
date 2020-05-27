var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var scheduleSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },

  duedate: {
    type: Date,
    default: null,
  },
});

module.exports = Schedule = mongoose.model("schedule", scheduleSchema);
