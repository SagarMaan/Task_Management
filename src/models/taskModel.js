const mongoose = require("mongoose");
const User = require("./userModel");
const ObjectId = mongoose.Schema.Types.ObjectId;

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User ",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["ToDo", "In_Progress", "Completed"],
      default: "ToDo",
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
