document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const cityInput = document.getElementById("city-input");
  const cityName = document.getElementById("city-name");
  const temperature = document.getElementById("temperature");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("wind-speed");
  const currentIcon = document.getElementById("current-icon");
  const forecastContainer = document.getElementById("forecast");

  const API_KEY = "44ece02cfc874dd2a7c162152242406"; // Replace with your actual API key
  const API_URL_CURRENT = "http://api.weatherapi.com/v1/current.json";
  const API_URL_FORECAST = "http://api.weatherapi.com/v1/forecast.json";

  searchButton.addEventListener("click", () => {
    searchWeather();
  });

  cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      searchWeather();
    }
  });

  function searchWeather() {
    const city = cityInput.value.trim();
    if (city) {
      fetch(`${API_URL_CURRENT}?key=${API_KEY}&q=${city}`)
        .then((response) => response.json())
        .then((data) => {
          cityName.textContent = data.location.name;
          temperature.textContent = `Temperature: ${data.current.temp_c}°C`;
          humidity.textContent = `Humidity: ${data.current.humidity}%`;
          windSpeed.textContent = `Wind Speed: ${data.current.wind_kph} kph`;
          currentIcon.src = data.current.condition.icon; // Update the icon source

          // Fetch 3-day weather forecast
          fetch(`${API_URL_FORECAST}?key=${API_KEY}&q=${city}&days=3`)
            .then((response) => response.json())
            .then((data) => {
              displayForecast(data.forecast.forecastday);
            })
            .catch((error) => {
              console.error("Error fetching the forecast data:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching the weather data:", error);
        });
    }
  }

  function displayForecast(forecast) {
    forecastContainer.innerHTML = "";
    forecast.forEach((day) => {
      const forecastElement = document.createElement("div");
      forecastElement.classList.add("forecast-day");

      const date = document.createElement("h3");
      date.textContent = day.date;

      const icon = document.createElement("img"); // Create an img element for the icon
      icon.src = day.day.condition.icon; // Set the icon source
      icon.alt = day.day.condition.text; // Set the alt text

      const condition = document.createElement("p");
      condition.textContent = day.day.condition.text;

      const temp = document.createElement("p");
      temp.textContent = `Temp: ${day.day.avgtemp_c}°C`;

      forecastElement.appendChild(date);
      forecastElement.appendChild(icon); // Append the icon to the forecast element
      forecastElement.appendChild(condition);
      forecastElement.appendChild(temp);

      forecastContainer.appendChild(forecastElement);
    });
  }
});
