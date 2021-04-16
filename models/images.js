const db = require("../util/database");

module.exports = class Images {
    
    constructor(u_id, q_id, imageList) {
        this.u_id = u_id;
        this.q_id = q_id;
        this.imageList = imageList;
    }

    save() {
        let qry = "";
        let i;
        console.log(this.imageList.image1);
        for(i= 1; i<=5; i++){
            const name = "image"+i;
            if(this.imageList[name]){
                const image = this.imageList[name][0];
                qry = qry+`INSERT INTO \`q_attachments\`(\`u_id\`, \`q_id\`, \`file_name\`, \`file_type\`) VALUES (\'${this.u_id}\', \'${this.q_id}\', \'${image.filename}\', \'${image.mimetype}\');`;
            }
        }
        console.log(qry);
        return db.query(
            qry
        );
    }
};