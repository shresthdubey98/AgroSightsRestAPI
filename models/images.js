const db = require("../util/database");

module.exports = class Images {
    
    constructor(u_id, q_id, imageList) {
        this.u_id = u_id;
        this.q_id = q_id;
        this.imageList = imageList;
    }

    save() {
        let qry = "";
        this.imageList.forEach(image => {
            qry = qry+`INSERT INTO \`q_attachments\`(\`u_id\`, \`q_id\`, \`file_name\`, \`file_type\`) VALUES (\'${this.u_id}\', \'${this.q_id}\', \'${image.filename}\', \'${image.mimetype}\');`
        });
        return db.query(
            qry
        );
    }
};