const express = require('express');
const { oneOf } = require('express-validator');
const { body } = require('express-validator/check');
const qaControler = require("../controllers/qa")
const router = express.Router();

// POST /user/register
// router.post('/register', [
//     body('email').trim().isEmail(),
//     body('password').trim().isLength({min: 5}),
//     body('fName').trim().isLength({min: 3}),
//     body('lName').trim().isLength({min: 2}),
//     body('phone').trim().isLength({min: 10, max: 10}),
// ], userControler.registerUser);

// POST /user/login
// router.post('/login', [
//     oneOf([body('emailPhone').trim().isEmail(), body('emailPhone').trim().isNumeric().isLength({min: 10, max:10})]),
//     body('password').trim().isLength({min: 5}),
// ], userControler.loginUser);

// GET /qa/tags
router.get('/tags', qaControler.getAllTags);

module.exports = router;