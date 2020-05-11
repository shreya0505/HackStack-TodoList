var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var checkListSchema = new Schema({
  listName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  status: {
    type: Boolean,
    default: false,
  },

  priority: {
    type: Number,
    default: 0,
  },

  listItems: {
    type: [String],
    required: true,
  },

  dueDate: {
    type: Date,
  },

  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = checkList = mongoose.model("checkLists", checkListSchema);
