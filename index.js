const apiKey = "b704f8087d6fbf2bc884c538e16ddf6e"; // FROM OPENWEATHER API
const baseURL = "https://api.openweathermap.org/data/2.5/weather";
let visits = parseInt(localStorage.getItem("searchVisits")) || 0;

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            resolve, reject
        );
    });
}

function updateSearchCounts() {
    const visitorEl = document.getElementById("visitors");

    if(visitorEl) {
        visitorEl.textContent = visits;
    }
}

async function getCurrentWeather() {

    const position = await getPosition();
    const {latitude, longitude} = position.coords;
    const data = await FetchWeatherByCoords(latitude, longitude);
    renderCurrentWeather(data);
}

async function FetchWeatherByCoords(lat, lon, lang) {
    const url = `${baseURL}?lat=${lat}&lon=${lon}&lang=${lang}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    
    if(!response.ok) {
        throw new Error(`Weather API is broken. : ${response.status}`);
    }

    return response.json();
}

async function FetchWeatherByCity(city) {

    const city_url = `${baseURL}?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const response = await fetch(city_url);

    if(!response.ok) {
        throw new Error(`CITY NOT FOUND - API is broken : ${response.status}`);
    }

    return response.json();
}

async function renderCurrentWeather(data) {
    document.getElementById("currentLocation").textContent = 
    `${data.name}, ${data.sys.country}`;

    document.getElementById("temperature").textContent = 
    `${Math.round(data.main.temp)} * C`;

    document.getElementById("humidity").textContent =
    `${data.main.humidity}`;

    document.getElementById("wind-speed").textContent =
    `${data.wind.speed} m/s \n DEG: ${data.wind.deg}`;

    document.getElementById("weather-description").textContent = 
    `${data.weather[0].description}`;

    const iconCode = data.weather[0].icon;
    document.getElementById("weather-display").innerHTML =
    `<img
    src="https://openweathermap.org/img/wn/${iconCode}@2x.png"
    alt="${data.weather[0].description}" 
    style='width: 200px';
    > `;

}

async function renderSearchWeather(search) {
    document.getElementById("search-header-location").textContent =
    `${search.name} , ${search.sys.country}`;

    document.getElementById("search-temperature").textContent =
    `TEMPERATURE:  ${search.main.temp}`;

    document.getElementById("search-humidity").textContent = 
    `HUMIDITY: ${search.main.humidity}`;

    document.getElementById("search-wind-speed").textContent =
    `WIND SPEED: ${search.wind.speed}`;

    document.getElementById("search-weather-description").textContent =
    `${search.weather[0].description}`;

    const searchIcon = data.weather[0].icon;
    document.getElementById("search-weather-display").innerHTML =
    `<img
    src="https://openweathermap.org/img/wn/${searchIcon}@2x.png"
    alt="${search.weather[0].description}";
    > `;
}

async function getWeather() {
    const citySearch = document.getElementById("search-location").value.trim();

    if(!citySearch) return;

    try {
        const data = await FetchWeatherByCity(citySearch);
        renderSearchWeather(data);

        visits++;
        localStorage.setItem("searchVisits", visits);
        updateSearchCounts();
    }
    catch(err) {
        console.error("An error has occured." , err);
        document.getElementById("search-header-location").textContent = 
        "Location not found";
    }

}


window.addEventListener("DOMContentLoaded", () => {
    getCurrentWeather();
    updateSearchCounts();
});