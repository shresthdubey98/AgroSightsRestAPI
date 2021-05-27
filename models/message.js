const db = require("../util/database");
const path = require('path');

module.exports = class Message {

    constructor(from_id, to_id, type, data) {
        this.from_id = from_id;
        this.to_id = to_id;
        this.type = type;
        this.data = data;
    }

    save() {
        const qry =
            `INSERT INTO messages('from_id','to_id', 'type', 'data') VALUES(?,?,?,?);`
        // console.log(qry);
        return db.execute(qry, [this.from_id, this.to_id, this.type, this.data]);
    }
    static getPagedMessages(f_id, t_id, pageNo) {
        return db.execute(`SELECT * from messages where 
        (to_id = ${t_id} and from_id = ${f_id}) OR 
        (from_id = ${f_id} and to_id = ${t_id}) 
        ORDER BY date_created desc limit ${(pageNo-1)*100}, 100`);
    }
    static getDialogsMetaData(u_id){
        return db.execute(`Select distinct to_id from messages where from_id = ${u_id} ORDER BY date_created desc`);
    }
    static getDialogData(f_id, t_id){
        return db.execute(`SELECT m.from_id, m.to_id, m.type, m.data, m.seen, 
        (SELECT COUNT(*) FROM messages WHERE from_id = ${f_id} AND to_id = ${t_id} AND seen = 0) as unseen_count
        , u.f_name, u.l_name from messages m, users u WHERE u.id = m.to_id AND m.from_id = ${f_id} AND m.to_id = ${t_id} 
        ORDER BY m.date_created desc LIMIT 1`);
    }


};