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

async function renderQuote(category) {
    const qouteAPI = "fwl9nR0PRPo6ASZkMKcBmtKKzyTA4SJo7dPryZnO"; // FROM API NINJA
    const qoute_base_url = "https://api.api-ninjas.com/v2/randomquotes";
    const url = category ? `${qoute_base_url}?category=${encodeURIComponent(category)}` : qoute_base_url;

    try {
        const response = await fetch(url,
            {
                method: "GET",
                headers: {
                    "X-API-Key": qouteAPI
                }
            }
        );

        if(!response.ok) {
            throw new Error ("API FAILED: " + response.status);
        }

        const data = await response.json();
        const [result] = data;

        if(result) {
            document.getElementById("quotes").textContent = result.quote;
            document.getElementById("author").textContent = "- " + result.author;
        }
        else {
            return;
        }

    }
    catch(err) {
        console.error("An error occurs", err);
    }
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

    const tempImg = document.getElementById("temp-img");
    const currentTemp = Math.round(data.main.temp);
    tempImg.src = currentTemp >= 30 ? '/WeatherApp/assets/images/hot_temp.jpg' : '/WeatherApp/assets/images/cold_temp.jpg';


    document.getElementById("currentLocation").textContent = 
    `${data.name}, ${data.sys.country}`;

    document.getElementById("temperature").textContent = 
    `${currentTemp} C`;

    document.getElementById("humidity").textContent =
    `${data.main.humidity}`;

    document.getElementById("wind-speed").textContent =
    `${data.wind.speed} m/s \n DEG: ${data.wind.deg}`;

    document.getElementById("weather-description").textContent = 
    `${data.weather[0].description}`;

    const iconCode = data.weather[0].icon;
    const currentWeatherIcon = document.getElementById("current-weather-icon");
    currentWeatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    currentWeatherIcon.alt = data.weather[0].description;

}

async function renderSearchWeather(search) {
    const searchTemp = Math.round(search.main.temp);
    const searchTempImg = document.getElementById("search-temp-img");
    searchTempImg.src = searchTemp >= 30 ? '/WeatherApp/assets/images/hot_temp.jpg' : '/WeatherApp/assets/images/cold_temp.jpg';

    document.getElementById("search-header-location").textContent =
    `${search.name} , ${search.sys.country}`;

    document.getElementById("search-temperature").textContent =
    `${searchTemp} C`;

    document.getElementById("search-humidity").textContent = 
    `${search.main.humidity}`;

    document.getElementById("search-wind-speed").textContent =
    `${search.wind.speed} m/s \n DEG: ${search.wind.deg}`;

    document.getElementById("search-weather-description").textContent =
    `${search.weather[0].description}`;

    const searchIcon = search.weather[0].icon;
    const searchWeatherIcon = document.getElementById("search-weather-display");
    searchWeatherIcon.src = `https://openweathermap.org/img/wn/${searchIcon}@2x.png`;
    searchWeatherIcon.alt = search.weather[0].description;
  
}

async function getWeather() {
    const citySearch = document.getElementById("search-location").value.trim();
    const searchBtn = document.getElementById("search-btn");
    const notice = document.getElementById("notice");

    searchBtn.addEventListener("click", async () => {
        if(citySearch === "") {
            notice.textContent = "Empty Fields. Search first!";
            return;
        } 

        notice.textContent = "";
    })

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
    renderQuote("happiness");
});
