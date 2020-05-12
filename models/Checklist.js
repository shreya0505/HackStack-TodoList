var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var checkListSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },

  listName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  status: {
    type: Boolean,
    default: false,
  },

  priority: {
    type: Number,
    default: 0,
  },

  listItems: [
    {
      item: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
  ],

  dueDate: {
    type: Date,
  },

  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = checkList = mongoose.model("checkLists", checkListSchema);
