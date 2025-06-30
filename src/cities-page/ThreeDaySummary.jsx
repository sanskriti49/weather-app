import { useEffect, useRef } from "react";
import { useWeatherContext } from "../contexts/WeatherContext";
import { useSearch } from "../contexts/SearchContext";
import { ScaleLoader, BeatLoader, MoonLoader } from "react-spinners";

const ThreeDaySummary = () => {
	const {
		loading,
		getWeatherDetails,
		currentHourIndex,
		recentSearchesData,
		city,
	} = useWeatherContext() || {};
	const { recentSearches = [], setRecentSearches } = useSearch();
	//const latestCity = recentSearches[0] || ""; // Ensure it's not undefined
	// const latestWeatherData =
	// 	recentSearches?.[0] ?? recentSearchesData?.[city.toLowerCase()] ?? null; // Ensure it exists
	const recentCity = recentSearches?.[0]?.toLowerCase?.();
	const latestWeatherData =
		recentSearchesData?.[recentCity] ??
		recentSearchesData?.[city.toLowerCase()] ??
		null;

	console.log("recentSearches: ", recentSearches);
	console.log("recentSearchesData: ", recentSearchesData);

	console.log("latestWeatherData: ", latestWeatherData);
	if (loading) {
		return (
			<div className="flex justify-center items-center h-40">
				<BeatLoader color="#647c9e" />
			</div>
		);
	}
	const daily = latestWeatherData?.daily;
	const days = daily?.time.slice(0, 3);
	const min_temp = daily?.temperature_2m_min.slice(0, 3);
	const max_temp = daily?.temperature_2m_max.slice(0, 3);
	if (!latestWeatherData || !latestWeatherData.daily) {
		return <p>Weather data is not available.</p>;
	}
	// Ensure `hourly` data exists before accessing it
	const hourly = latestWeatherData?.hourly ?? {};
	const cityTemp = hourly?.temperature_2m?.[currentHourIndex] ?? "N/A";
	const cityWeatherCode = hourly?.weather_code?.[currentHourIndex] ?? 0;
	const { img, desc } = getWeatherDetails(cityWeatherCode);
	const getDayName = (dateStr, index) => {
		if (index == 0) return "Today";
		if (index == 1) return "Tomorrow";
		return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
	};
	const weatherCodes = hourly?.weather_code
		? hourly.weather_code.slice(0, 3)
		: [];

	const generateTimeSlots = (startHour) => {
		let timeSlots = [];

		for (let i = 0; i < 3; i++) {
			let start = (startHour + i * 3) % 24;

			let time = new Date();
			time.setHours(start, 0, 0, 0);
			timeSlots.push(time);
		}
		return timeSlots;
	};

	const timeSlots = generateTimeSlots(currentHourIndex);
	const hours = hourly?.time ? hourly.time.slice(0, 3) : [];
	const temps = hourly?.temperature_2m ? hourly.temperature_2m.slice(0, 3) : [];

	const currentTime = timeSlots[0].toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

	// Handle precipitation probability
	const precipitationProbability =
		latestWeatherData?.hourly?.precipitation_probability?.[currentHourIndex] ??
		"...";

	// Handle temperature safely
	const temperature =
		latestWeatherData?.hourly?.temperature_2m?.[currentHourIndex] ??
		"Loading...";

	// Handle weather code safely
	const weatherCode =
		latestWeatherData?.hourly?.weather_code?.[currentHourIndex] ?? 0;

	const today = new Date().toISOString().split("T")[0];
	const sunriseIndex = latestWeatherData?.daily?.sunrise?.findIndex((time) =>
		time.startsWith(today)
	);
	const sunsetIndex = latestWeatherData?.daily?.sunset?.findIndex((time) =>
		time.startsWith(today)
	);

	const sunriseTime =
		sunriseIndex !== -1
			? new Date(
					latestWeatherData.daily?.sunrise[sunriseIndex]
			  ).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
			  })
			: null;
	const sunsetTime =
		sunsetIndex !== -1
			? new Date(
					latestWeatherData.daily?.sunset[sunsetIndex]
			  ).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
			  })
			: "N/A";

	const isSunrise = currentTime === sunriseTime;
	const isSunset = currentTime === sunsetTime;
	return (
		<div className="2xl:pt-15 flex flex-col 2xl:pl-0 xl:pl-1 lg:pl-0 sm:pl-10">
			<div className="flex flex-col pb-4 lg:pb-3 px-14 mx-6 h-full border-b-1 border-[#293443]">
				<p className="text-3xl pt-5 pb-4 md:hidden sm:block">
					Three Day Summary
				</p>

				<div className="flex items-center justify-center">
					<div className="flex flex-col pl-20 lg:pl-0">
						<p className="2xl:py-0 pb-2 lg:py-15 sm:py-0 md:pb-0 font-bold 2xl:text-6xl xl:text-4xl lg:text-5xl md:text-5xl text-4xl">
							{city}
						</p>
						<div className="flex text-[#7e7b75] 2xl:text-base xl:text-base lg:text-sm md:text-md sm:text-sm font-semibold">
							Chance of rain:{" "}
							{precipitationProbability !== undefined ? (
								`${precipitationProbability}%`
							) : (
								<p>
									<MoonLoader />
								</p>
							)}
						</div>
						<p className="font-extrabold 2xl:text-[57px] xl:text-[38px] lg:text-[58px] md:text-[50px] text-[40px] mt-8 font-roboto">
							{loading ? (
								<ScaleLoader color="#647c9e" />
							) : (
								`${Math.round(temperature)}°`
							)}
						</p>
					</div>

					<img
						src={img}
						className="xl:w-50 xl:h-45 ml-20 px-15 py-10 xl:ml-0 lg:ml-13 lg:w-50 lg:h-40 w-50 h-40"
					></img>
				</div>
			</div>

			<div className="font-bold text-gray-300 opacity-75  pt-4 pb-3 md:px-9  max-w-full">
				<p className="font-bold text-md lg:text-sm md:text-base pt-2 pb-5 ml-4">
					TODAY'S FORECAST
				</p>

				<div className="flex justify-center pb-8 border-b-1 border-[#334155]  cursor-pointer">
					{hours.map((time, index) => {
						const { img, desc } = getWeatherDetails(weatherCodes[index]);
						return (
							<div
								key={index}
								className="hover:bg-[#334155] hover:transition hover:rounded-xl hover:shadow pt-2 cursor-pointer flex flex-col items-center border-r-2 border-[#293443] last:border-r-0 px-2 md:px-12"
							>
								<p
									key={index}
									className="md:text-[16px] lg:text-sm whitespace-nowrap font-roboto"
								>
									{timeSlots[index].toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
										hour12: true,
									})}
								</p>
								<img
									src={
										isSunrise ? "sunrise.png" : isSunset ? "sunset.png" : img
									}
									className="py-3 w-12 h-16 md:w-14 md:h-20"
									alt={desc}
								/>
								<p className="text-white xl:text-2xl lg:text-[19px] md:text-2xl whitespace-nowrap font-roboto">
									{Math.round(temps[index])}°
								</p>
							</div>
						);
					})}
				</div>
			</div>

			<div className="font-bold text-gray-300 opacity-75  pt-2 pb-10 px-4 md:px-9  ">
				<p className=" 2xl:text-base lg:text-sm md:text-base ">
					3-DAY FORECAST
				</p>

				<div className="flex flex-col cursor-pointer pb-4 lg:pb-2">
					{days.map((date, index) => {
						//	const { img, desc } = getWeatherDetails(weatherCodes[index]);
						return (
							<div
								key={index}
								className="flex 2xl:text-[16px] lg:text-sm justify-between items-center border-b-1 border-[#293443] last:border-b-0 pb-4 lg:pb-2 px-4 pt-4 mt-1 hover:bg-[#334155] hover:transition rounded-xl"
							>
								<p className="opacity-70">{getDayName(date, index)}</p>

								<div className="flex items-center lg:gap-1">
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
		</div>
	);
};

export default ThreeDaySummary;
