let command = require("../messageHandler.js").command;


function nsfwCmd(handler){
    handler.textReply("Pong!",true);
}
let nsfw = new command("nsfw",nsfwCmd,["word"],"obtain images","nsfw",fals,true);







