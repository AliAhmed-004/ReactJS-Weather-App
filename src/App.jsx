import "./index.css";
import WeatherExact from "./WeatherExact";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import DarkModeToggle from "./components/DarkModeToggle";

function App() {
  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <DarkModeToggle />
        <WeatherExact />
      </div>
    </DarkModeProvider>
  );
}

export default App;
