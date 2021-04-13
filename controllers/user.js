const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../util/configs').jwtSecret;
exports.registerUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const fName = req.body.fName;
    const lName = req.body.lName;
    const phone = req.body.phone;
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            const user = new User(email, hashedPw, fName, lName, phone);
            return user.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Registration Successful",
            });
        })
        .catch(err => {
            if (err.code === 'ER_DUP_ENTRY') {
                err.statusCode = 409
            }
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.loginUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const userId = req.body.emailPhone;
    const password = req.body.password;
    let userData;
    User.getUser(userId)
        .then(([rows, fieldData]) => {
            if (rows.length === 0) {
                const error = new Error('Entered email or phone not found in records');
                error.statusCode = 404;
                throw error;
            }
            userData = rows[0];
            return bcrypt.compare(password, rows[0].password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Incorrect Password');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    userId: userData.id,
                    email: userData.email
                },
                jwtSecret,
                { expiresIn: '1d' }
            );
            res.status(200).json({
                message: "Login Successful",
                token: token,
                id: userData.id,
                f_name: userData.f_name,
                l_name: userData.l_name,
                email: userData.email,
                phone: userData.phone
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}