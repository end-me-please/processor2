const fs = require('fs');

if(!fs.existsSync('./data')) {
    startupLog+='no data folder found, creating one...\n';
    fs.mkdirSync('./data');
}

if(!fs.existsSync('./data/data.json')) {
    startupLog+='no data.json file found, creating one...\n';
    fs.writeFileSync('./data/data.json', '{}');
}
if(!fs.existsSync('./data/economy.json')) {
    startupLog+='no economy.json file found, creating one...\n';
    fs.writeFileSync('./data/economy.json', '{}');
}




class permanentStorage {
    constructor(file) {
        this.file = file;
        this.data = JSON.parse(fs.readFileSync(file));
    }
    get(key) {
        return this.data[key];
    }
    set(key, value) {
        this.data[key] = value;
        fs.writeFileSync(this.file, JSON.stringify(this.data));
    }
}

let storage = new permanentStorage('./data/data.json');

module.exports = {
    storage: storage,
    player: player
}


class player {
    constructor(id) {
        this.id = id;
        this.data = storage.get(id);
        if(!this.data) {
            this.data = {
                inventory: [],	
                resources: {},
                sentiment: {score:0,messages:0},
            };
            storage.set(id, this.data);
        }
    }
    save() {
        storage.set(this.id, this.data);
    }
    static getPlayer(id) {
        return new player(id);
    }
}












