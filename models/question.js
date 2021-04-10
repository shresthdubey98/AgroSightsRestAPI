const { param } = require("express-validator");
const db = require("../util/database");
const path = require('path');

module.exports = class Question {
    
    constructor(u_id,  question, tagList) {
        this.name = u_id;
        this.question = question;
        this.tagList = tagList;
        
    }

    save() {
        return db.execute(
            'INSERT INTO `tags` (`tag_name`) VALUES (?);',
            [this.name]
        );
    }
    static getTagById(tagId) {
        return db.execute("SELECT tag_name FROM tags WHERE id = ?",
                [tagId]
            );
    }
    static getAllTags(){
        return db.execute("SELECT * FROM tags;");
    }
    
};