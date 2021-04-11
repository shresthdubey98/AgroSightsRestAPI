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