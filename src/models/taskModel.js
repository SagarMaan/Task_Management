const mongoose = require("mongoose");
const User = require("./userModel");
const ObjectId = mongoose.Schema.Types.ObjectId;

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["ToDo", "In_Progress", "Completed"],
    default: "ToDo",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  dueDate: {
    type: Date,
    required: true,
  },
},
{ timestamps : true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
