//http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid={802d1f745a2b95c325eefcc85f9feb27}

import useWeather from "../hooks/useWeather";
import { useSearch } from "../contexts/SearchContext";
import LocationIQAutocomplete from "./LocationIQAutocomplete";
import { Link, useOutletContext } from "react-router-dom";
import { useWeatherContext } from "../contexts/WeatherContext";

const Search = ({
	setCity,
	setWeatherData,
	onSearchFocus,
	isCitiesSearchPage,
}) => {
	const { fetchWeatherData } = useWeatherContext();
	const { recentSearches, setRecentSearches } = useSearch();
	const { searchQuery, setSearchQuery } = useSearch();
	const { setHoverMenu } = useOutletContext();
	//	const [hoverTimeout, setHoverTimeout] = useState(null);

	//const { hoverMenu, setHoverMenu } = useState(false);

	const handleLocationSelect = (selectedLocation) => {
		if (selectedLocation) {
			const { lat, lon, display_name } = selectedLocation;
			if (!lat || !lon) {
				console.error("Invalid latitude or longitude:", lat, lon);
				return;
			}

			setSearchQuery(
				display_name || selectedLocation.display_name || "Unknown Location"
			);
			fetchWeatherData(parseFloat(lat), parseFloat(lon));

			setRecentSearches((prev) => {
				const cityName =
					display_name || selectedLocation.display_name || "Unknown Location";
				if (!cityName) return prev;

				const formattedCityName = cityName.split(",")[0].trim().toLowerCase();
				const newSearches = [
					formattedCityName,
					...prev.filter(
						(q) =>
							q.trim().toLowerCase() !== formattedCityName.trim().toLowerCase()
					),
				];
				return newSearches.slice(0, 5);
			});
		}
	};
	const capitalizeFirstLetter = (str) => {
		return str
			.split(" ") // Split into words
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
			.join(" "); // Join them back
	};

	function hoverSidebar() {
		setHoverMenu(true);
	}

	return (
		<div className="flex md:min-w-full mx-0 md:mx-2">
			<div className="w-full ml-2 py-5">
				<form className="w-full" onSubmit={(e) => e.preventDefault()}>
					<label htmlFor="search" className="sr-only">
						Search
					</label>
					<div className="relative">
						<div
							className={`flex justify-center search-container ${
								isCitiesSearchPage ? "small" : "large"
							} items-center cursor-pointer`}
						>
							<div
								className="logo-container xl:hidden lg:hidden bg-[#263b56]  rounded-2xl mr-3"
								onClick={hoverSidebar}
								onMouseEnter={() => setHoverMenu(true)}
								onMouseLeave={(e) => {
									if (!e.relatedTarget?.closest(".sidebar-container")) {
										setHoverMenu(false);
									}
								}}
							>
								{/* <Link to="/weather" className="flex items-center"> */}
								<img
									src="wind-logo.png"
									className="cursor-pointer  w-16 h-14 p-1 md:w-14 md:h-14  transform transition-transform duration-200 hover:scale-105"
								/>
								{/* </Link> */}
							</div>
							<LocationIQAutocomplete
								onLocationSelect={handleLocationSelect}
								onSearchFocus={onSearchFocus}
							/>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Search;
