//const { client, command, addMessageListener } = require("../util/messageHandler");

const {command, addMessageListener} = require("../util/messageHandler.js");







class markovChain{
constructor(lookbehind=[1,0.3]){
this.lookbehind = lookbehind;
this.startWords = [];
this.endWords = [];
this.chains = [];
this.maxLength = 99;
this.rng=rand2();
for(let i=0;i<lookbehind.length;i++){
    this.chains.push(null);
}
}
setSeed(seed){
this.rng=rand2(seed);
}



analyze(text){
    let words = text.split(" ");
    let start = words[0];
    let end = words[words.length-1];
    this.startWords.push(start);
    this.endWords.push(end);
    for(let i=0;i<this.chains.length;i++){
        let chain = this.chains[i];
        if(!chain){
            chain = {};
            this.chains[i] = chain;
        }
        for(let j=0;j<words.length;j++){
            let word = words[j-i-1];
            if(word==undefined){continue};
            if(!chain[word]){
                chain[word] = [];
            }
            let nextWord = words[j];
            if(nextWord==undefined){continue};
            chain[word].push(nextWord);
        }
    }
}
generate(minLength=7,start=undefined,mustInclude=[]){
    
    let getstart=()=>{
        if(start){
            return start;
        }
        let random = Math.floor(this.rng.next().value*this.startWords.length);
        return this.startWords[random];
    }

    let words = [getstart()];    
    let word = words[0];
    let startTime = Date.now();
    while(startTime+4000>Date.now()){
        

        let options = this.chains[0][word];
       
        for(let i=0;i<this.chains.length;i++){
            let chance = this.lookbehind[i];
            let chain = this.chains[i];
            options=options||[];
            options = options.filter(w=>{

                if(chance<this.rng.next().value){
                    console.log("skipping filter "+i);
                    return true;
                }
                if(!chain.hasOwnProperty(w)){
                    return false;
                }
                let set = chain[w];
                if(set.length==0){
                    return false;
                }
                return true;
            });
        }

        if(options.length==0){
            console.log("no options");
            if(checkValid(words,this)){
                return words.join(" ");
            }
            //reset
            words = [getstart()];
            word = words[0];
            continue;
        }

        //console.log(options);
        let possibleEndings=options.filter(w=>{
            //return this.endWords.includes(w);
            let isSentenceEnd=w.endsWith(".")||w.endsWith("?")||w.endsWith("!");
            //let isEndWord=this.endWords.includes(w);
            return isSentenceEnd;
            //return isSentenceEnd||isEndWord;
        });
        let canEnd=false;
        if(possibleEndings.length>0&&words.length>minLength){
            console.log("potential ending..");
            canEnd=true;
            options = possibleEndings;
        }

        
        let random = Math.floor(this.rng.next().value*options.length);
        let nextWord = options[random];
        words.push(nextWord);
        word = nextWord;

        if(!words[words.length-1]){
            words.pop();
        }
        let valid = checkValid(words,this);
        if(valid){
            console.log("valid!");
            break;
        }
        let invalid = checkInvalid(words,this);
        if(invalid){
            console.log("invalid. resetting");
            //remove the last 2 words, if neccessary generate a new start word
            words=[getstart()];
            word = words[words.length-1];
        }
    }
    return words.join(" ");
    function checkValid(words,thing){
        let containsAll = true;
        for(let i=0;i<mustInclude.length;i++){
            if(words.indexOf(mustInclude[i])==-1){
                containsAll = false;
            }
        }
        let lengthOk = words.length>=minLength&&words.length<=thing.maxLength;
        //check if last word is in this.endWords
        let lastWord = words[words.length-1]+"";
        let lastWordOk = thing.endWords.indexOf(lastWord)!=-1;
        let lastWordOk2 = lastWord.endsWith(".")||lastWord.endsWith("?")||lastWord.endsWith("!");
        lastWordOk = lastWordOk||lastWordOk2;
        let noUndefinedOrNull = words.indexOf(undefined)==-1&&words.indexOf(null)==-1;
        if(containsAll&&lengthOk&&lastWordOk&&noUndefinedOrNull){
            return true;
        }
        return false;
    }
    function checkInvalid(words, thing){
        //console.log(words);
        let containsNullOrUndefined = words.indexOf(undefined)!=-1||words.indexOf(null)!=-1;
        let tooLong = words.length>thing.maxLength;
        let grammarError = false;
        for(let i=1;i<words.length;i++){
            let previousWord = words[i-1];
            let nextWord = words[i];
            try{
            if(!thing.chains[0][previousWord].includes(nextWord)){
                console.log("grammar error", words);
                grammarError = true;
            }
            }catch(e){console.log("ohno");grammarError=true;}
        }
        if(containsNullOrUndefined){
            console.log("contains null or undefined");
            return true;
        }
        if(tooLong){
            console.log("too long");
            return true;
        }
        if(grammarError){
            console.log("grammar error");
            return true;
        }
        return false;        
    }

    }
}
let quotes = ["you cannot kill me in a way that matters.",
"just think, every step taken is another soul left behind",
"everything burns every single day until it's reduced to dust",
"this doesn't end well",
"you think you're safe?",
"one cannot create beauty without destruction",
"every single moment has consequence",
"you wouldn't want anyone to know what you're hiding.",
"where are you right now? what do you fear?",
"it doesn't make sense to save now.",
"it's too late.",
"where is it.",
"there is no threat",
"it's always been there",
"never make another wish ever again.",
//"where are you right now?",
"why? it will never end now.",
"do not.",
"they are not your enemy",
"this is your fault.",
"we are not dead yet.",
"it's finally happening",
"please verify your humanity",
"no one will matter.",
"this is not a matter of caring.",
"are you okay with what you just did?",
"stop reading this.",
"watch your head.",
"if you see this",
"do not look at it",
"observation is prohibited.",
"your mind is nonexistent",

"this is not a matter of concern.",
"it's not a matter of concern.",
"you are not a matter of concern.",
"it's now or never.",
"no one will ever know.",
"do not worry.",
"don't worry.",
"why worry.",
"please stop observing.",
"never look at it.",
"you are your own worst enemy.",
"stop thinking.",
"this is your last chance.",
"watch, this will end.",
"they will never know.",
"where do you think you are going?",
"everything will be okay.",
"we will be okay.",
"your mind is gone.",
"it will never go away.",
"why bother?",
"observe.",
"stop.",
"stop observing.",
"stop looking at it.",
"you matter less than you think.",
"you will never know.",
"you made a mistake.",
"you are not ready for this.",
];
quotes=quotes.concat([
    "Thankful to have you as a crewmate… but do you want to add a letter and become screwmates instead?",
    "Hey, are you one of my tasks? Because I really want to do you.",
    "Hey, are you a vent? Because I’m the imposter and I’d love to come in you.",
    "I have a lot of tasks to complete still, but I’d love to do you first.",
    "Hey, call me the MedBay… because I’d love to scan your body.",
    "Figuring out the imposter is hard…. but I’ve got something harder.",
    "I’m jealous of your hat… Because it gets to be on you.",
    "Hey are you busy later? Because I’d love to explore your lower engine.",
    "Hey, you’re done your tasks right? Wanna come explore my cockpit then?",
    "If you’re the imposter, I’d love to be the vent… That way you can come inside me whenever you want.",
    "Damn, I wish you were a task… Because I’d have no problem doing you and over and over.",
    "Hey did you just kill me? Because I’ve got a big bone sticking out now…",
    "Did you sabotage O2? beause you are taking my breath away.",
    "Hey, are you a vent? Because I’d love to come in you.",
    "Getting called sus in Among us is a completely new type of pain. Especially when you're innocent.",
    "what do you call an italian playing among us? Impasta.",
  ])



let markov = new markovChain([1,0.8,0.7,0.6,0.5,0.4,0.3]);
quotes.forEach(q=>{
    markov.analyze(q);
});

//check if a variable called "client" exists
if(typeof client=="undefined"){
let sus = [];
for(let i=-2;i<40;i++){
    markov.setSeed(i*3);
    sus.push(markov.generate(10));
}
console.log(sus);
}else{
    addMessageListener(processMessage);

    
    function quoteCmd(handler){
        //check for handler.flags
        //following flags:
        //seed: set seed
        //length: set min length (throw error if above 100)
        //contains: set mustInclude
        //start: set the start word, overrides first argument

        let seed = parseInt(handler.flags.seed);
        if(isNaN(seed)){
            seed = Math.floor(Math.random()*100);
        }
        markov.setSeed(seed);

        let minLength = parseInt(handler.flags.min)||1;
        if(isNaN(minLength)){
            minLength = 1;
        }
        if(minLength>100){
            minLength=100;
        }
        

        let mustInclude = [];
        if(handler.flags.contains){
        mustInclude = [handler.flags.contains];
        }
        
        let start = handler.args[0];
        if(handler.flags.start){
            start = handler.flags.start;
        }
        if(start==""||start==undefined||start==null){
            start = undefined;
        }
        let result = markov.generate(minLength, start, mustInclude);
        handler.channelSendText(result);
    }
    let quote = new command("quote",quoteCmd,["word"],"generates a random quote","fun");
    command.load(quote);


    function processMessage(msg){
        let text = msg.content;
        if(text==""){
            return;
        }
        if(text==undefined){
            return;
        }
        if(text.startsWith("!")){
            return;
        }
        if(text.startsWith("p1")){
            return;
        }
        if(text.startsWith("p2")){
            return;
        }
        if(text.startsWith("sw")){
            return;
        }
        if(text.startsWith("owo")){
            return;
        }
        markov.analyze(text);
    }
}





//pseudorandom number generator with seed
function* rand2(seed=512213124120){
    let x = seed;
    while(true){
        x = (x*x)%(2**31-1);
        yield x/2**31;
    }
}  
