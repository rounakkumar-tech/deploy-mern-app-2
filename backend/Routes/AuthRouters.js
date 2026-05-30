const router = require("express").Router();

const { signup, login } = require("../Controllers/AuthController");

const {
    signupvalidation,
    loginvalidation
} = require("../Middlewares/AuthValidation");

router.post(
    "/signup",
    signupvalidation,
    signup
);

router.post(
    "/login",
    loginvalidation,
    login
);


module.exports = router;