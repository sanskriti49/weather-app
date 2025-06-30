import React from "react";
//import useWeather from "../hooks/useWeather";
import { ScaleLoader } from "react-spinners";
import { useWeatherContext } from "../contexts/WeatherContext";

const SearchedCity = () => {
	const { weatherData, loading, currentHourIndex, city, getWeatherDetails } =
		useWeatherContext();

	// Get precipitation probability
	const precipitationProbability =
		weatherData?.hourly?.precipitation_probability?.[currentHourIndex];

	// Get temperature safely
	const temperature =
		weatherData?.hourly?.temperature_2m?.[currentHourIndex] ?? "Loading...";

	// Get current weather code
	const weatherCode = weatherData?.hourly?.weather_code?.[currentHourIndex];

	// Get weather details using the function
	const weatherDetails = getWeatherDetails(weatherCode);

	const now = new Date();
	const currentHour = now.getHours();
	const currentMinutes = now.getMinutes();

	// const [sunsetHour, sunsetMinutes] = sunsetTime.split(":").map(Number);
	// const [sunriseHour, sunriseMinutes] = sunriseTime.split(":").map(Number);

	// const isNight =
	// 	currentHour > sunsetHour ||
	// 	(currentHour === sunsetHour && currentMinutes >= sunsetMinutes) ||
	// 	currentHour < sunriseHour ||
	// 	(currentHour === sunriseHour && currentMinutes < sunriseMinutes);

	console.log("SearchedCity's weatherData:", weatherData);

	return (
		<div className="flex justify-between">
			<div className="mx-8 px-6 pt-4 pb-4">
				<p className="font-bold text-[62px] break-words leading-tight">
					{city}
				</p>
				<div className="flex text-[#7e7b75] font-semibold">
					Chance of rain:{" "}
					{precipitationProbability !== undefined ? (
						`${precipitationProbability}%`
					) : (
						<p>...</p>
					)}
				</div>
				<p className="font-extrabold text-[68px] mt-8 font-roboto">
					{loading ? (
						<ScaleLoader color="#647c9e" />
					) : (
						`${Math.round(temperature)}°`
					)}
				</p>
			</div>

			<div>
				<img
					src={weatherDetails.img}
					alt={weatherDetails.desc}
					className="w-70 h-60 px-15 py-10"
				/>
			</div>
		</div>
	);
};

export default SearchedCity;
