const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const { validateUserName , validateEmailId , validatePassword , ValidateRoleStatus } = require("../validations/validator")



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

      if (!validateUserName(userName)) {
        return res
          .status(400)
          .send({ status: false, message: "User name should contain only alphabates." });
      }

    if (!emailId || typeof emailId != "string")
      return res
        .status(400)
        .send({
          status: false,
          messsage: "Email is mandatory with suitable datatype",
        });

        if (!validateEmailId(emailId)) {
          return res
            .status(400)
            .send({ status: false, message: "EmailId should be in a valid format." });
        }

    if (!password || typeof password != "string")
      return res
        .status(400)
        .send({
          status: false,
          messsage: "Paasword is mandatory with suitable datatype",
        });

        if (!validatePassword(password)) {
          return res
            .status(400)
            .send({ status: false, message: "Password should be in a valid format." });
        }

    let hashing = bcrypt.hashSync(password, 8);
    data.password = hashing;

    if (role && typeof role != "string") {
      return res
        .status(400)
        .send({ status: false, message: "Role must be in string" });
    }

    if (!ValidateRoleStatus(role)) {
      return res
        .status(400)
        .send({ status: false, message: "Role status should be Admin , Task Creator and Visitor ." });
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


//==================================== Login User ============================================//


const userLogin = async function (req, res) {
  try {
    let { emailId, password } = req.body;

    if (Object.keys(req.body).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please input user Details" });
    }
    if (!emailId || typeof emailId != "string")
    return res
      .status(400)
      .send({
        status: false,
        messsage: "Email is mandatory with suitable datatype",
      });

 
    if (!validateEmailId(emailId)) {
      return res
        .status(400)
        .send({ status: false, message: "EmailId should be Valid" });
    }

    if (!password || typeof password != "string")
    return res
      .status(400)
      .send({
        status: false,
        messsage: "Paasword is mandatory with suitable datatype",
      });


      if (!validatePassword(password)) {
        return res
          .status(400)
          .send({ status: false, message: "Password should be in a valid format." });
      }

    let verifyUser = await userModel.findOne({ emailId: emailId });
    if (!verifyUser) {
      return res
      .status(400)
      .send({ status: false, message: "User not found" });
    }

    let hash = verifyUser.password;

    let isCorrect = bcrypt.compareSync(password, hash);
    if (!isCorrect)
      return res
        .status(400)
        .send({ status: false, message: "Password is incorrect" });

    let payload = { userId: verifyUser["_id"], iat: Date.now() };
    let jwtToken = jwt.sign(payload, "secret-key", { expiresIn: "1h" });

    res.setHeader("jwtKey", jwtToken );
    return res.status(200).send({
      status: true,
      message: "User login successfull",
      data: { userId: verifyUser["_id"], jwtToken },
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = { userRegistration, userLogin, updateUser };