const express = require("express");
const { AuthController } = require("../controller/auth.controller");
const router = express.Router()
const { validate } = require("../middleware/validation");
const { createUserSchema } = require("../validation/auth.validation");
router.post("/signup", validate(createUserSchema), AuthController.signUp)

module.exports = router