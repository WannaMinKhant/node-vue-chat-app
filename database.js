const mysql = require("mysql2")
let db = null;

class DB{
    constructor(){
        db = mysql.createConnection({
            host:"localhost",
            user: "root",
            password:"",
            database: "advance-chat-app"
        });

        db.connect((err) =>{
            if(err) console.log(err)
        })
    }

    addUser(data){
        return new Promise(async(resolve, reject) =>{
            if(await this.isUserExist(data)){
                resolve(true)
            }else{
                db.execute(
                    "INSERT INTO users (name, user_id) VALUES(?,?)",[data.name, data.user_id],(err, rows) =>{
                        if(err) reject(new Error(err))
                        else resolve(rows)
                    }
                )
            }
        })
    }

    isUserExist(data){
        return new Promise(async(resolve, reject) =>{
            db.execute(
                "SELECT * FROM users WHERE name = ?",[data.name],(err, rows)=>{
                    if(err) reject(new Error(err))
                    else resolve(rows[0])
                }
            )
        })
    }

    fetchUserMessages(data){
        const messages = [];
        return new Promise(async(resolve, reject) =>{
            db.query(
                "SELECT * FROM messages WHERE name = ?",[data.name],(err, rows) =>{
                    if(err) reject(new Error(err))
                    else resolve(rows)
                }
            )
        })
    }

    storeUserMessage(data){
        return new Promise(async(resolve, reject) =>{
            db.query(
                "INSERT INTO messages (message,user_id,name) VALUES (?,?,?)",
                [data.message, data.user_id,data.name],(err, rows)=>{
                    if(err) reject(new Error(err))
                    else resolve(rows)
                }
            )
        })
    }
}

module.exports = DB;