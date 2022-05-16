function msToMicrocenturies(ms) {
    ms = ms / 1000;
    ms = ms / 60;
    ms = ms / 60;
    ms = ms / 24;
    ms = ms / 365.25;
    ms = ms / 100;
    ms=Math.floor(ms*100)/100;
    return {time: ms, unit: "microcenturies"};
}

function msToLightmeters(ms) {
    let seconds = ms / 1000;
    const c = 299792458;
    let lightmeters = seconds * c;
    lightmeters = Math.floor(lightmeters * 100) / 100;
    return {time: lightmeters, unit: "lightmeters"};
}

class unit {
    constructor(name, type, baseConversion) {
        this.type = type;
        this.name = name;
        this.baseConversion = baseConversion;
    }
    convert(value) {
        return (this.baseConversion/value);
    }
}

function uselessConversion(type,value) {
    value=value/1000;
    let typeUnits = units.filter(unit => unit.type === type);

    let possibleUnits = typeUnits.map(u => {
    return Object.entries(powers).map(power=>{
        let powerConversion = u.convert(value)*power[1];
        powerConversion = Math.floor(powerConversion * 100) / 100;
        let stringName = power[0]+"-"+u.name;
        return {name:stringName,value:powerConversion};
    })
    });
    possibleUnits = possibleUnits.flat(2);
    possibleUnits = possibleUnits.filter(u => { return (u.value<1600 && u.value>0.5)});    
    //select random unit
    let randomUnit = possibleUnits[Math.floor(Math.random() * possibleUnits.length)];
    return randomUnit;
}


function convert(unitName,value) {
    value=value/1000;
    console.log(value);
    let typeUnits = units.filter(unit => unit.name === unitName);

    let possibleUnits = typeUnits.map(u => {
    return Object.entries(powers).map(power=>{
        let powerConversion = u.convert(value)*power[1];
        console.log(power[1],u.convert(value),powerConversion);
        //powerConversion = Math.floor(powerConversion * 100) / 100;
        let stringName = power[0]+"-"+u.name;
        return {name:stringName,value:powerConversion};
    })
    });
    console.log(possibleUnits);
    possibleUnits = possibleUnits.flat(2);
    possibleUnits = possibleUnits.filter(u => { return (u.value<1600 && u.value>0.005)});    
    //select random unit
    let randomUnit = possibleUnits[Math.floor(Math.random() * possibleUnits.length)];
    return randomUnit;
}







let powers = {
    "yotta": 1e24,
    "zetta": 1e21,
    "exa": 1e18,
    "peta": 1e15,
    "tera": 1e12,
    "giga": 1e9,
    "mega": 1e6,
    "kilo": 1e3,
    "hecto": 1e2,
    "deka": 1e1,
    "deci": 1e-1,
    "centi": 1e-2,
    "milli": 1e-3,
    "micro": 1e-6,
    "nano": 1e-9,
    "pico": 1e-12,
    "femto": 1e-15,
    "atto": 1e-18,
    "zepto": 1e-21,
    "yocto": 1e-24
}


let units = [
    new unit("seconds", "time", 1),
    new unit("minutes", "time", 60),
    new unit("hours", "time", 3600),
    new unit("days", "time", 86400),
    new unit("weeks", "time", 604800),
    new unit("months", "time", 2629746),
    new unit("years", "time", 31556952),
    new unit("decades", "time", 31556952 * 10),
    new unit("centuries", "time", 31556952 * 100),
    new unit("millennia", "time", 31556952 * 1000),
    new unit("lightmeters", "time", 1 / 299792458),
    new unit("electrons*ampere^-1", "time", 1.602176634e-19),
    new unit("soundmeters", "time", 1 / 343.2),
    new unit("football fields at mach 2", "time", 91.44/(343.2*2)),
    new unit("fortnights", "time", 604800 * 2),
    new unit("martian days", "time", 86400 * 1.02737850787),
    new unit("jupiter days", "time", 3600 * 9.925),
    new unit("moments", "time", 90),
    new unit("dog years", "time", 7 * 365 * 24 * 60 * 60),
    new unit("cold cups of coffee", "time", 60*15),
    new unit("pizza oven times", "time", 60*13),
    new unit("half-lifes of plutonium-239", "time", 24110*365.25*24*60*60),
    new unit("heartbeats", "time", 1.3),
];

function stringToUnit(string) {
    //split into powers, unit and value as returned by uselessConversion
    let split = string.split(" ");
    let value = split[0];
    //power is separated by a dash
    let power = 1;
    //if there is a power, split it
    if (split[1].includes("-")) {
        let powerSplit = split[1].split("-");
        if(Object.keys(powers).includes(powerSplit[0])){
        power = powers[powerSplit[0]];
        }
        else{
            throw "unknown format"
        }
    }
    let unitName="seconds";
    //unit can have spaces
    if(string.includes("-")){
    unitName = string.split("-")[1];    
    }else{
        let split2=split;
        split2.shift();
        unitName=split2.join(" ");
    }

    let unitType = units.find(u => u.name === unitName);
    if(!unitType){
        throw "unknown format/unit";
    }
    let baseConversion = unitType.baseConversion;
    //parse value as float
    let fvalue = parseFloat(value);
    //convert to base unit
    let baseValue = (((baseConversion*power))*fvalue);
    let returnObj = {power:power, value:baseValue, unit:unitType.name};
    return returnObj;
}






module.exports = {
    convert: convert,
    uselessConversion: uselessConversion,
    stringToUnit: stringToUnit,
    units: units,
}
