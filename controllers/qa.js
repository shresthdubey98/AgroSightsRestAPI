const { validationResult, param } = require('express-validator/check');
const Tag = require('../models/tag');
const QTags = require('../models/tags');
const Question = require('../models/question');
const Images = require('../models/images');
const Answer = require('../models/answer');
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
    const tagsString = req.body.tag;
    const tagList = Array.isArray(tagsString)? tagsString : tagsString.trim().split(' ');
    const imagesdata = Object.entries(req.files).length === 0 ? undefined:req.files;
    const qus = new Question(u_id, title, question);
    let q_id;
    qus.save()
        .then(([rows, fieldData]) => {
            if (!rows.insertId) {
                const error = new Error('Internal Server Error!');
                throw error;
            }
            q_id = rows.insertId;
            if (!imagesdata){
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
exports.revokeQuestionVote = (req, res, next)=>{
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
    Question.revokeVote(auth_u_id, qId, isVoteUp)
    .then(([rows, fieldData])=>{
        if (rows[0][0]['result'] === 0){
            return res.status(409).json({message: 'vote not found'})
        }
        return res.status(200).json({message:'Vote revoked'});
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    })
}
exports.addAnswer = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const u_id = req.auth.userId;
    const q_id = req.body.q_id;
    const answer = req.body.answer;
    const ans = new Answer(u_id, q_id,answer);
    ans.save()
        .then(([rows, fieldData]) => {
            if (!rows.insertId) {
                const error = new Error('Internal Server Error!');
                throw error;
            }
            return res.status(200).json({message: "Answer Submitted", a_id: rows.insertId});
        })
        .catch(err=>{
            if(err.code === 'ER_DUP_ENTRY')
                return res.status(409).json({message: err.message});
            return res.status(500).json({message: err.message});
        });
}
exports.getAnswersByQId = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const q_id = req.params.q_id;
    Answer.getAnswers(q_id)
    .then(([rows, fieldData])=>{
        if (rows.length == 0){
            res.status(404).json({message: "No Answers Found"});
            return;
        }
        res.status(200).json({data: rows});
    })
}
exports.voteAnswer = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const isVoteUp = req.body.is_vote_up === '1' ? true:false;
    const aId = req.body.a_id;
    const auth_u_id = req.auth.userId;
    Answer.setVote(auth_u_id, aId, isVoteUp)
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
exports.revokeAnswerVote = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const isVoteUp = req.body.is_vote_up === '1' ? true:false;
    const aId = req.body.a_id;
    const auth_u_id = req.auth.userId;
    Answer.revokeVote(auth_u_id, aId, isVoteUp)
    .then(([rows, fieldData])=>{
        if (rows[0][0]['result'] === 0){
            return res.status(409).json({message: 'vote not found'})
        }
        return res.status(200).json({message:'Vote revoked'});
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    })
}
exports.getAnswerVote = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const aId = req.params.a_id;
    const auth_u_id = req.auth.userId;
    Answer.getAnswerVoteByUId(auth_u_id,aId)
    .then(([rows, fieldData])=>{
        return res.status(200).json(rows);
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    })
}
exports.getQAttachments = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const qId = req.params.qId;
    
    Images.getImagesByQid(qId)
    .then(([rows, fieldData])=>{
        if (rows.length==0){
            res.status(404).json({message: 'No Data Found'});
        }
        rows.forEach(e=>{
            e.imageUrl = '/media/images/'+e.file_name;
        });
        return res.status(200).json({data: rows});
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    })
}
