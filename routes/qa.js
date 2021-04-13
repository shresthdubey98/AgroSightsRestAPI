const express = require('express');
const { oneOf } = require('express-validator');
const { body, param} = require('express-validator/check');
const qaControler = require("../controllers/qa")
const router = express.Router();

// POST /qa/add-question
router.post('/add-question', [
    body('title').trim().isLength({min: 10, max: 200}),
    body('question').trim().isLength({min:20, max:1000}),
], qaControler.addQuestion);

// GET /qa/get-paged-questions/<page-no>
router.get('/get-paged-questions/:pageNo',[param('pageNo').exists().isInt()], qaControler.getPagedQuestions);

// GET /qa/get-question/<question-id>
router.get('/get-question/:qId',[param('qId').exists().isInt()], qaControler.getQuestionById);

// POST /qa/vote-question
router.post('/vote-question', [
    body('q_id').exists().trim().isInt(),
    body('is_vote_up').exists().isInt(),
], qaControler.voteQuestion);


// POST /user/login 
// router.post('/login', [
//     oneOf([body('emailPhone').trim().isEmail(), body('emailPhone').trim().isNumeric().isLength({min: 10, max:10})]),
//     body('password').trim().isLength({min: 5}),
// ], userControler.loginUser);
// GET /qa/tags
router.get('/tags', qaControler.getAllTags);
module.exports = router;