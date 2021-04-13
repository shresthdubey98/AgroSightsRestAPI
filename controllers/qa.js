const { validationResult } = require('express-validator/check');
const Tag = require('../models/tag');
const QTags = require('../models/tags');
const Question = require('../models/question');
const Images = require('../models/images');
exports.getAllTags = (req, res, next) => {
    Tag.getAllTags()
        .then(([rows, fieldData]) => {
            res.status(200).json({ data: rows });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}
exports.addQuestion = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const u_id = req.auth.userId;
    const title = req.body.title;
    const question = req.body.question;
    const tagList = Array.isArray(req.body.tag) ? req.body.tag : new Array(req.body.tag)
    console.log(tagList);
    const imagesdata = req.files;
    const qus = new Question(u_id, title, question);
    let q_id;
    qus.save()
        .then(([rows, fieldData]) => {
            if (!rows.insertId) {
                const error = new Error('Internal Server Error!');
                throw error;
            }
            q_id = rows.insertId;
            if (imagesdata.length == 0){
                return Promise.resolve("No Images");
            }
            const images = new Images(u_id, q_id, imagesdata);
            return images.save();
        })
        .then(_=>{
            //insert Tags
            // console.log(q_id);
            const qTags = new QTags(q_id, tagList);
            return qTags.save();
        })
        .then((_)=>{
            // console.log(result);
            res.status(200).json({message: "Question Submitted", q_id: q_id});
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({message: err.message});
        });
}
exports.getPagedQuestions = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const pageNo = req.params.pageNo || 0;
    Question.getPagedQuestions(pageNo)
    .then(([rows, fieldData])=>{
        if (rows.length == 0){
            res.status(404).json({message: "No more result pages"});
            return;
        }
        res.status(200).json({data: rows});
    })
}
exports.getQuestionById = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const q_id = req.params.qId;
    const auth_u_id = req.auth.userId;
    Question.getQuestionById(q_id, auth_u_id)
    .then(([rows, fieldData])=>{
        if (rows.length === 0){
            return res.status(404).json({message:'Not Found'});
        }
        return res.status(200).json({data:rows});
    })
    .catch(err=>{
        return res.status(500).json({message: 'Internal Server Error'});
    })
}
exports.voteQuestion = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const isVoteUp = req.body.is_vote_up === '1' ? true:false;
    const qId = req.body.q_id;
    const auth_u_id = req.auth.userId;
    Question.setVote(auth_u_id, qId, isVoteUp)
    .then(([rows, fieldData])=>{
        return res.status(200).json({data:rows});
    })
    .catch(err=>{
        if (err.code === 'ER_DUP_ENTRY'){
            return res.status(409).json({message: 'Vote already registered'});
        }
        return res.status(500).json({message: 'Internal Server Error'});
    })
}