const express = require('express');
const { oneOf } = require('express-validator');
const { body, param} = require('express-validator/check');
const qaControler = require("../controllers/qa")
const router = express.Router();

// --------------------------------------------TAGS--------------------------------------------------------
// GET /qa/tags
router.get('/tags', qaControler.getAllTags);

//---------------------------------------------QUESTIONS---------------------------------------------------
// POST /qa/add-question
router.post('/add-question', [
    body('title').trim().isLength({min: 10, max: 200}),
    body('question').trim().isLength({min:20, max:1000}),
], qaControler.addQuestion);

// GET /qa/get-paged-questions/<page-no>
router.get('/get-paged-questions/:pageNo',[param('pageNo').exists().isInt()], qaControler.getPagedQuestions);

// GET /qa/get-question/<question-id>
router.get('/get-question/:qId',[param('qId').exists().isInt()], qaControler.getQuestionById);

// GET /qa/get-q-attachments/<question-id>
router.get('/get-q-attachments/:qId',[param('qId').exists().isInt()], qaControler.getQAttachments);

// POST /qa/question-vote
router.post('/question-vote', [
    body('q_id').exists().trim().isInt(),
    body('is_vote_up').exists().isInt(),
], qaControler.voteQuestion);

// POST /qa/revoke-question-vote
router.post('/revoke-question-vote', [
    body('q_id').exists().trim().isInt(),
    body('is_vote_up').exists().isInt(),
], qaControler.revokeQuestionVote);

//------------------------------------------ANSWERS--------------------------------------------------------
// POST /qa/add-answer
router.post('/add-answer', [
    body('q_id').exists().trim().isInt(),
    body('answer').exists()
], qaControler.addAnswer);

//GET /qa/get-answers/<question-id>
router.get('/get-answers/:q_id', [
    param('q_id').exists().isInt()
], qaControler.getAnswersByQId)

// POST /qa/revoke-answer-vote
router.post('/answer-vote', [
    body('a_id').exists().trim().isInt(),
    body('is_vote_up').exists().isInt(),
], qaControler.voteAnswer);

// POST /qa/revoke-answer-vote
router.post('/revoke-answer-vote', [
    body('a_id').exists().trim().isInt(),
    body('is_vote_up').exists().isInt(),
], qaControler.revokeAnswerVote);

router.post('/revoke-answer-vote', [
    body('a_id').exists().trim().isInt(),
    body('is_vote_up').exists().isInt(),
], qaControler.revokeAnswerVote);

router.get('/get-answer-vote/:a_id',[
    param('a_id').exists().isInt()
],
qaControler.getAnswerVote
)




module.exports = router;