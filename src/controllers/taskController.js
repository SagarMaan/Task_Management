const moment = require("moment");
const { isValidObjectId } = require("mongoose");

const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");
const {
  validateTaskStatus,
  validateTaskPriority,
} = require("../validations/validator");

// ===================================== Create Task =====================================================//

const createTask = async function (req, res) {
  try {
    let userId = req.params.userId;
// if userid then check is it present in DB or not 
    if (userId) {
      let checkUserId = await userModel.findById({ _id: userId });
      if (checkUserId.role === "Visitor") {
        return res.status(403).send({
          status: false,
          message: "You are not authorized to create task .",
        });
      }
    }

    let body = req.body;

    let { title, description, status, priority, dueDate } = body;

    if (Object.keys(body).length === 0) { // check that any attribute is present or not
      return res
        .status(400)
        .send({ status: false, message: "Body can not be empty" });
    }

    if (!title || typeof title != "string") {
      return res
        .status(400)
        .send({ status: false, message: "Title must be in string" });
    }

    if (!description) {
      return res.status(400).send({
        status: false,
        message: " Description must be present in body and can't be empty.",
      });
    }
    if (typeof description != "string") {
      return res
        .status(400)
        .send({ status: false, message: "Description must be in string" });
    }

    description = description.trim();

    if (status) {
      if (typeof status != "string") {
        return res
          .status(400)
          .send({ status: false, message: "Status must be in string" });
      }

      if (!validateTaskStatus(status)) {
        return res.status(400).send({
          status: false,
          message: "Task status should be ToDo , In_Progress , Completed.",
        });
      }
    }

    if (priority) {
      if (typeof priority != "string") {
        return res
          .status(400)
          .send({ status: false, message: "Priority must be in string" });
      }

      if (!validateTaskPriority(priority)) {
        return res.status(400).send({
          status: false,
          message: "Task priority should be low , medium , high.",
        });
      }
    }

    if (typeof dueDate != "string") {
      return res.status(400).send({
        status: false,
        message: "Date should be in a correct format .",
      });
    }

    dueDate = dueDate.trim();

    if (moment(dueDate, "YYYY-MM-DD").format("YYYY-MM-DD") !== dueDate) {
      return res.status(400).send({
        status: false,
        message: "Please enter the Date in the format of 'YYYY-MM-DD'.",
      });
    }

    const taskData = await taskModel.create(body);

    return res.status(201).send({
      status: true,
      message: "Task created successfully.",
      data: taskData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

// ================================= Get Task List =================================================//

const getTask = async function (req, res) {
  try {
    // give all task list to a user which have user id and it is authenticated 
    // all validations apply on user in autherization middleware
    const taskDetails = await taskModel.find().select({
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });

    return res
      .status(200)
      .send({ status: true, message: "Task LIst", data: taskDetails });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = {
  createTask,
  getTask,
  getTaskById,
  updateTask,
};
