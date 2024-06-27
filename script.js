document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const cityInput = document.getElementById("city-input");
  const cityName = document.getElementById("city-name");
  const temperature = document.getElementById("temperature");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("wind-speed");
  const forecastContainer = document.getElementById("forecast-container");

  const API_KEY = "44ece02cfc874dd2a7c162152242406"; // Replace with your actual API key
  const API_URL_CURRENT = "http://api.weatherapi.com/v1/current.json";
  const API_URL_FORECAST = "http://api.weatherapi.com/v1/forecast.json";

  searchButton.addEventListener("click", () => {
    searchWeather();
  });

  // Event listener for Enter key press in city input
  cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      searchWeather();
    }
  });

  // Function to fetch weather data and update UI
  function searchWeather() {
    const city = cityInput.value.trim();
    if (city) {
      // Fetch current weather data
      fetch(`${API_URL_CURRENT}?key=${API_KEY}&q=${city}`)
        .then((response) => response.json())
        .then((data) => {
          cityName.textContent = data.location.name;
          temperature.textContent = `Temperature: ${data.current.temp_c}°C`;
          humidity.textContent = `Humidity: ${data.current.humidity}%`;
          windSpeed.textContent = `Wind Speed: ${data.current.wind_kph} kph`;
        })
        .catch((error) => {
          console.error("Error fetching the weather data:", error);
        });

      // Fetch 3-day weather forecast
      fetch(`${API_URL_FORECAST}?key=${API_KEY}&q=${city}&days=3`)
        .then((response) => response.json())
        .then((data) => {
          displayForecast(data.forecast.forecastday);
        })
        .catch((error) => {
          console.error("Error fetching the forecast data:", error);
        });
    }
  }

  // Function to display 3-day weather forecast
  function displayForecast(forecast) {
    forecastContainer.innerHTML = ""; // Clear previous forecast
    forecast.forEach((day) => {
      const forecastElement = document.createElement("div");
      forecastElement.classList.add("forecast-day");

      const date = document.createElement("h3");
      date.textContent = day.date;

      const condition = document.createElement("p");
      condition.textContent = day.day.condition.text;

      const temp = document.createElement("p");
      temp.textContent = `Temp: ${day.day.avgtemp_c}°C`;

      forecastElement.appendChild(date);
      forecastElement.appendChild(condition);
      forecastElement.appendChild(temp);

      forecastContainer.appendChild(forecastElement);
    });
  }
});
