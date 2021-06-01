const { validationResult, param } = require('express-validator/check');
const Messages = require('../models/message');

exports.getDialogsMetaData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const auth_u_id = req.auth.userId;
    console.log(auth_u_id);
    Messages.getDialogsMetaData(auth_u_id)
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
exports.getSingleDialog = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const auth_u_id = req.auth.userId;
    const to_id = req.params.to_id;
    Messages.getDialogData(auth_u_id, to_id)
    .then(([rows, fieldData])=>{
        if (rows.length === 0){
            return res.status(404).json({message:'Not Found'});
        }
        return res.status(200).json(rows[0]);
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    })
}
exports.getAllMessages = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const auth_u_id = req.auth.userId;
    const to_id = req.params.to_id;
    Messages.getAllMessages(auth_u_id, to_id)
    .then(([rows, fieldData])=>{
        if (rows.length === 0){
            return res.status(404).json({message:'Not Found'});
        }
        return res.status(200).json({data: rows});
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
    })
}

// exports.getQuestionById = (req, res, next)=>{
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed');
//         error.statusCode = 422;
//         error.data = errors.array();
//         throw error;
//     }
//     const q_id = req.params.qId;
//     const auth_u_id = req.auth.userId;
//     Question.getQuestionById(q_id, auth_u_id)
//     .then(([rows, fieldData])=>{
//         if (rows.length === 0){
//             return res.status(404).json({message:'Not Found'});
//         }
//         return res.status(200).json({data:rows});
//     })
//     .catch(err=>{
//         return res.status(500).json({message: 'Internal Server Error'});
//     })
// }
// exports.voteQuestion = (req, res, next)=>{
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed');
//         error.statusCode = 422;
//         error.data = errors.array();
//         throw error;
//     }
//     const isVoteUp = req.body.is_vote_up === '1' ? true:false;
//     const qId = req.body.q_id;
//     const auth_u_id = req.auth.userId;
//     Question.setVote(auth_u_id, qId, isVoteUp)
//     .then(([rows, fieldData])=>{
//         return res.status(200).json({data:rows});
//     })
//     .catch(err=>{
//         if (err.code === 'ER_DUP_ENTRY'){
//             return res.status(409).json({message: 'Vote already registered'});
//         }
//         return res.status(500).json({message: 'Internal Server Error'});
//     })
// }
// exports.revokeQuestionVote = (req, res, next)=>{
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed');
//         error.statusCode = 422;
//         error.data = errors.array();
//         throw error;
//     }
//     const isVoteUp = req.body.is_vote_up === '1' ? true:false;
//     const qId = req.body.q_id;
//     const auth_u_id = req.auth.userId;
//     Question.revokeVote(auth_u_id, qId, isVoteUp)
//     .then(([rows, fieldData])=>{
//         if (rows[0][0]['result'] === 0){
//             return res.status(409).json({message: 'vote not found'})
//         }
//         return res.status(200).json({message:'Vote revoked'});
//     })
//     .catch(err=>{
//         console.log(err);
//         return res.status(500).json({message: 'Internal Server Error'});
//     })
// }
// exports.addAnswer = (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed');
//         error.statusCode = 422;
//         error.data = errors.array();
//         throw error;
//     }
//     const u_id = req.auth.userId;
//     const q_id = req.body.q_id;
//     const answer = req.body.answer;
//     const ans = new Answer(u_id, q_id,answer);
//     ans.save()
//         .then(([rows, fieldData]) => {
//             if (!rows.insertId) {
//                 const error = new Error('Internal Server Error!');
//                 throw error;
//             }
//             return res.status(200).json({message: "Answer Submitted", a_id: rows.insertId});
//         })
//         .catch(err=>{
//             if(err.code === 'ER_DUP_ENTRY')
//                 return res.status(409).json({message: err.message});
//             return res.status(500).json({message: err.message});
//         });
// }
// exports.getAnswersByQId = (req, res, next)=>{
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed');
//         error.statusCode = 422;
//         error.data = errors.array();
//         throw error;
//     }
//     const q_id = req.params.q_id;
//     Answer.getAnswers(q_id)
//     .then(([rows, fieldData])=>{
//         if (rows.length == 0){
//             res.status(404).json({message: "No Answers Found"});
//             return;
//         }
//         res.status(200).json({data: rows});
//     })
// }
// exports.voteAnswer = (req, res, next)=>{
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed');
//         error.statusCode = 422;
//         error.data = errors.array();
//         throw error;
//     }
//     const isVoteUp = req.body.is_vote_up === '1' ? true:false;
//     const aId = req.body.a_id;
//     const auth_u_id = req.auth.userId;
//     Answer.setVote(auth_u_id, aId, isVoteUp)
//     .then(([rows, fieldData])=>{
//         return res.status(200).json({data:rows});
//     })
//     .catch(err=>{
//         if (err.code === 'ER_DUP_ENTRY'){
//             return res.status(409).json({message: 'Vote already registered'});
//         }
//         return res.status(500).json({message: 'Internal Server Error'});
//     })
// }
// exports.revokeAnswerVote = (req, res, next)=>{
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed');
//         error.statusCode = 422;
//         error.data = errors.array();
//         throw error;
//     }
//     const isVoteUp = req.body.is_vote_up === '1' ? true:false;
//     const aId = req.body.a_id;
//     const auth_u_id = req.auth.userId;
//     Answer.revokeVote(auth_u_id, aId, isVoteUp)
//     .then(([rows, fieldData])=>{
//         if (rows[0][0]['result'] === 0){
//             return res.status(409).json({message: 'vote not found'})
//         }
//         return res.status(200).json({message:'Vote revoked'});
//     })
//     .catch(err=>{
//         console.log(err);
//         return res.status(500).json({message: 'Internal Server Error'});
//     })
// }
// exports.getAnswerVote = (req, res, next)=>{
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const error = new Error('Validation failed');
//         error.statusCode = 422;
//         error.data = errors.array();
//         throw error;
//     }
//     const aId = req.params.a_id;
//     const auth_u_id = req.auth.userId;
//     Answer.getAnswerVoteByUId(auth_u_id,aId)
//     .then(([rows, fieldData])=>{
//         return res.status(200).json(rows);
//     })
//     .catch(err=>{
//         console.log(err);
//         return res.status(500).json({message: 'Internal Server Error'});
//     })
// }
