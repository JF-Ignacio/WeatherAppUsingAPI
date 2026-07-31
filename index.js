const apiKey = "b704f8087d6fbf2bc884c538e16ddf6e"; // FROM OPENWEATHER API
const baseURL = "https://api.openweathermap.org/data/2.5/weather";
const searches = 1;
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
    tempImg.src = currentTemp >= 30 ? 'assets/images/hot_temp.jpg' : '/WeatherApp/assets/images/cold_temp.jpg';

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

    getCurrentWeatherIcon(data);
}

function getCurrentWeatherIcon(data) {
    const description = data.weather[0].description.toLowerCase();
    const renderImg = document.getElementById("current-weather-icon");
    const iconCode = data.weather[0].icon;

    const conditions = [
        "rain",
        "drizzle",
        "thunderstorm",
        "clouds",
        "clear",
        "snow"
    ];

    const images = {
        rain: "assets/images/rain_main.jpg",
        drizzle: "assets/images/drizzle_main.png",
        thunderstorm: "assets/images/thunderstorm.jpg",
        clouds: "assets/images/clouds.jpg",
        clear: "assets/images/clear.jpg",
        snow: "assets/images/snow.jpg"
    };

    const match = conditions.find(condition => description.includes(condition));
    const src = match ? images[match] : `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

     renderImg.src = src;
     renderImg.alt = description;

}

function getSearchWeatherIcon(data) {

    const description = data.weather[0].description.toLowerCase();
    const icon = data.weather[0].icon;
    const display = document.getElementById("search-weather-display");

    const conditions = [
        "rain",
        "drizzle",
        "thunderstorm",
        "clouds",
        "clear",
        "snow"
    ];

    const images = {
        rain: "assets/images/rain_main.jpg",
        drizzle: "assets/images/drizzle_main.png",
        thunderstorm: "assets/images/thunderstorm.jpg",
        clouds: "assets/images/clouds.jpg",
        clear: "assets/images/clear.jpg",
        snow: "assets/images/snow.jpg"
    };

    const match = conditions.find(condition => description.includes(condition));
    const src = match ? images[match] : `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    display.src = src;
    display.alt = description;
}


async function renderSearchWeather(search) {
    const searchTemp = Math.round(search.main.temp);
    const searchTempImg = document.getElementById("search-temp-img");
    searchTempImg.src = searchTemp >= 30 ? 'assets/images/hot_temp.jpg' : 'assets/images/cold_temp.jpg';

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

    getSearchWeatherIcon(search);
  
}

function showPaymentPopUp() {
    document.querySelector(".payment").classList.add("is-visible");
}

function closePayment() {
    document.querySelector(".payment").classList.remove("is-visible");
}

async function getWeather() {
    const citySearch = document.getElementById("search-location").value.trim();
    const notice = document.getElementById("notice");

    if(citySearch === '') {
        notice.textContent = "Empty Fields";
        return;
    }

    notice.textContent = "";
    showPaymentPopUp();
    return;

    notice.textContent = "";

    try {
        const data = await FetchWeatherByCity(citySearch);
        renderSearchWeather(data);

        visits++;
        searches++;
        localStorage.setItem("searchVisits", visits);
        updateSearchCounts();
    }
    catch(err) {
        console.error("An error has occured." , err);
        document.getElementById("search-header-location").textContent = 
        "Location not found";
    }

}


function LandingPageAnimation() {
    
    const observerOpt = {
        root: null,
        threshold: 0.30
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("appear-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOpt);

    const animationTarget = document.querySelectorAll(".info");
    animationTarget.forEach(card => scrollObserver.observe(card));
}

function LocationHeroAnimate() {
    
    const observerOpt = {
        root: null,
        threshold: 0.30
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("appear-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOpt);

    const animationTarget = document.querySelectorAll(".location-hero");
    animationTarget.forEach(card => scrollObserver.observe(card));
}

function OpeningAnimation() {
    
    const observerOpt = {
        root: null,
        threshold: 0.60
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("appear-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOpt);

    const animationTarget = document.querySelectorAll(".hero-content");
    const card_target = document.querySelectorAll(".visitor-card");
    const search_cards = document.querySelectorAll(".full-weather-display");
    animationTarget.forEach(card => scrollObserver.observe(card));
    card_target.forEach(visitor => scrollObserver.observe(visitor));
    search_cards.forEach(search => scrollObserver.observe(search));
}

window.addEventListener("DOMContentLoaded", () => {
    getCurrentWeather();
    updateSearchCounts();
    renderQuote("happiness");
    LandingPageAnimation();
    LocationHeroAnimate();
    OpeningAnimation();
});
