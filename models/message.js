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
            "INSERT INTO messages(from_id, to_id, type, data) VALUES(?,?,?,?);"
        // console.log(qry);
        return db.query(qry, [this.from_id, this.to_id, this.type, this.data]);
    }
    static getPagedMessages(f_id, t_id, pageNo) {
        return db.execute(`SELECT * from messages where 
        (to_id = ${t_id} and from_id = ${f_id}) OR 
        (from_id = ${f_id} and to_id = ${t_id}) 
        ORDER BY date_created desc limit ${(pageNo-1)*100}, 100`);
    }
    static getAllMessages(f_id, t_id) {
        return db.execute(`SELECT * from messages where 
        (to_id = ${t_id} and from_id = ${f_id}) OR 
        (to_id = ${f_id} and from_id = ${t_id}) 
        ORDER BY date_created asc `);
    }
    static getDialogsMetaData(u_id){
        return db.execute(`Select distinct to_id, from_id from messages where from_id = ${u_id} or to_id = ${u_id} ORDER BY date_created desc`);
    }
    static getDialogData(f_id, t_id){
        const qry = `SELECT DISTINCT m.from_id, m.to_id, 
        (SELECT type FROM messages where (
            from_id = ${t_id} AND to_id = ${f_id}
        ) OR (
            from_id = ${f_id} AND to_id = ${t_id}
        ) ORDER BY date_created desc LIMIT 1) as type,
        (SELECT  data FROM messages where (
            from_id = ${t_id} AND to_id = ${f_id}
        ) OR (
            from_id = ${f_id} AND to_id = ${t_id}
        ) ORDER BY date_created desc LIMIT 1) as data
        , m.seen, 
        (SELECT COUNT(*) FROM messages WHERE from_id = ${t_id} AND to_id = ${f_id} AND seen = 0) as unseen_count
        , 
        (SELECT f_name FROM users where id = ${t_id}) as f_name, 
        (SELECT l_name FROM users where id = ${t_id}) as l_name 
        from messages m, users u WHERE u.id = m.to_id AND 
        (m.from_id = ${f_id} AND m.to_id = ${t_id})
        OR (m.from_id = ${t_id} AND m.to_id = ${f_id})
        ORDER BY m.date_created desc LIMIT 1`;
        console.log(qry);
        return db.execute(qry);
    }
    static resetSeenCount(from_id, to_id){
        const qry = `UPDATE messages SET seen = 1 WHERE from_id = ${from_id} AND to_id = ${to_id} AND seen = 0`
        console.log(qry);
        db.execute(qry);
    }
};