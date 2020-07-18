


import {say} from './js/textToSpeach.js'
import {toggleableInterval, fetchJson, minutesToDate, to24hrClock, sayTimes, createTable} from './js/utils.js'
import {SelectableList} from './js/selectableList.js'


window.voiceVolume = 1

var intervalSlider = document.getElementById("reminderRange");
var reminderLength = document.getElementById("reminderLength");
reminderLength.innerHTML = intervalSlider.value; // Display the default slider value



// initialize station variables
var stationList = new SelectableList(document.getElementById('stationList'))
var displayedStations
var selectedStation


// initialize bus variabbles
var busList = new SelectableList(document.getElementById('busList'))
var selectedBussesIndexes

// initalize arrivals variable
var displayedArrivals 


// setting up interval classes

// frequently updating departures 
var updating = new toggleableInterval(update, 1000 * 30, true)


var reminding = new toggleableInterval(remind, 1000 * 60)


// user selecting a buss
busList.onClick(function(indexes){

    // update indexes
    selectedBussesIndexes = indexes

    // display departures
    document.getElementById('departuresList').classList.remove('hidden')


    update()
})


intervalSlider.oninput = function() {

    if(reminding) toggleReminders()
    reminderLength.innerHTML = this.value; // set new time
}

// toggle button
document.getElementById('toggleButton').addEventListener('click', (e)=>{

    reminding.toggle()

    // toggle button text
    document.getElementById("toggleButton").innerHTML = reminding.active ? "ON" : "OFF"
})


// main reminding function of website
function remind(){  

    console.log("reminding!");

    // say the minutes remaining out loud
    // update((arivals)=>{
        
    // })

    sayTimes(displayedArrivals.map(bus => bus.minutesRemaining))

}


async function getBusses(stationId){
    return fetchJson(
        'https://api.entur.io/journey-planner/v2/graphql',{
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body(stationId)),
        })
    .then(response => (response != null) ? response.data.stopPlaces[0].estimatedCalls : null)
    .catch(error => console.error(error))   
}


// returns minutes till bus leaves and the time it will leave in a 24hr clock format
function getBussProperties(bus){
    let arrivalTime = new Date(bus.expectedArrivalTime)
    return {
        name : bus.destinationDisplay.frontText,
        minutesRemaining : minutesToDate(arrivalTime),
        arrivalTime : to24hrClock(arrivalTime)
    }
}

// user writing in bus station search textfield
document.getElementById('stationLocation').addEventListener('keypress', function (e) {

    // add back CSS to list
    document.getElementById('stationList').classList.add('bigList')

    // document.getElementById('stationList').style.maxHeight = (document.getElementById('stationList').offsetHeight + 10) + 'cm'

    // remove collapsing css
    document.getElementById('stationList').classList.remove('collapse')

    // hide bus routes list
    document.getElementById('busListDiv').classList.add('hidden')
    document.getElementById('departuresList').classList.add('hidden')

    // hide bus departures
    document.getElementById('departuresList').classList.add('hidden')

    // search stations if user hasnt written anything in a while
    let listElement = document.getElementById('stationLocation')
    let valueBefore = listElement.value
    
    setTimeout(() => {
        let valueNow = listElement.value

        // valueBefore variable is taken before HTML updates textField, so if user does nothing only last letter is different
        if(valueNow.slice(0,-1) == valueBefore){
            stationSearch()
        }
    }, 500);
});

// user selecting a station
stationList.onClick(function(index){

    selectedStation = displayedStations[index[0]]

    console.log(selectedStation);
    

    // update title with fading
    document.getElementById('stationName').classList.add('fading')
    document.getElementById('stationName').innerHTML = displayedStations[index[0]].properties.name
    setTimeout(()=>document.getElementById('stationName').classList.remove('fading'),3000)
    
    
    let listElements = document.getElementById('stationList')

    // makes list collapse (with animation)
    listElements.classList.add('collapse')

    // clears search field
    document.getElementById('stationLocation').value = ""

    // removes list elements after animation
    setTimeout(()=>{listElements.innerHTML = "";},400)
    
    // removes list
    setTimeout(()=>{listElements.classList.toggle('bigList');},400)

    // display "what bus do you take?" bus list section
    document.getElementById('busListDiv').classList.remove('hidden')
    

    // set "selected busses" list now that we have a station selected 
    getBusses(selectedStation.properties.source_id).then(busses => {
        
        let busNames = busses.map(b => b.destinationDisplay.frontText)
        
        // remove duplicates
        busNames = Array.from(new Set(busNames))
        
        busList.setHtmlList(busNames)

        console.log(busNames);
    })


})

import {getStations} from './js/query.js'

window.stationSearch = function (){

    let searchWord = document.getElementById('stationLocation').value

    getStations(searchWord,function(response){


        displayedStations = response


        // remove all stations that aren't in white list of locations (also is whitelist bad now? maybe use 'allow list' instead bruh... good point, but it's hard to change from old ways and remmeber this stuff. I am sorry)
        const whiteListLocations = ['busStation','onstreetBus']


        let filteredStations = []

        for (const i of displayedStations) {
            
            if(i.properties.category.some(item => whiteListLocations.includes(item))){
                console.log('matches');
                
                filteredStations.push(i)
            }
        }

        displayedStations = filteredStations
        

        let listIdName = 'stationList'
        let busNames = displayedStations.map(s => s.properties.label)

        stationList.setHtmlList(busNames)

    })
}



// side effects: updates departure table, sets displayedArrivals variable
// response function passes selectedBusses
function update(response){

    console.log('updating');

    console.log(selectedStation);
    

    // no station selected
    if(!selectedStation.hasOwnProperty('properties')) return;

    // no busses selected
    if(typeof selectedBussesIndexes === 'undefined') return;

    console.log('update can run, passed tests');
    

    // make fetch call for busses at user selected station 
    getBusses(selectedStation.properties.id).then(busses => {
        console.log(busses);

        // list of busses the user takes/wants to use from previous selections
        let bussNames = busList.currentList

        

        let selectedBusses = selectedBussesIndexes.map(i => bussNames[i])        

        // build variable
        displayedArrivals = busses

        //maps object to only: name, minutesRemaining and arrivalTime
        .map(getBussProperties) 

        //filter out busses that are not selected by user
        .filter(bus => selectedBusses.includes(bus.name)) 
        
        console.table(displayedArrivals);

        document.getElementById('departuresList').classList.remove('hidden')

        let departuresTable = createTable(displayedArrivals)
        
        document.getElementById('departuresTable').innerHTML = departuresTable

        // avoids error if no response function defined
        if(typeof response !== 'undefined') response(displayedArrivals)
    })
}
