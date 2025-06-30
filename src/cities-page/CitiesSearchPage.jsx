import { useEffect, useRef, useState, useCallback } from "react";
import { useWeatherContext } from "../contexts/WeatherContext";
import { useSearch } from "../contexts/SearchContext";
import useWeather from "../hooks/useWeather";
import Search from "../ui/Search";
import { useNavigate } from "react-router-dom";
import RecentCitiesList from "./RecentCitiesList";

const CitiesSearchPage = () => {
	// if (loading) return <p>Loading...</p>; // ✅ Ensure hooks are called before this
	// console.log("Recent Searches:", recentSearches);
	// console.log("Recent Searches Data:", recentSearchesData);

	return (
		<>
			<div className="flex flex-col ">
				<Search isCitiesSearchPage={true} />
				<RecentCitiesList isMapPage={false} />
			</div>
		</>
	);
};
export default CitiesSearchPage;
