(() => {
  "use strict";

  const USER_NAME = "Sofia";
  const THEME_KEY = "weather-theme-pref";
  const darkSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const DEFAULT_LOCATION = {
    name: "Boca Raton",
    admin1: "Florida",
    country: "United States",
    latitude: 26.3683,
    longitude: -80.1289,
  };

  const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
  const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";

  const WEATHER_CODES = {
    0: { text: "Clear sky", icon: "sun" },
    1: { text: "Mostly clear", icon: "sun" },
    2: { text: "Partly cloudy", icon: "cloud-sun" },
    3: { text: "Overcast", icon: "cloud" },
    45: { text: "Fog", icon: "fog" },
    48: { text: "Freezing fog", icon: "fog" },
    51: { text: "Light drizzle", icon: "cloud-rain" },
    53: { text: "Drizzle", icon: "cloud-rain" },
    55: { text: "Dense drizzle", icon: "cloud-rain" },
    56: { text: "Light freezing drizzle", icon: "cloud-rain" },
    57: { text: "Freezing drizzle", icon: "cloud-rain" },
    61: { text: "Light rain", icon: "cloud-rain" },
    63: { text: "Rain", icon: "cloud-rain" },
    65: { text: "Heavy rain", icon: "cloud-rain" },
    66: { text: "Light freezing rain", icon: "cloud-rain" },
    67: { text: "Freezing rain", icon: "cloud-rain" },
    71: { text: "Light snow", icon: "cloud-snow" },
    73: { text: "Snow", icon: "cloud-snow" },
    75: { text: "Heavy snow", icon: "cloud-snow" },
    77: { text: "Snow grains", icon: "cloud-snow" },
    80: { text: "Light showers", icon: "cloud-rain" },
    81: { text: "Showers", icon: "cloud-rain" },
    82: { text: "Violent showers", icon: "cloud-rain" },
    85: { text: "Light snow showers", icon: "cloud-snow" },
    86: { text: "Snow showers", icon: "cloud-snow" },
    95: { text: "Thunderstorm", icon: "cloud-lightning" },
    96: { text: "Thunderstorm, hail", icon: "cloud-lightning" },
    99: { text: "Severe thunderstorm", icon: "cloud-lightning" },
  };

  const ICONS = {
    sun: `<svg viewBox="0 0 24 24" fill="#ffd166" stroke="#ffd166" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="5"></circle><g stroke="#ffd166">
      <line x1="12" y1="1.5" x2="12" y2="4.2"></line><line x1="12" y1="19.8" x2="12" y2="22.5"></line>
      <line x1="1.5" y1="12" x2="4.2" y2="12"></line><line x1="19.8" y1="12" x2="22.5" y2="12"></line>
      <line x1="4.4" y1="4.4" x2="6.3" y2="6.3"></line><line x1="17.7" y1="17.7" x2="19.6" y2="19.6"></line>
      <line x1="4.4" y1="19.6" x2="6.3" y2="17.7"></line><line x1="17.7" y1="6.3" x2="19.6" y2="4.4"></line>
    </g></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="var(--icon-moon)" stroke="none"><path d="M20.5 14.3A8.5 8.5 0 1 1 9.7 3.5a9 9 0 1 0 10.8 10.8z"></path></svg>`,
    cloud: `<svg viewBox="0 0 24 24" fill="var(--icon-cloud)" stroke="none"><path d="M7.5 18.5a5 5 0 0 1-.4-10 6 6 0 0 1 11.5 1.6A4.3 4.3 0 0 1 18 18.5z"></path></svg>`,
    "cloud-sun": `<svg viewBox="0 0 24 24"><g fill="#ffd166" stroke="#ffd166" stroke-width="1.3" stroke-linecap="round">
      <circle cx="8.3" cy="8.3" r="3.6"></circle>
      <line x1="8.3" y1="1.8" x2="8.3" y2="3.4"></line><line x1="2.9" y1="4" x2="4.1" y2="5.2"></line><line x1="1.5" y1="8.3" x2="3.1" y2="8.3"></line>
    </g><path fill="var(--icon-cloud)" stroke="none" d="M9 20.5a5 5 0 0 1-.4-10 6 6 0 0 1 11.5 1.6A4.3 4.3 0 0 1 19.5 20.5z"></path></svg>`,
    "cloud-moon": `<svg viewBox="0 0 24 24"><path fill="var(--icon-moon)" stroke="none" d="M16.5 8.8a5.3 5.3 0 1 1-6-5.1 5.6 5.6 0 0 0 6 5.1z"></path><path fill="var(--icon-cloud)" stroke="none" d="M9 20.5a5 5 0 0 1-.4-10 6 6 0 0 1 11.5 1.6A4.3 4.3 0 0 1 19.5 20.5z"></path></svg>`,
    "cloud-rain": `<svg viewBox="0 0 24 24"><path fill="var(--icon-cloud-rain)" stroke="none" d="M7.5 16a5 5 0 0 1-.4-10 6 6 0 0 1 11.5 1.6A4.3 4.3 0 0 1 18 16z"></path><g stroke="var(--icon-raindrop)" stroke-width="1.6" stroke-linecap="round"><line x1="8" y1="18.5" x2="7" y2="21.5"></line><line x1="12" y1="18.5" x2="11" y2="21.5"></line><line x1="16" y1="18.5" x2="15" y2="21.5"></line></g></svg>`,
    "cloud-snow": `<svg viewBox="0 0 24 24"><path fill="var(--icon-cloud-snow)" stroke="none" d="M7.5 16a5 5 0 0 1-.4-10 6 6 0 0 1 11.5 1.6A4.3 4.3 0 0 1 18 16z"></path><g stroke="var(--icon-snowflake)" stroke-width="1.6" stroke-linecap="round"><line x1="8" y1="18" x2="8" y2="22"></line><line x1="6.3" y1="19" x2="9.7" y2="21"></line><line x1="6.3" y1="21" x2="9.7" y2="19"></line><line x1="16" y1="18" x2="16" y2="22"></line><line x1="14.3" y1="19" x2="17.7" y2="21"></line><line x1="14.3" y1="21" x2="17.7" y2="19"></line></g></svg>`,
    "cloud-lightning": `<svg viewBox="0 0 24 24"><path fill="var(--icon-cloud-storm)" stroke="none" d="M7.5 15.5a5 5 0 0 1-.4-10 6 6 0 0 1 11.5 1.6 4.3 4.3 0 0 1-.6 8.4z"></path><path fill="#ffd166" stroke="none" d="M13 14.5l-3.4 4.6h2.4l-1.3 4.4 4.6-5.6h-2.3z"></path></svg>`,
    fog: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--icon-fog)" stroke-width="1.8" stroke-linecap="round"><path d="M5 9.5a5 5 0 0 1 9.6-1.9" fill="none"></path><line x1="3" y1="13.5" x2="21" y2="13.5"></line><line x1="5" y1="17" x2="19" y2="17"></line><line x1="7" y1="20.5" x2="17" y2="20.5"></line></svg>`,
  };

  const state = {
    location: DEFAULT_LOCATION,
    unit: "f",
    searchTimer: null,
    activeRequest: null,
  };

  const el = (id) => document.getElementById(id);

  const els = {
    bg: el("bg"),
    greeting: el("greeting"),
    themeSwitch: el("themeSwitch"),
    searchInput: el("searchInput"),
    searchResults: el("searchResults"),
    locateBtn: el("locateBtn"),
    locationName: el("locationName"),
    locationSub: el("locationSub"),
    currentIcon: el("currentIcon"),
    currentTemp: el("currentTemp"),
    currentDesc: el("currentDesc"),
    currentRange: el("currentRange"),
    unitToggle: el("unitToggle"),
    feelsLike: el("feelsLike"),
    humidity: el("humidity"),
    wind: el("wind"),
    precip: el("precip"),
    hourlyScroll: el("hourlyScroll"),
    dailyList: el("dailyList"),
    loadingOverlay: el("loadingOverlay"),
  };

  function getIconKey(code, isDay) {
    const entry = WEATHER_CODES[code] || { icon: "cloud" };
    if (!isDay) {
      if (entry.icon === "sun") return "moon";
      if (entry.icon === "cloud-sun") return "cloud-moon";
    }
    return entry.icon;
  }

  function getWeatherText(code) {
    return (WEATHER_CODES[code] || { text: "Unknown" }).text;
  }

  function renderGreeting() {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    els.greeting.textContent = `${greeting}, ${USER_NAME}`;
  }

  function getStoredThemePref() {
    try {
      return localStorage.getItem(THEME_KEY) || "system";
    } catch (err) {
      return "system";
    }
  }

  function resolveTheme(pref) {
    return pref === "system" ? (darkSchemeQuery.matches ? "dark" : "light") : pref;
  }

  function applyTheme(pref) {
    const resolved = resolveTheme(pref);
    document.documentElement.setAttribute("data-theme", resolved);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", resolved === "light" ? "#dce8f7" : "#1b2a4a");

    Array.from(els.themeSwitch.querySelectorAll(".theme-btn")).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.themeChoice === pref);
    });

    try {
      localStorage.setItem(THEME_KEY, pref);
    } catch (err) {}
  }

  function handleThemeSwitch(event) {
    const btn = event.target.closest(".theme-btn");
    if (!btn) return;
    applyTheme(btn.dataset.themeChoice);
  }

  function setLoading(isLoading) {
    els.loadingOverlay.classList.toggle("hidden", !isLoading);
  }

  function setBackground(isDay, code) {
    const entry = WEATHER_CODES[code] || {};
    const isCloudy = entry.icon === "cloud" || entry.icon === "cloud-sun" || entry.icon === "cloud-moon" || entry.icon === "fog";
    const isRain = entry.icon === "cloud-rain" || entry.icon === "cloud-snow" || entry.icon === "cloud-lightning";
    els.bg.classList.toggle("is-night", !isDay);
    els.bg.classList.toggle("is-cloudy", isCloudy);
    els.bg.classList.toggle("is-rain", isRain);
  }

  function weekdayLabel(dateStr, index) {
    if (index === 0) return "Today";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(undefined, { weekday: "short" });
  }

  function hourLabel(isoStr) {
    const date = new Date(isoStr);
    return date.toLocaleTimeString(undefined, { hour: "numeric" });
  }

  function buildForecastUrl(location, unit) {
    const params = new URLSearchParams({
      latitude: location.latitude,
      longitude: location.longitude,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
      hourly: "temperature_2m,weather_code,is_day",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      temperature_unit: unit === "f" ? "fahrenheit" : "celsius",
      wind_speed_unit: unit === "f" ? "mph" : "kmh",
      timezone: "auto",
      forecast_days: "7",
    });
    return `${FORECAST_URL}?${params.toString()}`;
  }

  async function fetchWeather(location, unit) {
    setLoading(true);
    try {
      const response = await fetch(buildForecastUrl(location, unit));
      if (!response.ok) throw new Error("Weather request failed");
      const data = await response.json();
      renderLocation(location);
      renderCurrent(data, unit);
      renderHourly(data);
      renderDaily(data, unit);
    } catch (err) {
      els.currentDesc.textContent = "Unable to load weather";
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function renderLocation(location) {
    els.locationName.textContent = location.name;
    const parts = [location.admin1, location.country].filter(Boolean);
    els.locationSub.textContent = parts.join(", ");
  }

  function renderCurrent(data, unit) {
    const c = data.current;
    const unitSuffix = unit === "f" ? "°F" : "°C";
    const isDay = c.is_day === 1;

    els.currentIcon.innerHTML = ICONS[getIconKey(c.weather_code, isDay)] || "";
    els.currentTemp.textContent = `${Math.round(c.temperature_2m)}°`;
    els.currentDesc.textContent = getWeatherText(c.weather_code);
    els.feelsLike.textContent = `${Math.round(c.apparent_temperature)}${unitSuffix}`;
    els.humidity.textContent = `${Math.round(c.relative_humidity_2m)}%`;
    els.wind.textContent = `${Math.round(c.wind_speed_10m)} ${unit === "f" ? "mph" : "km/h"}`;

    if (data.daily && data.daily.temperature_2m_max && data.daily.temperature_2m_max.length) {
      els.currentRange.textContent = `H: ${Math.round(data.daily.temperature_2m_max[0])}°  L: ${Math.round(data.daily.temperature_2m_min[0])}°`;
      els.precip.textContent = `${Math.round(data.daily.precipitation_probability_max[0] ?? 0)}%`;
    }

    setBackground(isDay, c.weather_code);
  }

  function renderHourly(data) {
    const hourly = data.hourly;
    const nowIso = data.current.time;
    let startIndex = hourly.time.findIndex((t) => t >= nowIso);
    if (startIndex === -1) startIndex = 0;

    const items = [];
    for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i++) {
      const iconKey = getIconKey(hourly.weather_code[i], hourly.is_day[i] === 1);
      const label = i === startIndex ? "Now" : hourLabel(hourly.time[i]);
      items.push(`
        <div class="hour-item">
          <span class="hour-time">${label}</span>
          <span class="hour-icon">${ICONS[iconKey] || ""}</span>
          <span class="hour-temp">${Math.round(hourly.temperature_2m[i])}°</span>
        </div>
      `);
    }
    els.hourlyScroll.innerHTML = items.join("");
  }

  function renderDaily(data) {
    const daily = data.daily;
    const highs = daily.temperature_2m_max;
    const lows = daily.temperature_2m_min;
    const globalMax = Math.max(...highs);
    const globalMin = Math.min(...lows);
    const span = Math.max(globalMax - globalMin, 1);

    const rows = daily.time.map((dateStr, i) => {
      const iconKey = getIconKey(daily.weather_code[i], true);
      const high = highs[i];
      const low = lows[i];
      const leftPct = ((low - globalMin) / span) * 100;
      const widthPct = ((high - low) / span) * 100;
      return `
        <div class="day-row">
          <span class="day-name">${weekdayLabel(dateStr, i)}</span>
          <span class="day-icon">${ICONS[iconKey] || ""}</span>
          <div class="day-bar-track">
            <div class="day-bar-fill" style="left:${leftPct}%;width:${widthPct}%"></div>
          </div>
          <div class="day-temps">
            <span class="day-temp-low">${Math.round(low)}°</span>
            <span class="day-temp-high">${Math.round(high)}°</span>
          </div>
        </div>
      `;
    });
    els.dailyList.innerHTML = rows.join("");
  }

  async function searchLocations(query) {
    const params = new URLSearchParams({ name: query, count: "6", language: "en", format: "json" });
    const response = await fetch(`${GEOCODE_URL}?${params.toString()}`);
    if (!response.ok) throw new Error("Geocoding request failed");
    const data = await response.json();
    return data.results || [];
  }

  function renderSearchResults(results) {
    if (!results.length) {
      els.searchResults.innerHTML = `<li class="search-empty">No matches found</li>`;
      els.searchResults.classList.remove("hidden");
      return;
    }

    els.searchResults.innerHTML = results
      .map((r, i) => {
        const sub = [r.admin1, r.country].filter(Boolean).join(", ");
        return `
          <li class="search-result-item" data-index="${i}">
            <div class="search-result-name">${r.name}</div>
            <div class="search-result-sub">${sub}</div>
          </li>
        `;
      })
      .join("");
    els.searchResults.classList.remove("hidden");

    Array.from(els.searchResults.querySelectorAll(".search-result-item")).forEach((node, i) => {
      node.addEventListener("click", () => selectLocation(results[i]));
    });
  }

  function selectLocation(result) {
    state.location = {
      name: result.name,
      admin1: result.admin1,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
    };
    els.searchInput.value = "";
    els.searchResults.classList.add("hidden");
    fetchWeather(state.location, state.unit);
  }

  function handleSearchInput(value) {
    clearTimeout(state.searchTimer);
    const query = value.trim();
    if (query.length < 2) {
      els.searchResults.classList.add("hidden");
      return;
    }
    state.searchTimer = setTimeout(async () => {
      try {
        const results = await searchLocations(query);
        renderSearchResults(results);
      } catch (err) {
        console.error(err);
      }
    }, 300);
  }

  function handleUnitToggle(event) {
    const btn = event.target.closest(".unit-btn");
    if (!btn || btn.classList.contains("active")) return;
    state.unit = btn.dataset.unit;
    Array.from(els.unitToggle.querySelectorAll(".unit-btn")).forEach((b) => {
      b.classList.toggle("active", b === btn);
    });
    fetchWeather(state.location, state.unit);
  }

  function handleLocate() {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.location = {
          name: "Current Location",
          admin1: "",
          country: "",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        fetchWeather(state.location, state.unit);
      },
      () => {
        setLoading(false);
      },
      { timeout: 8000 }
    );
  }

  function init() {
    els.searchInput.addEventListener("input", (e) => handleSearchInput(e.target.value));
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrap")) {
        els.searchResults.classList.add("hidden");
      }
    });
    els.unitToggle.addEventListener("click", handleUnitToggle);
    els.locateBtn.addEventListener("click", handleLocate);
    els.themeSwitch.addEventListener("click", handleThemeSwitch);
    darkSchemeQuery.addEventListener("change", () => {
      if (getStoredThemePref() === "system") applyTheme("system");
    });

    renderGreeting();
    applyTheme(getStoredThemePref());
    fetchWeather(state.location, state.unit);
  }

  init();
})();
