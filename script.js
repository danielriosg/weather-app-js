document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const cityInput = document.getElementById("city-input");
  const cityName = document.getElementById("city-name");
  const temperature = document.getElementById("temperature");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("wind-speed");

  const API_KEY = "44ece02cfc874dd2a7c162152242406"; // Replace with your actual API key
  const API_URL_CURRENT = "http://api.weatherapi.com/v1/current.json";

  searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
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
    }
  });
});
