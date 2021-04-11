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
    // static getTagById(tagId) {
    //     return db.execute("SELECT tag_name FROM tags WHERE id = ?",
    //             [tagId]
    //         );
    // }
    // static getAllTags(){
    //     return db.execute("SELECT * FROM tags;");
    // }
};