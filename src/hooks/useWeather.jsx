import { useState, useEffect } from "react";
import { useWeatherContext } from "../contexts/WeatherContext";
import { useSearch } from "../contexts/SearchContext";
import useGeoLocation from "./useGeoLocation";
import { getWeatherDetails } from "../utils/getWeatherDetails";

// https://api.locationiq.com/v1/autocomplete?key=YOUR_ACCESS_TOKEN&q=SEARCH_STRING

const useWeather = () => {
	const {
		weatherData,
		setWeatherData,
		loading,
		setLoading,
		city,
		setCity,
		setRecentSearchesData,
		recentSearchesData,
		selectedLocation,
		setSelectedLocation,
		fetchWeatherData,
	} = useWeatherContext();

	const [isGPSFetched, setIsGPSFetched] = useState(false);
	const [hasUserSearched, setHasUserSearched] = useState(false);

	const { recentSearches, setRecentSearches } = useSearch(); // Use useSearch() instead of useWeatherContext()

	const currentHourIndex = new Date().getHours();
	//const [selectedLocation, setSelectedLocation] = useState(null);
	// const [recentSearchesData, setRecentSearchesData] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const LOCATIONIQ_API_KEY = "pk.97f6890a4afdd4a0ac0a21f5c62f7d39";
	const API_URL = "https://api.locationiq.com/v1/autocomplete.php";

	// Fetch weather for the searched location

	useEffect(() => {
		console.log("RECENT CITY DATA= ", recentSearchesData);
	}, [recentSearchesData]);

	// const fetchWeatherData = async (latitude, longitude, isGPS = false) => {
	// 	if (!latitude || !longitude) {
	// 		console.error("Invalid latitude or longitude:", latitude, longitude);
	// 		return;
	// 	}
	// 	setLoading(true);
	// 	try {
	// 		// Fetch the city name
	// 		const geoResponse = await fetch(
	// 			`https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
	// 		);
	// 		const geoData = await geoResponse.json();

	// 		// city name
	// 		const resolvedCityName =
	// 			geoData.address?.name ||
	// 			geoData.display_place ||
	// 			geoData.address?.city ||
	// 			(geoData.display_name?.includes(",")
	// 				? geoData.display_name.split(",")[0]
	// 				: "Unknown Location");

	// 		// console.log("Reverse Geocode API Response:", geoData);
	// 		// console.log("Resolved City Name:", resolvedCityName);

	// 		// ✅ Check cache before fetching from Open-Meteo
	// 		const cacheKey = resolvedCityName.toLowerCase();
	// 		//	console.log(`Checking cache for: ${cacheKey}`);

	// 		// ⚠️ Only skip API call if not from GPS and data is cached
	// 		if (!isGPS && recentSearchesData[cacheKey]) {
	// 			console.log(`✅ Cache hit for ${cacheKey}, using stored weather data.`);

	// 			setCity(resolvedCityName);
	// 			setWeatherData(recentSearchesData[cacheKey]);
	// 			setSelectedLocation({ latitude, longitude });
	// 			setLoading(false);
	// 			return;
	// 		}
	// 		console.log(
	// 			`❌ Cache miss for ${cacheKey}, fetching new data from Open-Meteo API.`
	// 		);

	// 		// fetch weather data from Open-meteo API
	// 		const weatherResponse = await fetch(
	// 			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_min,temperature_2m_max,sunset,sunrise,rain_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,showers_sum,uv_index_max&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,snowfall,relative_humidity_2m,weather_code,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m&current=relative_humidity_2m,is_day,weather_code,temperature_2m,cloud_cover,wind_direction_10m,wind_speed_10m,precipitation,apparent_temperature,wind_gusts_10m,snowfall,showers&timezone=auto`
	// 		);
	// 		const weatherData = await weatherResponse.json();

	// 		// Store it
	// 		setCity(resolvedCityName);
	// 		setWeatherData(weatherData);
	// 		setSelectedLocation({
	// 			latitude,
	// 			longitude,
	// 			name: resolvedCityName,
	// 			source: isGPS ? "gps" : "search",
	// 		});

	// 		if (!isGPS && setRecentSearches) {
	// 			setRecentSearches((prevSearches) => {
	// 				const updatedSearches = [
	// 					cacheKey,
	// 					...prevSearches.filter((city) => city !== cacheKey),
	// 				];
	// 				//console.log("Updated Recent Searches:", updatedSearches);

	// 				return updatedSearches.slice(0, 5);
	// 			});
	// 		}

	// 		// Store the city in recent searches
	// 		// if (
	// 		// 	resolvedCityName &&
	// 		// 	resolvedCityName !== "Unknown Location" &&
	// 		// 	setRecentSearches
	// 		// ) {
	// 		// 	setRecentSearches((prevSearches) => {
	// 		// 		const updatedSearches = [
	// 		// 			resolvedCityName.toLowerCase(),
	// 		// 			...prevSearches.filter(
	// 		// 				(city) => city !== resolvedCityName.toLowerCase()
	// 		// 			),
	// 		// 		];
	// 		// 		console.log("Updated Recent Searches:", updatedSearches);

	// 		// 		return updatedSearches.slice(0, 5);
	// 		// 	});
	// 		// }

	// 		//cache it
	// 		setRecentSearchesData((prevData) => ({
	// 			...prevData,
	// 			[cacheKey]: weatherData,
	// 		}));
	// 	} catch (error) {
	// 		console.error("Error fetching data:", error);
	// 		setCity("Location Not Found");
	// 		//setFlagUrl("N/A");
	// 		setWeatherData(null);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	const searchLocation = async (cityName) => {
		setLoading(true);
		try {
			const normalizedCity = cityName.trim().toLowerCase();

			const geoResponse = await fetch(
				`${API_URL}?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
					cityName
				)}&format=json&limit=5`
			);
			const geoData = await geoResponse.json();
			console.log("Geocoding API Response:", geoData);

			if (Array.isArray(geoData) && geoData.length > 0) {
				const {
					lat: latitude,
					lon: longitude,
					display_name: name,
				} = geoData[0];

				// update search results and selected location
				setHasUserSearched(true);
				setSearchResults(geoData);
				setSelectedLocation({ latitude, longitude, name, source: "search" });

				// add to recent searches
				if (setRecentSearches) {
					setRecentSearches((prevSearches) => {
						const updatedSearches = [
							normalizedCity,
							...prevSearches.filter((city) => city !== normalizedCity),
						];
						//	console.log("Updated Recent Searches:", updatedSearches);
						return updatedSearches.slice(0, 5);
					});
				}

				// Fetch weather data
				fetchWeatherData(latitude, longitude, false, setRecentSearches);
			} else {
				console.error("Location Not Found");
				setCity("Location Not Found");
				setSearchResults([]);
				setWeatherData(null);
			}
		} catch (error) {
			console.error("Error searching for location:", error);
			setCity("Error Searching Location");
			setWeatherData(null);
		} finally {
			setLoading(false);
		}
	};

	// Use GPS location on first load (unless a search is made)
	// useEffect(() => {
	// 	if (!isGPSFetched && !hasUserSearched && !selectedLocation) {
	// 		navigator.geolocation.getCurrentPosition(
	// 			(position) => {
	// 				const { latitude, longitude } = position.coords;
	// 				fetchWeatherData(latitude, longitude, true);
	// 				setIsGPSFetched(true); // Mark GPS as fetched
	// 			},
	// 			(error) => {
	// 				console.error("Error getting location: ", error);
	// 				setCity("Location Not Found");
	// 				setWeatherData(null);
	// 				setLoading(false);
	// 			}
	// 		);
	// 	}
	// }, [selectedLocation, hasUserSearched]);
	// Run only when selectedLocation changes

	const { location, isFetched } = useGeoLocation();

	useEffect(() => {
		if (
			isFetched &&
			location &&
			!selectedLocation & !hasUserSearched &&
			setRecentSearches
		) {
			fetchWeatherData(
				location.latitude,
				location.longitude,
				true,
				setRecentSearches
			);
			setIsGPSFetched(true);
		}
	}, [
		isFetched,
		location,
		selectedLocation,
		hasUserSearched,
		setRecentSearches,
	]);

	return {
		weatherData,
		setWeatherData,
		loading,
		city,
		setCity,
		currentHourIndex: new Date().getHours(),
		getWeatherDetails,
		searchLocation,
		recentSearchesData,
		setSearchResults,
		searchResults,
	};
};

export default useWeather;
