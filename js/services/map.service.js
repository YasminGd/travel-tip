
import { utilService } from './util.service.js'
import { storageService } from './storage.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    addPlace,
    getGPlaces,
    removePlace,
    moveTo,
}

// Var that is used throughout this Module (not global)
var gMap
let gPlaces = storageService.load('places') || [];

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap)

            gMap.addListener('click', (mapsMouseEvent) => {
                const lat = mapsMouseEvent.latLng.lat()
                const lng = mapsMouseEvent.latLng.lng()
                const position = { lat, lng }

                const locationName = prompt('Enter location name')
                if (locationName) {
                    app.onAddPlace(position, locationName)

                    new google.maps.Marker({
                        position: position,
                        map: gMap,
                    })
                }
            })
        })
}

function addMarker(loc) {

    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyB1_Zyj7BOAlsfemGw193orzj81A5y473Q' //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function moveTo(lat, lng, zoom) {
    const pos = { lat, lng }
    gMap = new google.maps.Map(document.getElementById('map'), {
        zoom,
        center: pos,
    })
    new google.maps.Marker({
        position: pos,
        map: gMap,
    })
}

// {id, name, lat, lng, weather, createdAt, updatedAt}
function addPlace(pos, name) {
    gPlaces.push({ id: utilService.makeId(3), pos, name })
    storageService.save('places', gPlaces)
}

function getPlaceIdxByID(placeId) {
    return gPlaces.findIndex((place) => placeId === place.id)
}

function getGPlaces() {
    return gPlaces
}

function removePlace(placeId) {
    const placeIdx = getPlaceIdxByID(placeId)
    gPlaces.splice(placeIdx, 1)
    storageService.save('places', gPlaces)
    app.renderPlaces()
}