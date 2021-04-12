const express = require('express');
const { oneOf } = require('express-validator');
const { body } = require('express-validator/check');
const qaControler = require("../controllers/qa")
const router = express.Router();

// POST /qa/add-question
router.post('/add-question', [
    body('title').trim().isLength({min: 10, max: 200}),
    body('question').trim().isLength({min:20, max:1000}),
], qaControler.addQuestion);
router.get('/get-paged-questions/:pageNo', qaControler.getPagedQuestions);
// POST /user/login 
// router.post('/login', [
//     oneOf([body('emailPhone').trim().isEmail(), body('emailPhone').trim().isNumeric().isLength({min: 10, max:10})]),
//     body('password').trim().isLength({min: 5}),
// ], userControler.loginUser);
// GET /qa/tags
router.get('/tags', qaControler.getAllTags);
module.exports = router;