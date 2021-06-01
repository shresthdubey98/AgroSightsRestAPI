const express = require('express');
const { body, param} = require('express-validator/check');
const chatControler = require("../controllers/chat")
const router = express.Router();

// --------------------------------------------TAGS--------------------------------------------------------
// GET /chat/tags
router.get('/get-dialogs-metadata', chatControler.getDialogsMetaData);
router.get('/get-dialog/:to_id', [[param('to_id').exists().isInt()]], chatControler.getSingleDialog);
router.get('/get-all-messages/:to_id', [[param('to_id').exists().isInt()]], chatControler.getAllMessages);

//---------------------------------------------QUESTIONS---------------------------------------------------
// POST /chat/add-question
// router.post('/add-question', [
//     body('title').trim().isLength({min: 10, max: 200}),
//     body('question').trim().isLength({min:20, max:1000}),
// ], chatControler.addQuestion);

// // GET /chat/get-paged-questions/<page-no>
// router.get('/get-paged-questions/:pageNo',[param('pageNo').exists().isInt()], qaControler.getPagedQuestions);

module.exports = router;