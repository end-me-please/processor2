/*
//check if database exists in ../config/database
let fs = require("fs");
if(!fs.existsSync("./config/database")){
    startupLog += `\n\nDatabase file not found.`;
    startupLog += `\nCreating database file in ./config/database`;
    fs.writeFileSync("./config/database", "", "utf8");
}

//do sqlite3 stuff
let sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./config/database");

//check if table exists
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row)=>{
    if(err){
        startupLog += `\n\nError: ${err}`;
        startupLog += `\nCreating table users`;
        db.run("CREATE TABLE users (id TEXT, data TEXT)");
    }
}
);
*/


class userdata {
    constructor(id){
        this.id = id;
        this.data = {};
    }
    getData(){
        return this.data;
        let data = db.get("SELECT data FROM users WHERE id=?", this.id);
        if(data){
            return JSON.parse(data.data);
        } else {
            return {};
        }
    }
    setData(data){
        this.data=data;
        //db.run("INSERT OR REPLACE INTO users (id, data) VALUES (?, ?)", this.id, JSON.stringify(data));
    }

    static get(id){
        let newUser = new userdata(id);
        if(newUser.data==null||newUser.data==undefined||newUser.data=={}){
            newUser.data = {
                sentiment: {
                    score: 0,
                    messages: 0
                },
                inventory: {
                    items: [],
                    resources : {}
                }
                //add new fields here

            };
        }
        return newUser;
    }
}


module.exports = {
    userdata: userdata
};




