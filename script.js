document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const cityInput = document.getElementById("city-input");
  const cityName = document.getElementById("city-name");
  const temperature = document.getElementById("temperature");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("wind-speed");
  const currentIcon = document.getElementById("current-icon");
  const forecastContainer = document.getElementById("forecast");
  const errorMessage = document.getElementById("error-message");
  const showRecentCitiesButton = document.getElementById("show-recent-cities");
  const recentCitiesContainer = document.getElementById("recent-cities");
  const recentCitiesBox = document.getElementById("recent-cities-container"); // New line

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

  showRecentCitiesButton.addEventListener("click", () => {
    const cities = JSON.parse(localStorage.getItem("cities")) || [];
    recentCitiesContainer.innerHTML = ""; // Clear previous list

    const ul = document.createElement("ul");

    cities.forEach((city) => {
      const li = document.createElement("li");
      li.textContent = city;
      li.addEventListener("click", () => {
        cityInput.value = city;
        searchWeather();
      });
      ul.appendChild(li);
    });

    recentCitiesContainer.appendChild(ul);

    // Toggle visibility of recent cities container
    if (
      recentCitiesBox.style.display === "none" ||
      recentCitiesBox.style.display === ""
    ) {
      recentCitiesBox.style.display = "block";
    } else {
      recentCitiesBox.style.display = "none";
    }
  });

  function searchWeather() {
    const city = cityInput.value.trim();
    if (city) {
      // Fetch current weather data
      fetch(`${API_URL_CURRENT}?key=${API_KEY}&q=${city}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("City not found");
          }
          return response.json();
        })
        .then((data) => {
          errorMessage.style.display = "none";
          cityName.textContent = data.location.name;
          temperature.textContent = `Temperature: ${data.current.temp_c}°C`;
          humidity.textContent = `Humidity: ${data.current.humidity}%`;
          windSpeed.textContent = `Wind Speed: ${data.current.wind_kph} kph`;
          currentIcon.src = data.current.condition.icon; // Update the icon source

          // Save the city to local storage
          saveCityToLocalStorage(city);

          // Fetch 3-day weather forecast
          fetch(`${API_URL_FORECAST}?key=${API_KEY}&q=${city}&days=3`)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error fetching forecast data");
              }
              return response.json();
            })
            .then((data) => {
              displayForecast(data.forecast.forecastday);
            })
            .catch((error) => {
              errorMessage.textContent = error.message;
              errorMessage.style.display = "block";
            });
        })
        .catch((error) => {
          errorMessage.textContent = error.message;
          errorMessage.style.display = "block";
          cityName.textContent = "City Name";
          temperature.textContent = "Temperature: --";
          humidity.textContent = "Humidity: --";
          windSpeed.textContent = "Wind Speed: --";
          currentIcon.src = ""; // Clear the icon
          forecastContainer.innerHTML = ""; // Clear forecast
        });
    }
  }

  function saveCityToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    if (!cities.includes(city)) {
      cities.push(city);
      if (cities.length > 10) {
        cities.shift(); // Keep only the last 10 cities
      }
      localStorage.setItem("cities", JSON.stringify(cities));
    }
  }

  function displayForecast(forecast) {
    forecastContainer.innerHTML = ""; // Clear previous forecast
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
  document.getElementById("toggle-dark-mode")
    .addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      // Save user preference
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });

  // Load user preference on page load
  window.addEventListener("load", function () {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
    }
  });
  document
    .getElementById("close-recent-cities")
    .addEventListener("click", function () {
      document.getElementById("recent-cities-container").style.display = "none";
    });
});
