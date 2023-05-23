const router = require("express").Router();
const {isAuthenticated , isAuthorized } = require("../middleware/commonMiddleware")
const { userRegistration, userLogin, updateUser } = require("../controllers/userController");
const { createTask , getTask , getTaskById , updateTask} = require("../controllers/taskController")

//======================================= User APIs =============================================//

router.post("/register", userRegistration );
router.post("/login", userLogin );
router.put("/update/:userId",isAuthenticated , updateUser);

//===================================== Task APIs ===============================================//

router.post("/createTask/:userId", isAuthenticated, isAuthorized, createTask);
router.get("/tasks/:userId", isAuthenticated, isAuthorized,getTask);
router.get("/GetTask/:userId", isAuthenticated, isAuthorized , getTaskById);
router.put("/UpdateTask/:userId", isAuthenticated, isAuthorized, updateTask);

// ===================================== Invalid path ====================================== //

router.all("/*", (req, res) => {
  res.status(400).send({ status: false, message: " Path invalid." });
});


module.exports = router;
