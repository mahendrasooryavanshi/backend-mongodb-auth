const express = require("express");
const { AuthController } = require("../controller/auth.controller");
const router = express.Router()
const { validate } = require("../middleware/validation");
const { createUserSchema, loginSchema } = require("../validation/auth.validation");
const { valid } = require("joi");


router.post("/signup", validate(createUserSchema), AuthController.signUp)
router.post("/login", validate(loginSchema), AuthController.login)
module.exports = router