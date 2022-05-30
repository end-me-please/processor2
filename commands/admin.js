const {command, client} = require("../util/messageHandler.js");


async function evalCommandFunc(handler) {
    let code = handler.args[0];
    let outputString = "result: ```";
    let output=null;

    try {
    output = eval(code);
    } catch (e) {output=e;}

    //check if output is a promise
    if (output instanceof Promise) {
        output = await output;
    }

    if(output==null){
        output="no output";
    }

    //check if output.toString() would be [object Object]
    if (output.toString() === "[object Object]") {
        outputString += JSON.stringify(output);
    } else {
        outputString += output;
    }
    outputString += "```";
    //check if outputString is too long
    if (outputString.length > 2000) {
        output="output too long";
    }

    handler.textReply(outputString);
}

let evalCommand=new command("eval",evalCommandFunc,["string"],"evaluate js","admin",true);
command.load(evalCommand);

//read stdin
process.stdin.resume();
process.stdin.setEncoding('utf8');
//allow sending commands from stdin
process.stdin.on('data', function (text) {
    if (text.trim() === "exit") {
        process.exit();
    };
    //split into words
    let words = text.split(" ");
    if(words[0]=="echo"){
        client.channels.cache.get("935956434259177483").send(words.slice(1).join(" "));        
    }

});















