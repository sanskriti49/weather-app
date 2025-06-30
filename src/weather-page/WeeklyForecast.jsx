import React from "react";
import { BeatLoader } from "react-spinners";
import { useWeatherContext } from "../contexts/WeatherContext";

const WeeklyForecast = () => {
	// const { weatherData, loading, currentHourIndex, getWeatherDetails } =
	// 	useWeather();
	const { weatherData, loading, currentHourIndex, getWeatherDetails } =
		useWeatherContext();

	if (loading) {
		return (
			<div className="flex justify-center items-center h-40">
				<BeatLoader color="#647c9e" />
			</div>
		);
	}
	const daily = weatherData?.daily;
	const days = daily?.time.slice(0, 7);
	const min_temp = daily?.temperature_2m_min.slice(0, 7);
	const max_temp = daily?.temperature_2m_max.slice(0, 7);
	if (!weatherData || !weatherData.daily) {
		return <p>Weather data is not available.</p>;
	}

	const weatherCodes = daily.weather_code.slice(0, 7);

	const getDayName = (dateStr, index) => {
		if (index == 0) return "Today";
		if (index == 1) return "Tomorrow";
		return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
	};

	return (
		// bg-[#1e293b]
		<div className="bg-[#1e293b] shrink-1 rounded-xl xl:py-6 xl:px-3 lg:py-5 lg:px-3 py-8 px-4 xl:mx-6 lg:mx-3 my-4 xl:text-[16px] lg:text-[13px] text-gray-300 font-bold xl:w-110 lg:w-70 ">
			<p className="xl:text-md  mb-6 px-2 text-gray-300 opacity-75 font-sans">
				7-DAY FORECAST
			</p>

			<div className="flex flex-col space-y-6 lg:space-y-4">
				{days.map((date, index) => {
					const { img, desc } = getWeatherDetails(weatherCodes[index]);
					return (
						<div
							key={index}
							className="flex justify-between hover:bg-[#334155] hover:transition hover:rounded-xl hover:shadow cursor-pointer items-center px-2 py-4.5 border-b-2 border-[#293443] last:border-b-0 pb-8"
						>
							<p className="opacity-70">{getDayName(date, index)}</p>

							<div className="flex items-center gap-2">
								<img src={img} className="w-9 h-10" alt={desc} />
								<p>{desc}</p>
							</div>

							<p className="text-white font-roboto">
								<span className="text-white">
									{Math.round(max_temp[index])}°
								</span>
								<span className="text-gray-300 font-bold opacity-75 ml-1">
									/{Math.round(min_temp[index])}°
								</span>
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default WeeklyForecast;
