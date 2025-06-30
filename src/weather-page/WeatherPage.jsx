import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock-upgrade";
import { useEffect, useState } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";

import Search from "../ui/Search";
import HourlyForecast from "./HourlyForecast";
import WeeklyForecast from "./WeeklyForecast";
import { useWeatherContext } from "../contexts/WeatherContext";
import Loader from "../ui/Loader";

export function WeatherPage() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	// const [weatherData, setWeatherData] = useState(null);
	// const [loading, setLoading] = useState(true);
	// const [error, setError] = useState(null);
	const { weatherData, loading, city } = useWeatherContext();
	const { setHoverMenu } = useOutletContext();
	// useEffect(() => {
	// 	const fetchWeather = async () => {
	// 		setLoading(true);
	// 		setError(null);
	// 		try {
	// 			const response = await fetch(
	// 				"https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=weather_code,temperature_2m_min,rain_sum,snowfall_sum,wind_gusts_10m_max,temperature_2m_max,uv_index_max,daylight_duration,wind_speed_10m_max,sunshine_duration,precipitation_probability_max,precipitation_sum,sunset,sunrise&hourly=temperature_2m,weather_code,precipitation_probability,precipitation,apparent_temperature,visibility,snowfall,wind_speed_10m,wind_gusts_10m,relative_humidity_2m,cloud_cover,wind_direction_10m&current=temperature_2m,wind_direction_10m,weather_code,precipitation,apparent_temperature,is_day,relative_humidity_2m,cloud_cover,snowfall,rain,wind_speed_10m,wind_gusts_10m,pressure_msl&timezone=auto"
	// 			);
	// 			if (!response.ok) throw new Error("Failed to fetch weather data");
	// 			const data = await response.json();
	// 			setWeatherData(data);
	// 		} catch (err) {
	// 			setError(err.message);
	// 		}
	// 		setLoading(false);
	// 	};

	// 	fetchWeather();
	// }, []);

	useEffect(() => {
		if (isMenuOpen) disableBodyScroll(document.body);
		else enableBodyScroll(document.body);
	}, [isMenuOpen]);
	if (loading) return <Loader />;

	return (
		<>
			<Search toggleMenu={setIsMenuOpen} setHoverMenu={setHoverMenu} />
			<HourlyForecast weather={weatherData?.hourly} />
			<div className="lg:hidden mt-8">
				<WeeklyForecast weather={weatherData?.daily} />
			</div>
		</>
	);
}

// export async function loader() {
// 	//const [hasFetched, setHasFetched] = useState(false);

// 	const res = await fetch(
// 		"https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=weather_code,temperature_2m_min,rain_sum,snowfall_sum,wind_gusts_10m_max,temperature_2m_max,uv_index_max,daylight_duration,wind_speed_10m_max,sunshine_duration,precipitation_probability_max,precipitation_sum,sunset,sunrise&hourly=temperature_2m,weather_code,precipitation_probability,precipitation,apparent_temperature,visibility,snowfall,wind_speed_10m,wind_gusts_10m,relative_humidity_2m,cloud_cover,wind_direction_10m&current=temperature_2m,wind_direction_10m,weather_code,precipitation,apparent_temperature,is_day,relative_humidity_2m,cloud_cover,snowfall,rain,wind_speed_10m,wind_gusts_10m,pressure_msl&timezone=auto"
// 	);

// 	if (!res.ok)
// 		throw new Response("Failed to fetch weather data", { status: res.status });

// 	const data = await res.json();

// 	return { weather: data };
// }
