const apiKey = "b704f8087d6fbf2bc884c538e16ddf6e"; // FROM OPENWEATHER API
const baseURL = "https://api.openweathermap.org/data/2.5/weather";

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            resolve, reject
        );
    });
}

async function getCurrentWeather() {
    try {
        const position = await getPosition();
        const {lat, long} = position.coords;
        const data = await fetchWeather(lat, long);
        renderWeather(data);
    }
    catch(error) {
        console.log("An error occured", error);
    }
}

async function FetchWeatherByCoords(lat, long, lang) {
    try {
        const url = `${baseURL}?lat=${lat}&longitude=${long}&lang=${lang}=units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        
        if(!response.ok) {
            throw new Exception(`Weather API is broken. : ${response.status}`);
        }

        return response.json();
    }
    catch(error) {
        console.log("An error occured", error);
    }
}

async function FetchWeatherByCity(city) {
    try {
        const city_url = `${baseURL}?city=${city}`;
        const response = await fetch(city_url);

        if(!response.ok) {
            throw new Exception(`CITY NOT FOUND - API is broken : ${response.status}`);
        }

        return response.json();
    }
    catch(error) {
        console.log("An error occurs", error);
    }
}

async function renderCurrentWeather(data) {
    document.getElementById("currentLocation").textContent = 
    `${data.name}, ${data.sys.country}`;

    document.getElementById("temperature").textContent = 
    `TEMPERATURE: ${Math.round(data.main.temp)} * C`;

    document.getElementById("humidity").textContent =
    `HUMIDITY: ${data.main.humidity}`;

    document.getElementById("wind-speed").textContent =
    `SPEED: ${data.wind.speed} m/s | DEG: ${data.wind.deg}`;

    document.getElementById("weather-description").textContent = 
    `DESCRIPTION: ${data.weather[0].description}`;

    const iconCode = data.weather[0].icon;
    document.getElementById("weather-display").innerHTML =
    `<img
    src="https://openweathermap.org/img/wn/${iconCode}@2x.png"
    alt="${data.weather[0].description}";
    > `;

}

async function renderSearchWeather(search) {
    document.getElementById("search-header-location").textContent =
    `${search.name}`;

    document.getElementById("search-temperature").textContent =
    `TEMPERATURE:  ${search.main.temp}`;

    document.getElementById("search-humidity").textContent = 
    `HUMIDITY: ${search.main.humidity}`;

    document.getElementById("")

    const iconCode = data.weather[0].icon;
    document.getElementById("search-weather-display").innerHTML =
    `<img
    src="https://openweathermap.org/img/wn/${iconCode}@2x.png"
    alt="${data.weather[0].description}";
    > `;
}