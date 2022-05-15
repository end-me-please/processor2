const {command}=require("../util/messageHandler.js");
const quotes = ["you cannot kill me in a way that matters.", "just think, every step taken is another soul left behind", "everything burns every single day until it's reduced to dust", "this doesn't end well", "you think you're safe?", "one cannot create beauty without destruction", "every single moment has consequence", "you wouldn't want anyone to know what you're hiding.", "where are you right now? what do you fear?", "it doesn't make sense to save now.", "it's too late.", "where is it.", "there is no threat", "it's always been there", "never make another wish ever again.", "where are you right now?", "why? it will never end now.", "do not.", "they are not your enemy", "this is your fault.", "we are not dead yet.", "it's finally happening", "please verify your humanity", "no one will matter", "this is not a matter of caring.", "are you okay with what you just did?", "stop reading this.", "watch your head.", "if you see this", "do not look at it", "observation is prohibited.", "your mind is nonexistent"];

genquote=(length,altQuotes=quotes)=>{
  result = "";
  for(i = 0; i < length; i++){
    let quote = randomElement(altQuotes).split(" ");
    from = Math.floor(Math.random()*Math.max(quote.length - 3, 0));
	to = Math.floor(Math.random() * (quote.length - 1 - from)) + from; 
    //to = Math.floor((Math.random()*(quote.length-1)))+from;
    for(j = from; j <= to; j++){
      result += quote[j] + " ";
    }
  };
  return result;
};
function randomElement(arr){
	return arr[Math.floor(Math.random()*arr.length)];
}

function msCmd(handler){
    let length = handler.args[0]||10;
    let quote = genquote(handler.args[0]);
    handler.textReply(quote);
}
let ms = new command("ms", msCmd, ["number"], "message source", "general", false);
command.load(ms);



module.exports={
  quotes:quotes,
}