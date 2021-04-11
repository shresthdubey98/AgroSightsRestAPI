const { Result } = require("express-validator");
const db = require("../util/database");

module.exports = class Tags {
    
    constructor(q_id, tagList) {
        this.q_id = q_id;
        this.tagList = tagList;
    }

    save() {
        let qry = "";
        this.tagList.forEach(tag => {
            qry = qry+`INSERT IGNORE INTO \`tags\` (\`tag_name\`) VALUES('${tag}');`
        });
        db.query(qry)
        .then(([rows, fieldData])=>{
            let inStatement = "";
            this.tagList.forEach(tag => {
                inStatement = inStatement + `'${tag}',`;
            });
            inStatement = inStatement.slice(0, -1);
            qry = `INSERT INTO q_tags (q_id, t_id) SELECT ${this.q_id}, id FROM tags WHERE tag_name IN (${inStatement})`;
            console.log(qry)
            return db.query(qry);
        })
        .catch(er=>{
            const err = new Error("Tag Insert Failed");
            err.statusCode = 500;
            throw err;
        });;
    }
};