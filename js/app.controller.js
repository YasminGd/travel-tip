import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.app = {
    onInit,
    onAddMarker,
    onPanTo,
    onGetLocs,
    onGetUserPos,
    onAddPlace,
    onRemovePlace,
    renderPlaces,
    onMoveTo,
}

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
        renderPlaces()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}

function onRemovePlace(placeId) {
    mapService.removePlace(placeId)
    renderPlaces()
}

function onAddPlace(pos, name) {
    mapService.addPlace(pos, name)
    renderPlaces()
}

function onMoveTo(lat, lng, zoom) {
    mapService.moveTo(lat, lng, zoom)
}

function renderPlaces() {
    const places = mapService.getGPlaces()
    const strHTML = places
        .map(
            (place) => `
        <li id="${place.id
                }" class="place list-group-item"><img src="img/placemarker.png" alt="" />${place.name
                }, lat: ${place.pos.lat.toFixed(3)}, lng: ${place.pos.lng.toFixed(
                    3
                )}<span class="point" onclick="app.onMoveTo(${place.pos.lat},${place.pos.lng
                }, 15)"> Go There 👆</span><span onclick="app.onRemovePlace('${place.id
                }')">X</span></li>`
        ).join('')

    document.querySelector('.places-list').innerHTML = strHTML
}
