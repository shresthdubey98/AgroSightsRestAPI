const { param } = require("express-validator");
const db = require("../util/database");
const path = require('path');

module.exports = class Question {
    
    constructor(u_id,  title, question) {
        this.u_id = u_id;
        this.title = title;
        this.question = question;
    }

    save() {
        return db.execute(
            'INSERT INTO `questions` (`u_id`, `title`, `question`) VALUES (?, ?, ?);',
            [this.u_id, this.title, this.question]
        );
    }
    static getPagedQuestions(pageNo) {
        return db.execute(`SELECT q.id, q.u_id, q.title, q.question, u.f_name, u.l_name, q.upvotes, q.downvotes from questions q, users u where q.u_id = u.id limit ${(pageNo-1)*10}, 10`);
    }
    
};