var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    },
    
    tile: {
        type: String,
        required:true
    },

    pin: {
        type: Boolean,
        default:false
    },

    task: {
        type: [Schema.Types.ObjectId],
        ref: 'tasks'
    },

    checklist: {
        type: [Schema.Types.ObjectId],
        ref: 'checklists'
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
module.exports = User = mongoose.model("users", userSchema);
