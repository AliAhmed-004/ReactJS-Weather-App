import { useState, useEffect } from "react";
import "./index.css";
import cloudy from "./assets/icons/partly_cloudy.png";
import rainy from "./assets/icons/rainy.png";
import thunder from "./assets/icons/thunder.png";
import { format } from "date-fns"; // You can install this via `npm i date-fns`
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import WeatherExact from "./WeatherExact";

const apikey = "0ba8fcf6d9d33fb5bf748f3aed812efa";

function App() {
  const [groupedForecast, setGroupedForecast] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("temp");

  const metricLabels = {
    temp: "Temperature (°C)",
    humidity: "Humidity (%)",
    wind: "Wind Speed (km/h)",
  };

  useEffect(() => {
    async function fetchWeather() {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=31.52&lon=74.36&units=metric&appid=${apikey}`
      );
      const data = await res.json();

      const grouped = {};

      data.list.forEach((entry) => {
        const date = new Date(entry.dt * 1000);
        const dateKey = format(date, "yyyy-MM-dd"); // e.g. "2025-06-22"
        const dayLabel = format(date, "EEE"); // e.g. "Sun"
        const hour = date.getHours();

        if (!grouped[dateKey]) {
          grouped[dateKey] = {
            label: dayLabel,
            entries: [],
          };
        }

        grouped[dateKey].entries.push({
          hour: `${hour}:00`,
          temp: Math.round(entry.main.temp),
          humidity: entry.main.humidity,
          wind: entry.wind.speed,
          wind_deg: entry.wind.deg,
          condition: entry.weather[0].main,
        });
      });

      setGroupedForecast(grouped);
      setSelectedDay(Object.keys(grouped)[0]);
    }

    fetchWeather();
  }, []);

  function getWeatherIcon(condition) {
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
  }

  const currentData = selectedDay
    ? groupedForecast[selectedDay]?.entries ?? []
    : [];

  const latestDataPoint = currentData[currentData.length - 1] ?? {
    temp: "--",
    humidity: "--",
    wind: "--",
    condition: "Mostly Sunny",
    icon: "Clear",
  };
  return <WeatherExact></WeatherExact>;

  // return (
  //   <div className="flex flex-col min-h-screen bg-cyan-100 items-center py-10 px-4 gap-6 ">
  //     {/* Weather Summary Section */}
  //     <div className="flex flex-row w-full max-w-5xl justify-around items-center bg-white rounded-lg shadow px-6 py-7">
  //       {/* Weather Icon + Temp + Details */}
  //       <div className="flex flex-row items-center gap-x-[12px]">
  //         <img
  //           src={getWeatherIcon(latestDataPoint.condition)}
  //           alt="Weather Icon"
  //           className="w-16 h-16"
  //         />

  //         <p className="text-5xl font-bold">
  //           {latestDataPoint.temp !== "--" ? `${latestDataPoint.temp}°C` : "--"}
  //         </p>

  //         <div className="flex flex-col pl-4 text-gray-700">
  //           <p>Humidity: {latestDataPoint.humidity ?? "--"}%</p>
  //           <p>Wind: {latestDataPoint.wind ?? "--"} km/h</p>
  //         </div>
  //       </div>

  //       {/* Day + Summary */}
  //       <div className="flex flex-col text-right">
  //         <p className="text-3xl font-semibold">Weather</p>
  //         <p className="text-lg">{selectedDay || "Today"}</p>
  //         <p className="text-yellow-700">{latestDataPoint.condition}</p>
  //       </div>
  //     </div>

  //     {/* Metric Buttons */}
  //     <div className="flex flex-row gap-4">
  //       {["temp", "humidity", "wind"].map((metric) => (
  //         <button
  //           key={metric}
  //           onClick={() => {
  //             setSelectedMetric(metric);
  //             console.log("Setting metric to", metric);
  //           }}
  //           className={`px-4 py-2 rounded-full text-sm font-medium shadow transition-colors duration-300 ${
  //             selectedMetric === metric
  //               ? "bg-blue-500 text-white"
  //               : "bg-white text-blue-500"
  //           }`}
  //         >
  //           {metricLabels[metric]}
  //         </button>
  //       ))}
  //     </div>

  //     {/* Line Chart */}
  //     <div className="w-full max-w-5xl h-[300px] bg-white rounded-lg shadow px-4 py-4">
  //       {selectedMetric === "wind" ? (
  //         // 🧭 Wind Angle Chart
  //         <div className="flex flex-row justify-between items-center overflow-x-auto gap-4 h-full">
  //           {currentData.map((item, idx) => (
  //             <div
  //               key={idx}
  //               className="flex flex-col items-center text-sm text-gray-600"
  //             >
  //               <p className="mb-1">{item.hour}</p>
  //               <div
  //                 className="w-6 h-6 transform transition-transform"
  //                 style={{ transform: `rotate(${item.wind_deg}deg)` }}
  //               >
  //                 <svg
  //                   viewBox="0 0 24 24"
  //                   fill="none"
  //                   stroke="gray"
  //                   strokeWidth="2"
  //                   strokeLinecap="round"
  //                   strokeLinejoin="round"
  //                   className="w-full h-full"
  //                 >
  //                   <line x1="12" y1="2" x2="12" y2="22" />
  //                   <polyline points="6 8 12 2 18 8" />
  //                 </svg>
  //               </div>
  //               <p className="mt-1">{item.wind} km/h</p>
  //             </div>
  //           ))}
  //         </div>
  //       ) : (
  //         // 📈 Line Chart for Temp or Humidity
  //         <ResponsiveContainer width="100%" height="100%">
  //           <LineChart data={currentData}>
  //             <XAxis dataKey="hour" />
  //             <YAxis />
  //             <Tooltip />
  //             <Line
  //               type="monotone"
  //               dataKey={selectedMetric}
  //               stroke={
  //                 selectedMetric === "temp"
  //                   ? "#d6e534" // yellow-green
  //                   : "#5dd2ef" // light blue
  //               }
  //               strokeWidth={3}
  //               dot={{ r: 4 }}
  //               activeDot={{ r: 6 }}
  //             />
  //           </LineChart>
  //         </ResponsiveContainer>
  //       )}
  //     </div>

  //     {/* Forecast Scrollable Row */}
  //     <div className="w-full max-w-5xl overflow-hidden">
  //       <div className="flex flex-row justify-around pb-4 hide-scrollbar">
  //         {Object.entries(groupedForecast).map(
  //           ([dateKey, { label, entries }], index) => {
  //             const preview = entries[0];
  //             return (
  //               <div
  //                 key={index}
  //                 onClick={() => setSelectedDay(dateKey)}
  //                 className={`cursor-pointer flex-shrink-0 w-[120px] flex flex-col items-center justify-center shadow rounded-lg p-4 transition ${
  //                   selectedDay === dateKey
  //                     ? "bg-blue-100"
  //                     : "bg-white hover:bg-blue-50"
  //                 }`}
  //               >
  //                 <p className="text-lg font-medium">{label}</p>
  //                 <img
  //                   src={getWeatherIcon(preview.condition)}
  //                   className="w-12 h-12"
  //                 />
  //                 <p className="text-xl font-bold text-blue-700">
  //                   {preview.temp}°C
  //                 </p>
  //                 <p className="text-yellow-600 text-center text-sm">
  //                   {preview.condition}
  //                 </p>
  //               </div>
  //             );
  //           }
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default App;
