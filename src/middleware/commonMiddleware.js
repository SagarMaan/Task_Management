const JWT = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");

const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");

// ======================================= AUTHENTICATION =============================================//
const isAuthenticated = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "Token must be Present." });
    }

    JWT.verify(token, "secret-key", function (err, decodedToken) {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res
            .status(401)
            .send({ status: false, message: "invalid token" });
        }

        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .send({
              status: false,
              message: "You are logged out, login again",
            });
        } else {
          return res.send({ msg: err.message });
        }
      } else {
        req.token = decodedToken;
        next();
      }
    });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
};

// =========================================== AUTHORISATION ===========================================//

const isAuthorized = async function (req, res, next) {
  try {
    const loggedUserId = req.token.userId;

    // if (req.originalUrl === "/task") {
    //   let userId = req.body.userId;

    let userId = req.params.userId;
    if (!userId) {
      return res.status(400).send({
        status: false,
        message: "UserId must be present for Authorization.",
      });
    }
    if (userId && typeof userId != "string") {
      return res
        .status(400)
        .send({ status: false, message: "UserId must be in string." });
    }

    userId = userId.trim();

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid user id" });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res
        .status(404)
        .send({ status: false, message: "The user id does not exist" });
    }

    if (loggedUserId != userId) {
      return res.status(403).send({
        status: false,
        message:
          "Not authorized,please provide your own user id for task creation",
      });
    }

    //   req.body.userId = userId;
    // } else {
    //   let taskId = req.params.taskId;

    //   if (!taskId) {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "TaskId is mandatory" });
    //   }
    //   if (!isValidObjectId(taskId)) {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "Invalid Task Id" });
    //   }

    //   let checkTaskId = await taskModel.findById(taskId);
    //   if (!checkTaskId) {
    //     return res
    //       .status(404)
    //       .send({
    //         status: false,
    //         message:
    //           "Data Not found with this task id, Please enter a valid task id",
    //       });
    //   }

    //   let userId = checkTaskId.userId;

    //   if (userId != loggedUserId) {
    //     return res
    //       .status(403)
    //       .send({
    //         status: false,
    //         message: "Not authorized,please provide your own task id",
    //       });
    //   }
    // }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { isAuthenticated, isAuthorized };
