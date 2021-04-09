const db = require("../util/database");

module.exports = class Tag {
    constructor(name) {
        this.name = name;
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