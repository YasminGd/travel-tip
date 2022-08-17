import { utilService } from './util.service.js'
import { storageService } from './storage.service.js'
import { weatherService } from './weather.service.js'

export const locService = {
    getLocs,
    getLocCords,
    addPlace,
    getGLocs,
    getPlaceIdxByID,
    removePlace,
    
}


const gLocs = storageService.load('places') || [];

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs)
        }, 2000)
    })
}

// {id, name, lat, lng, weather, createdAt, updatedAt}
function addPlace(pos, name) {
    return weatherService.getWeather(pos)
        .then(weather => {
            const loc = {
                id: utilService.makeId(3),
                pos,
                name,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                weather
            }
            gLocs.push(loc)
            storageService.save('places', gLocs)
        })
}

function getPlaceIdxByID(placeId) {
    return gLocs.findIndex((place) => placeId === place.id)
}

// function getPlaceByID(placeId) {
//     return gLocs.find((place) => placeId === place.id)
// }

function getGLocs() {
    return gLocs
}

function removePlace(placeId) {
    const placeIdx = locService.getPlaceIdxByID(placeId)
    gLocs.splice(placeIdx, 1)
    storageService.save('places', gLocs)
    app.renderPlaces()
}

function getLocCords(loc) {
    const API_KEY = 'AIzaSyDjeqGLpdj_gSag99MkH--hA5xzDL9cXIA' //TODO: Enter your API Key
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${API_KEY}`)
        .then(res => res.data)
        .then(res => {
            if (!res.results.length) return Promise.reject('No matching places')
            return {
                lat: res.results[0].geometry.location.lat,
                lng: res.results[0].geometry.location.lng
            }
        })
}

// function moveToLocationById(id) {
//     const place = getPlaceByID(id)
//     if (Date.now() - place.updatedAt > 1000 * 60 * 60 * 24) {
//         weatherService.getWeather(place.pos)
//             .then(weather => {
//                 place.weather = weather
//                 place.updatedAt = Date.now()
//             })
//     }
//     console.log(place);
//     mapService.moveTo(place.pos.lat, place.pos.lng)
// }
