# Franz Weather

Franz Weather is a simple weather app built while practicing web development. It uses the OpenWeather API to show current weather information and lets visitors search for weather by city.

https://jf-ignacio.github.io/WeatherAppUsingAPI/ 

## Features

- Shows weather for the visitor's current location using browser geolocation.
- Searches weather information by city name.
- Displays temperature, humidity, wind information, weather description, and weather icons.
- Stores the total number of city searches in the browser with `localStorage`.
- Uses Bootstrap and custom CSS for the page layout and design.

## API

This project uses an OpenWeather API key in `index.js` to request weather data.

If you clone or reuse this project, create your own API key from OpenWeather and replace the existing key value:

```js
const apiKey = "YOUR_OPENWEATHER_API_KEY";
```

This app is for development practice, so the API key is currently used directly in the frontend JavaScript file.

## Future Features

- Add a greeting form that asks visitors for their name when they search the website.
- Store visitor names in the browser so the app can greet returning visitors.
- Add the current time and date to the weather display.

## Project Files

- `index.html` - Main page structure.
- `index.js` - Weather API requests, geolocation, rendering, and stored search count logic.
- `assets/index.css` - Custom styles.
- `assets/logo/` - Logo and icon images.

## Author

Created by Franz Ignacio as a weather app development practice project.
