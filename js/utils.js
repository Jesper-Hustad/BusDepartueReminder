export function paramToString(paramaters){
    return new URLSearchParams(paramaters).toString()
}


export async function fetchJson(url,paramaters){

    return await fetch(url, paramaters)
        .then(response => response.json())
        .catch((error) => {
            console.error('Error:', error);
            return null
        });
}


export function minutesToDate(date){
    let diff = date - Date.now(); //returns millesecond difference between dates
    return Math.floor(diff / 1000 / 60) //milleseconds to minutes
}

export function to24hrClock(date){
    return date.toLocaleTimeString('en-GB', { 
        hour: "numeric", 
        minute: "numeric"
    })
}

export class toggleableInterval {

    constructor(intervalFunction, delay, active){
        this.intervalFunction = intervalFunction
        this.active = (active == undefined) ? false : active
        this.delay = (delay == undefined) ? 1000 * 60 : delay
        console.log(this.delay + "  " + this.active);
        
    }

    toggle(){
        this.active = !this.active

        if(this.active) {
            clearInterval(this.interval)
        }else{
            this.intervalFunction()
            this.interval = setInterval(this.intervalFunction, this.delay)
        }
    }

    setDelay(delay){
        this.delay = delay
    }

}


export function createTable(s){
    var cols = [];
    for (var k in s) {
      for (var c in s[k]) {
        if (cols.indexOf(c)===-1) cols.push(c);
      }
    }
    var html = '<table class=tftable><thead><tr>'+
        cols.map(function(c){ return '<th>'+c+'</th>' }).join('')+
        '</tr></thead><tbody>';
    for (var l in s) {
      html += '<tr>'+cols.map(function(c){ return '<td>'+(s[l][c]||'')+'</td>' }).join('')+'</tr>';
    }
    html += '</tbody></table>';

    return html
}

import {say} from './textToSpeach.js'

export function sayTimes(times){
    let text = "Arrivals, "
    times.forEach(time => {
        text += time + ", " 
    });
    say(text)
}




// not in use
// handles finding correct bus in "EnTur" json format
function getBusName(bus){
    return bus.destinationDisplay.frontText == name
    // return true //testing!!!
}