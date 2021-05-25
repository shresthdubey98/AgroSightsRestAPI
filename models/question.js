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

    static getQuestionById(q_id, auth_u_id){
        return db.execute(
            `SELECT q.*, u.f_name as u_f_name, u.l_name as u_l_name,
        CASE
            WHEN (SELECT count(*) FROM q_upvotes WHERE u_id = ${auth_u_id} and q_id = ${q_id}) > 0 THEN True
            ELSE False
        END AS has_my_upvote,
        CASE
            WHEN (SELECT count(*) FROM q_downvotes  WHERE u_id = ${auth_u_id} and q_id = ${q_id}) > 0 THEN True
            ELSE False
        END AS has_my_downvote
        FROM questions as q, users AS u 
        WHERE 
            u.id = q.u_id AND
            q.id = ${q_id}`
        )
    }
    static setVote(auth_u_id, q_id, is_vote_up){
        let qry;
        if (is_vote_up){
            qry = `
            UPDATE questions SET upvotes = upvotes + 1 WHERE id = ${q_id};
            INSERT INTO q_upvotes(u_id, q_id) VALUES (${auth_u_id},${q_id});
            `;
        }else{
            qry = `
            UPDATE questions SET downvotes = downvotes + 1 WHERE id = ${q_id};
            INSERT INTO q_downvotes (u_id, q_id) VALUES (${auth_u_id},${q_id});
            `;
        }
        return db.query(qry);
    }
    static revokeVote(auth_u_id, q_id, is_vote_up){
        let qry;
        if (is_vote_up){
            qry = `call remove_question_upvote(${auth_u_id}, ${q_id})`;
        }else{
            qry = `call remove_question_downvote(${auth_u_id}, ${q_id})`;
        }
        console.log(qry);
        return db.query(qry);
    }
    
};