const { validationResult } = require('express-validator/check');
const Tags = require('../models/tag');

exports.getAllTags = (req, res, next) => {
    const errors = validationResult(req);
    Tags.getAllTags()
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