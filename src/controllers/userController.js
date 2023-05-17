const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");

//================================= Register User ================================================//

let userRegistration = async function (req, res) {
  try {
    let data = req.body;

    let { userName, emailId, password, role } = data;

    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Body can't be empty" });

    if (!userName || typeof userName != "string")
      return res.status(400).send({
        status: false,
        message:
          "Please provide user name with suitable datatype OR it can't be empty",
      });

    if (!emailId || typeof emailId != "string")
      return res
        .status(400)
        .send({
          status: false,
          messsage: "Email is mandatory with suitable datatype",
        });

    // let checkEmailId = await userModel.findOne({ emailId : emailId });

    // if (!checkEmailId)
    //   return res
    //     .status(404)
    //     .send({
    //       status: false,
    //       message: "This emailId is not present in your database.",
    //     });

    if (!password || typeof password != "string")
      return res
        .status(400)
        .send({
          status: false,
          messsage: "Paasword is mandatory with suitable datatype",
        });

    let hashing = bcrypt.hashSync(password, 8);
    data.password = hashing;

    if (role && typeof role != "string") {
      return res
        .status(400)
        .send({ status: false, message: "Role must be in string" });
    }

    if (!["Task Creator", "Admin", "Visitor"].includes(role.trim())) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            "Please use a valid Role status as Task Creator , Admin or Visitor",
        });
    }

    let savedata = await userModel.create(data);

    if (savedata.role == "Admin" || savedata.role == "Task Creator") {
      savedata.permissions = "true";

      let { userName, emailId, password, role, permissions } = savedata;
      let finalData = { userName, emailId, password, role, permissions };

      return res.status(201).send({
        status: true,
        message: "User created successfully",
        data: finalData,
      });
    } else {
      savedata.permissions = "false";

      let { userName, emailId, password, role, permissions } = savedata;
      let finalData = { userName, emailId, password, role, permissions };

      return res.status(201).send({
        status: true,
        message: "User created successfully",
        data: finalData,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { userRegistration };
