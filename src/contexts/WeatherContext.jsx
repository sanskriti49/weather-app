import { createContext, useContext, useEffect, useState } from "react";
import { getWeatherDetails } from "../utils/getWeatherDetails";
import useGeoLocation from "../hooks/useGeoLocation";
const WeatherContext = createContext();

const DISABLE_API_CALLS = true; // Set to false to enable APIs again

export const WeatherProvider = ({ children }) => {
	const [weatherData, setWeatherData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [city, setCity] = useState("Loading...");
	const [recentSearchesData, setRecentSearchesData] = useState({});
	const [selectedLocation, setSelectedLocation] = useState(null);

	const { location, isFetched, error: locationError } = useGeoLocation();

	const LOCATIONIQ_API_KEY = "pk.97f6890a4afdd4a0ac0a21f5c62f7d39";
	const MAX_RECENT = 5;

	async function fetchCityData(lat, lng) {
		console.trace("TRACE: fetchCityData called");

		setLoading(true);
		setError("");

		try {
			const res = await fetch(
				`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
			);
			const data = await res.json();

			return {
				cityName:
					data.city ||
					data.locality ||
					data.localityInfo?.administrative?.[0]?.name ||
					data.principalSubdivision ||
					"Unknown",
				country: data.countryName,
				countryCode: data.countryCode?.toUpperCase(),
			};
		} catch (err) {
			console.error("Error fetching city data:", err);
			throw new Error("Failed to fetch city data.");
		} finally {
			setLoading(false);
		}
	}

	const fetchWeatherData = async (
		latitude,
		longitude,
		isGPS = false,
		setRecentSearches = null
	) => {
		console.trace("TRACE: fetchWeatherData called");

		if (!latitude || !longitude) {
			console.error("Invalid latitude or longitude:", latitude, longitude);
			return;
		}
		setLoading(true);
		try {
			const geoResponse = await fetch(
				`https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
			);
			const geoData = await geoResponse.json();
			console.log("LOCATI IQ: ", geoData);

			const resolvedCityName =
				geoData.address?.name ||
				geoData.display_place ||
				geoData.address?.city ||
				(geoData.display_name?.includes(",")
					? geoData.display_name.split(",")[0]
					: "Unknown Location");

			const cacheKey = resolvedCityName.toLowerCase();

			//cached data
			if (!isGPS && recentSearchesData[cacheKey]) {
				setCity(resolvedCityName);
				setWeatherData(recentSearchesData[cacheKey]);
				setSelectedLocation({ latitude, longitude });
				setLoading(false);
				return;
			}

			//fetch new weather data
			const weatherResponse = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_min,temperature_2m_max,sunset,sunrise,rain_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,showers_sum,uv_index_max&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,snowfall,relative_humidity_2m,weather_code,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m&current=relative_humidity_2m,is_day,weather_code,temperature_2m,cloud_cover,wind_direction_10m,wind_speed_10m,precipitation,apparent_temperature,wind_gusts_10m,snowfall,showers&timezone=auto`
			);
			const weatherData = await weatherResponse.json();

			setCity(resolvedCityName);
			setWeatherData(weatherData);
			setSelectedLocation({
				latitude,
				longitude,
				name: resolvedCityName,
				source: isGPS ? "gps" : "search",
			});

			//	if (!isGPS && setRecentSearches) {
			if (setRecentSearches) {
				setRecentSearches((prevSearches) => {
					const updated = [
						cacheKey,
						...prevSearches.filter((city) => city !== cacheKey),
					];
					return updated.slice(0, MAX_RECENT);
				});
			}

			setRecentSearchesData((prev) => {
				const entries = Object.entries(prev);
				const newEntries = [
					[cacheKey, weatherData],
					...entries.filter(([key]) => key !== cacheKey),
				].slice(0, MAX_RECENT);
				return Object.fromEntries(newEntries);
			});
		} catch (error) {
			console.error("Error fetching weather data:", error);
			setCity("Location Not Found");
			setWeatherData(null);
		} finally {
			setLoading(false);
		}
	};

	// Fetch weather on mount if location is available
	const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

	useEffect(() => {
		if (!isFetched || hasFetchedOnce) return;

		if (location) {
			// Avoid re-calling if same location already fetched

			fetchWeatherData(location.latitude, location.longitude, true);
		} else if (isFetched && !location) {
			fetchWeatherData(26.4499, 80.3319, false); // fallback to Kanpur
		}
		setHasFetchedOnce(true);
	}, [isFetched, location]);

	return (
		<WeatherContext.Provider
			value={{
				weatherData,
				setWeatherData,
				loading,
				setLoading,
				error,
				setError,
				city,
				setCity,
				currentHourIndex: new Date().getHours(),
				getWeatherDetails,
				recentSearchesData,
				setRecentSearchesData,
				selectedLocation,
				setSelectedLocation,
				fetchWeatherData, // Expose the function
				fetchCityData,
			}}
		>
			{children}
		</WeatherContext.Provider>
	);
};

export const useWeatherContext = () => useContext(WeatherContext);
