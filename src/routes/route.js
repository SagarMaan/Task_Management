const router = require("express").Router()

const { userRegistration } = require("../controllers/userController");

// ===================================== User API's ====================================== //


router.post( "/register" , userRegistration );


// ===================================== Invalid path ====================================== //


router.all('/*', ( req , res ) => {
    res.status(400).send({ status: false, message: " Path invalid." });
});


module.exports=router