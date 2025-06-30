import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SearchProvider } from "./contexts/SearchContext.jsx";
import { WeatherProvider } from "./contexts/WeatherContext.jsx";

createRoot(document.getElementById("root")).render(
	// <StrictMode>
	<WeatherProvider>
		<SearchProvider>
			<App />
		</SearchProvider>
	</WeatherProvider>
	// </StrictMode>
);
