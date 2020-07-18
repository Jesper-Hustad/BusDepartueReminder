import {paramToString, fetchJson} from './utils.js'


export function getStations(searchWord, callback){

    const paramaters = {
        text : searchWord,
        lang : "no"
    }

    const url = "https://api.entur.io/geocoder/v1/autocomplete?" + paramToString(paramaters)

    fetchJson(url).then(response => {
        // station.properties.label
        console.log(response.features)
        callback(response.features)
    })
}


// async function makeList() {

//     let searchField = document.getElementById('stationLocation').value

//     let stationsList = await getStations(searchField)

//     let htmlList = setHtmlList('ul', stationsList)

//     document.getElementById('busList').appendChild(htmlList)
// }


// makeList()
