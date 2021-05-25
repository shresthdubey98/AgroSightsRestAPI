const { param } = require("express-validator");
const db = require("../util/database");
const path = require('path');

module.exports = class Answer {

    constructor(u_id, q_id, ans) {
        this.u_id = u_id;
        this.q_id = q_id
        this.ans = ans;
    }

    save() {
        const qry =
            `INSERT INTO answers (u_id,q_id,answer) VALUES (?, ?, ?);`
        // console.log(qry);
        return db.execute(qry, [this.u_id, this.q_id, this.ans]);
    }
    static getAnswers(q_id) {
        return db.execute(`SELECT a.id, a.u_id, a.answer, u.f_name, u.l_name, a.upvotes, a.downvotes from answers a, users u where a.u_id = u.id and a.q_id = ${q_id}`);
    }

    static setVote(auth_u_id, a_id, is_vote_up) {

        let qry;
        if (is_vote_up) {
            qry = `
            UPDATE answers SET upvotes = upvotes + 1 WHERE id = ${a_id};
            INSERT INTO a_upvotes(u_id, a_id) VALUES (${auth_u_id},${a_id});
            `;
        } else {
            qry = `
            UPDATE answers SET downvotes = downvotes + 1 WHERE id = ${a_id};
            INSERT INTO a_downvotes (u_id, a_id) VALUES (${auth_u_id},${a_id});
            `;
        }
        return db.query(qry);
    }
    static revokeVote(auth_u_id, a_id, is_vote_up) {
        let qry;
        if (is_vote_up) {
            qry = `call remove_answer_upvote(${auth_u_id}, ${a_id})`;
        } else {
            qry = `call remove_answer_downvote(${auth_u_id}, ${a_id})`;
        }
        console.log(qry);
        return db.query(qry);
    }
    static getAnswerVoteByUId(u_id, a_id) {
        return db.execute(
            `SELECT ${u_id} as u_id, ${a_id} as a_id, 
            (SELECT COUNT(*) FROM a_upvotes where u_id = ${u_id} and a_id = ${a_id}) as upvote,
            (SELECT COUNT(*) FROM a_downvotes where u_id = ${u_id} and a_id = ${a_id}) as downvote FROM DUAL`
        );
    }

};