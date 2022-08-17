
export const locService = {
    getLocs,
    getLocCords
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function getLocCords(loc) {
    const API_KEY = 'AIzaSyDjeqGLpdj_gSag99MkH--hA5xzDL9cXIA' //TODO: Enter your API Key
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${API_KEY}`)
        .then(res => res.data)
        .then(res => {
            if(!res.results.length) return Promise.reject('No matching places')
            return {
                lat: res.results[0].geometry.location.lat,
                lng: res.results[0].geometry.location.lng
            }
        })
}


