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


let uselessConversion = (type, val) => {let value = msToMicrocenturies(val);return {name: "microcenturies", value: msToMicrocenturies(value)}};






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




module.exports = {
    uselessConversion: uselessConversion,
}
