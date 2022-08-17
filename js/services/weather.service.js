export const weatherService = {
    getWeather
}

const WEATHER_API = 'bfa27a82a1883401caf7f4f33f637ee7'

function getWeather(pos) {
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.lat}&lon=${pos.lng}&appid=${WEATHER_API}`)
        .then(weather => weather.data)
        .then(weather => {
            console.log(weather.wind.speed);
            return {
                description: weather.weather[0].description,
                temp: (weather.main.temp - 273.15).toFixed(0),
                maxTemp: (weather.main.temp_max - 273.15).toFixed(0),
                minTemp: (weather.main.temp_min - 273.15).toFixed(0),
                country: weather.sys.country,
                wind: weather.wind.speed
            }
        })

}

