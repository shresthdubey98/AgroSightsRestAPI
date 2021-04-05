const db = require("../util/database");

module.exports = class User {
    constructor(email, hPassword, fName, lName, phone) {
        this.email = email;
        this.hPassword = hPassword;
        this.fName = fName;
        this.lName = lName;
        this.phone = phone;
    }

    save() {
        return db.execute(
            'INSERT INTO users (email, password, f_name, l_name, phone) VALUES (?, ?, ?, ?, ?)',
            [
                this.email,
                this.hPassword,
                this.fName,
                this.lName,
                this.phone
            ]
        );
    }
    static getUser(userId){
        if (isNaN(userId)){
            //get user by email
            console.log(userId);
            return db.execute("SELECT * FROM users WHERE email = ?",
                [userId]
            );
        }else{
            //get user by phone
            return db.execute("SELECT * FROM users WHERE phone = ?",
                [userId]
            );
        }
    }
    
    // static deleteById(id) { }

    // static fetchAll() {
    //     return db.execute('SELECT * FROM products');
    // }

    // static findById(id) {
    //     return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    // }
};