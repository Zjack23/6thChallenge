const apiKey = '35e71c707c967cf19e8e84c007cbe43b';
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    const searchButton = document.getElementById('searchButton');
    const currentWeather = document.getElementById('currentWeather');
    const forecast = document.getElementById('forecast');
    const searchHistory = document.getElementById('searchHistory');

    searchButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
            saveCityToHistory(city);
        }
    });

    searchHistory.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const city = event.target.textContent;
            getWeather(city);
        }
    });

    function getWeather(city) {
        const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                displayForecast(data);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function displayCurrentWeather(data) {
        const city = data.city.name;
        const date = new Date().toLocaleDateString();
        const weather = data.list[0].weather[0];
        const temperatureCelsius = data.list[0].main.temp;
        const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
        const humidity = data.list[0].main.humidity;
        const windSpeed = data.list[0].wind.speed;

        currentWeather.innerHTML = `
            <h2>${city} (${date})</h2>
            <img src="http://openweathermap.org/img/wn/${weather.icon}.png" alt="${weather.description}">
            <p>Temperature: ${temperatureFahrenheit.toFixed(2)}°F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;
    }

    function displayForecast(data) {
        forecast.innerHTML = '';
        for (let i = 1; i < data.list.length; i += 8) {
            const dayData = data.list[i];
            const date = new Date(dayData.dt_txt).toLocaleDateString();
            const weather = dayData.weather[0];
            const temperatureCelsius = dayData.main.temp;
            const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;
            const humidity = dayData.main.humidity;
            const windSpeed = dayData.wind.speed;

            const forecastDay = document.createElement('div');
            forecastDay.className = 'forecast-day';
            forecastDay.innerHTML = `
                <h3>${date}</h3>
                <img src="http://openweathermap.org/img/wn/${weather.icon}.png" alt="${weather.description}">
                <p>Temp: ${temperatureFahrenheit.toFixed(2)}°F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind: ${windSpeed} m/s</p>
            `;
            forecast.appendChild(forecastDay);
        }
    }

    function saveCityToHistory(city) {
        let cities = JSON.parse(localStorage.getItem('cities')) || [];
        if (!cities.includes(city)) {
            cities.push(city);
            localStorage.setItem('cities', JSON.stringify(cities));
            updateSearchHistory();
        }
    }

    function updateSearchHistory() {
        let cities = JSON.parse(localStorage.getItem('cities')) || [];
        searchHistory.innerHTML = '';
        cities.forEach(city => {
            const cityElement = document.createElement('li');
            cityElement.textContent = city;
            searchHistory.appendChild(cityElement);
        });
    }

    updateSearchHistory();
});
