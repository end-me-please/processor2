let {command} = require("./messageHandler.js"); 

class dataPoint {
    constructor() {
        this.time = Date.now();
        this.memory = process.memoryUsage.rss();
        //get discord.js stats
        this.channelCount = client.channels.cache.size;
        this.guildCount = client.guilds.cache.size;
        this.userCount = client.users.cache.size;
        
        this.commandCount = Object.keys(command.list).length;
    }
}

data = [];
let dataInterval = setInterval(() => {
    data.push(new dataPoint());
    if (data.length > 25) {
        data.shift();
    }
}, 1000);


function normalize(array){
    let max = 0;
    for(let i=0;i<array.length;i++){
        if(array[i]>max){
            max = array[i];
        }
    }
    let newArray = [];
    for(let i=0;i<array.length;i++){
        newArray.push(array[i]/max);
    }
    console.log(newArray);
    return newArray;
}
/*
function getDiagram(array){
    //console.log(array);
    let diagram = [];
    let normalized = normalize(array);
    for(let i=0;i<normalized.length;i++){
        diagram.push("▁▂▃▄▅▆▇█"[Math.floor(normalized[i]*7.99)]);
    }
    console.log(diagram);
    return "```"+diagram.join("")+"```";
}
*/
function getDiagram(array){
    let row1=[];
    let row2=[];
    let normalized = normalize(array);
    let diagramChars = "▁▂▃▄▅▆▇█";
    for(let i=0;i<array.length;i++){
        //if value is greater than 0.5, add a "█" to row1
        let row1Value = normalized[i]>0.5?diagramChars[Math.floor(normalized[i]*7.99)]:" ";
        let row2Value = normalized[i]>0.5?diagramChars[7]:diagramChars[Math.floor(normalized[i]*7.99)];
        row1.push(row1Value);
        row2.push(row2Value);
    }
    let diagram = "```"+row1.join("")+"\n"+row2.join("")+"```";
    return diagram;
}



function botStatCmd(handler){
    if(data.length<2){
        handler.textReply("not enough data");
        return;
    }
    //get diagrams for every stat
    let memoryDiagram = getDiagram(data.map(d => d.memory));
    let channelCountDiagram = getDiagram(data.map(d => d.channelCount));
    let guildCountDiagram = getDiagram(data.map(d => d.guildCount));
    let userCountDiagram = getDiagram(data.map(d => d.userCount));
 
    let statList = "";
    statList += "memory: "+memoryDiagram+"\n";
    statList += "channels: "+channelCountDiagram+"\n";
    statList += "guilds: "+guildCountDiagram+"\n";
    statList += "users: "+userCountDiagram;
    handler.listEmbedReply("bot stats", "various performance-related info", statList);
}
let statCmdObj = new command("stats", botStatCmd, ["string"], "info", false);
command.load(statCmdObj);








