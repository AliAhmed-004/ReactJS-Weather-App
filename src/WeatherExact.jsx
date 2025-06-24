import "./index.css";
import { useState, useEffect } from "react";
import cloudy from "./assets/icons/partly_cloudy.png";
import rainy from "./assets/icons/rainy.png";
import thunder from "./assets/icons/thunder.png";
import { format } from "date-fns";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  LabelList,
} from "recharts";

const apikey = "0ba8fcf6d9d33fb5bf748f3aed812efa";

function WeatherExact() {
  const [forecastMetric, setForecastMetric] = useState({});
  const [forecastImperial, setForecastImperial] = useState({});
  const [unit, setUnit] = useState("metric"); // 'metric' or 'imperial'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [uiState, setUiState] = useState({
    selectedDay: null,
    selectedMetric: "temp",
    currentData: [],
    latestDataPoint: {},
    dayHasBeenSelected: false,
  });

  const metricLabels = {
    temp: "Temperature",
    humidity: "Humidity",
    wind: "Wind",
  };

  const unitSymbols = {
    metric: { temp: "°C", wind: "km/h" },
    imperial: { temp: "°F", wind: "mph" },
  };

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        const [metricRes, imperialRes] = await Promise.all([
          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=Islamabad&units=metric&appid=${apikey}`
          ),
          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=Islamabad&units=imperial&appid=${apikey}
`
          ),
        ]);

        const metricData = await metricRes.json();
        const imperialData = await imperialRes.json();

        // Process and group forecast entries by date
        const process = (data) => {
          const grouped = {};
          data.list.forEach((entry) => {
            const date = new Date(entry.dt * 1000);
            const dateKey = format(date, "yyyy-MM-dd");
            const dayLabel = format(date, "EEE");
            const hour = date.getHours();

            if (!grouped[dateKey]) {
              grouped[dateKey] = { label: dayLabel, entries: [] };
            }

            grouped[dateKey].entries.push({
              datetime: new Date(entry.dt_txt), // store full datetime
              hour: format(new Date(entry.dt * 1000), "HH:mm"), // still store this if needed
              temp: Math.round(entry.main.temp),
              humidity: entry.main.humidity,
              wind: entry.wind.speed,
              wind_deg: entry.wind.deg,
              condition: entry.weather[0].main,
              temp_min: Math.floor(entry.main.temp_min),
            });
          });
          return grouped;
        };

        setForecastMetric(process(metricData));
        setForecastImperial(process(imperialData));
        setLoading(false);
      } catch (error) {
        setError("Failed to load weather data.");
      }
    }

    fetchWeatherData();
  }, []);

  // Update UI state based on unit and forecast data
  useEffect(() => {
    const grouped = unit === "metric" ? forecastMetric : forecastImperial;
    if (Object.keys(grouped).length === 0) return;

    const firstDayKey = Object.keys(grouped)[0];
    const currentData = grouped[firstDayKey].entries;
    const latestDataPoint = currentData[currentData.length - 1];

    setUiState((prev) => ({
      ...prev,
      selectedDay: firstDayKey,
      currentData,
      latestDataPoint,
    }));
  }, [unit, forecastMetric, forecastImperial]);

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "rain":
        return rainy;
      case "thunderstorm":
        return thunder;
      case "clouds":
        return cloudy;
      case "clear":
      default:
        return cloudy;
    }
  };

  const groupedForecast = unit === "metric" ? forecastMetric : forecastImperial;

  // Optional: Guard if no data loaded yet
  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-row justify-center items-center min-w-[100vw]">
      <div className="flex flex-col p-6 ">
        {/* Current Location */}
        <p className="text-slate-600 dark:text-slate-400 pb-8 w-[50%]">
          Results for{" "}
          <span className="font-bold text-black dark:text-white">
            Islamabad
          </span>
        </p>

        {/* One look data */}
        <div className="flex flex-row">
          {/* Left Side */}
          <div className="flex flex-row items-start gap-4">
            {/* Weather Icon */}
            <img
              className="w-[50px] h-[50px]"
              src={getWeatherIcon(uiState.latestDataPoint.condition)}
              alt="Current Condition"
            />
        {/* One look data */}
        <div className="flex flex-row">
          {/* Left Side */}
          <div className="flex flex-row items-start gap-4">
            {/* Weather Icon */}
            <img
              className="w-[50px] h-[50px]"
              src={getWeatherIcon(uiState.latestDataPoint.condition)}
              alt="Current Condition"
            />

            {/* Temperature + Units */}
            <div className="flex items-start gap-1 text-5xl ">
              {/* Temperature */}
              <span className="text-5xl font-normal text-black dark:text-white">
                {uiState.latestDataPoint.temp}
              </span>
            {/* Temperature + Units */}
            <div className="flex items-start gap-1 text-5xl ">
              {/* Temperature */}
              <span className="text-5xl font-normal text-black dark:text-white">
                {uiState.latestDataPoint.temp}
              </span>

              <span
                className={`text-lg cursor-pointer ${
                  unit === "metric"
                    ? "text-slate-300 dark:text-slate-500"
                    : "text-slate-400 dark:text-slate-600"
                }`}
                onClick={() => setUnit("metric")}
              >
                °C
              </span>
              <span className="text-lg text-slate-500 dark:text-slate-400">
                |
              </span>
              <span
                className={`text-lg cursor-pointer ${
                  unit === "imperial"
                    ? "text-slate-300 dark:text-slate-500"
                    : "text-slate-400 dark:text-slate-600"
                }`}
                onClick={() => setUnit("imperial")}
              >
                °F
              </span>
            </div>
              <span
                className={`text-lg cursor-pointer ${
                  unit === "metric"
                    ? "text-slate-300 dark:text-slate-500"
                    : "text-slate-400 dark:text-slate-600"
                }`}
                onClick={() => setUnit("metric")}
              >
                °C
              </span>
              <span className="text-lg text-slate-500 dark:text-slate-400">
                |
              </span>
              <span
                className={`text-lg cursor-pointer ${
                  unit === "imperial"
                    ? "text-slate-300 dark:text-slate-500"
                    : "text-slate-400 dark:text-slate-600"
                }`}
                onClick={() => setUnit("imperial")}
              >
                °F
              </span>
            </div>

            {/* Humidity and Wind */}
            <div className="flex flex-col w-[200px] text-sm">
              <p className="text-slate-500 dark:text-slate-400">
                Precipitation: 0%
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Humidity: {uiState.latestDataPoint.humidity ?? "--"}%
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Wind: {uiState.latestDataPoint.wind ?? "--"}{" "}
                {unitSymbols[unit].wind}
              </p>
            </div>
          </div>
            {/* Humidity and Wind */}
            <div className="flex flex-col w-[200px] text-sm">
              <p className="text-slate-500 dark:text-slate-400">
                Precipitation: 0%
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Humidity: {uiState.latestDataPoint.humidity ?? "--"}%
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Wind: {uiState.latestDataPoint.wind ?? "--"}{" "}
                {unitSymbols[unit].wind}
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-row justify-end w-full">
            <div className="flex flex-col justify-center items-end">
              <p className="font-normal text-2xl text-black dark:text-white">
                Weather
              </p>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                {format(uiState.latestDataPoint.datetime, "EEEE")}
                {!uiState.dayHasBeenSelected && (
                  <> {format(uiState.latestDataPoint.datetime, "h:mm aa")}</>
                )}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {uiState.latestDataPoint.condition}
              </p>
            </div>
          </div>
        </div>
          {/* Right Side */}
          <div className="flex flex-row justify-end w-full">
            <div className="flex flex-col justify-center items-end">
              <p className="font-normal text-2xl text-black dark:text-white">
                Weather
              </p>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                {format(uiState.latestDataPoint.datetime, "EEEE")}
                {!uiState.dayHasBeenSelected && (
                  <> {format(uiState.latestDataPoint.datetime, "h:mm aa")}</>
                )}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {uiState.latestDataPoint.condition}
              </p>
            </div>
          </div>
        </div>

        {/* Metric Selector + Graphs */}
        <div className="flex flex-col gap-5">
          {/* Metric Selector */}
          <div className="flex flex-row items-center justify-start h-12 gap-3">
            {Object.keys(metricLabels).map((metric, index, array) => (
              <div key={metric} className="flex flex-row items-center">
                <button
                  onClick={() =>
                    setUiState((prev) => ({
                      ...prev,
                      selectedMetric: metric,
                    }))
                  }
                  className={`relative font-normal transition-colors text-black dark:text-white`}
                >
                  {metricLabels[metric]}
                  {uiState.selectedMetric === metric && (
                    <span className="absolute left-0 -bottom-2 w-full h-[3px] bg-yellow-400"></span>
                  )}
                </button>
        {/* Metric Selector + Graphs */}
        <div className="flex flex-col gap-5">
          {/* Metric Selector */}
          <div className="flex flex-row items-center justify-start h-12 gap-3">
            {Object.keys(metricLabels).map((metric, index, array) => (
              <div key={metric} className="flex flex-row items-center">
                <button
                  onClick={() =>
                    setUiState((prev) => ({
                      ...prev,
                      selectedMetric: metric,
                    }))
                  }
                  className={`relative font-normal transition-colors text-black dark:text-white`}
                >
                  {metricLabels[metric]}
                  {uiState.selectedMetric === metric && (
                    <span className="absolute left-0 -bottom-2 w-full h-[3px] bg-yellow-400"></span>
                  )}
                </button>

                {/* Pipe separator except after the last item */}
                {index < array.length - 1 && (
                  <span className="mx-2 text-slate-200 dark:text-slate-600 text-2xl">
                    |
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Graph */}
          <div className="w-full h-fit py-7 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/20">
            {uiState.selectedMetric === "wind" ? (
              // Wind Graph
              <div className="flex flex-row justify-between items-center overflow-x-auto gap-4 h-full">
                {uiState.currentData.map((item, idx) => {
                  // Safely parse the datetime
                  const date = new Date(item.datetime);
                  const formattedTime = isNaN(date.getTime())
                    ? "--:--"
                    : format(date, "h a");

                  return (
                    <div
                      key={`wind-${idx}`}
                      className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 justify-center gap-y-5 min-w-[50px] h-[120px]"
                    >
                      <p className="mt-1">
                        {item.wind ?? "--"} {unitSymbols[unit].wind}
                      </p>
                      <div
                        className="w-6 h-6 transform transition-transform"
                        style={{
                          transform: `rotate(${item.wind_deg ?? 0}deg)`,
                        }}
                      >
                        <svg
                          width="20px"
                          height="20px"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="text-gray-600 dark:text-gray-300"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="2" x2="12" y2="22" />
                          <polyline points="6 8 12 2 18 8" />
                        </svg>
                      </div>
                      <p className="mb-1">{formattedTime}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart
                  data={uiState.currentData}
                  margin={{ top: 30, right: 5, left: 5, bottom: 5 }}
                >
                  <XAxis
                    dataKey="datetime"
                    tickFormatter={(value) => format(new Date(value), "h a")}
                    axisLine={false}
                    tickLine={false}
                    tick={{ dy: 10, fill: "#8c8c8c", fontSize: 11 }}
                  />

                  <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />

                  <Area
                    type="monotone"
                    dataKey={uiState.selectedMetric}
                    stroke={
                      uiState.selectedMetric === "temp"
                        ? "rgb(252, 198, 63)"
                        : "rgb(93, 210, 239)"
                    }
                    strokeWidth={3}
                    fill={
                      uiState.selectedMetric === "temp"
                        ? "rgba(232, 198, 63, 0.3)"
                        : "rgba(93, 210, 239, 0.3)"
                    }
                  >
                    <LabelList
                      dataKey={uiState.selectedMetric}
                      position="top"
                      content={({ x, y, value, index }) => (
                        <g>
                          <text
                            x={x}
                            y={y - 20}
                            fill="#b2b1b0"
                            fontSize={12}
                            fontWeight="bold"
                            textAnchor="middle"
                            /* Special handling for first/last labels */
                            dx={
                              index === 0
                                ? 10
                                : index === uiState.currentData.length - 1
                                ? -10
                                : 0
                            }
                          >
                            {value}
                            {uiState.selectedMetric === "temp"
                              ? unitSymbols[unit].temp
                              : ""}
                          </text>
                        </g>
                      )}
                    />
                  </Area>
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Day Selector */}
          <div className="flex flex-row justify-around pb-4 hide-scrollbar">
            {Object.entries(groupedForecast).map(
              ([dateKey, { label, entries }], index) => {
                const preview = entries[0];
          {/* Day Selector */}
          <div className="flex flex-row justify-around pb-4 hide-scrollbar">
            {Object.entries(groupedForecast).map(
              ([dateKey, { label, entries }], index) => {
                const preview = entries[0];

                // Day Card
                return (
                  <div
                    key={index}
                    onClick={() => {
                      const currentData = entries;
                      const latestDataPoint =
                        currentData[currentData.length - 1];
                      setUiState((prev) => ({
                        ...prev,
                        selectedDay: dateKey,
                        currentData,
                        latestDataPoint,
                        dayHasBeenSelected: true,
                      }));
                    }}
                    // Selected Card
                    className={`cursor-pointer flex-shrink-0 flex flex-col items-center justify-center rounded-lg px-5 py-2 transition ${
                      uiState.selectedDay === dateKey
                        ? "bg-slate-100 dark:bg-gray-800"
                        : "text-black dark:text-white"
                    }`}
                  >
                    <p
                      className={`text-lg font-normal ${
                        uiState.selectedDay !== dateKey
                          ? "text-black dark:text-white"
                          : "text-black dark:text-white"
                      } `}
                    >
                      {label}
                    </p>

                    {/* Weather Icon */}
                    <img
                      src={getWeatherIcon(preview.condition)}
                      className="h-[50px]"
                    />

                    {/* Temperature Text */}
                    <div className="flex flex-row gap-2 text-sm">
                      <p className="text-md font-normal text-black dark:text-white">
                        {preview.temp}
                        {unitSymbols[unit].temp}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        {preview.temp_min}
                        {unitSymbols[unit].temp}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherExact;
