import React, { useEffect, useState, useRef, useCallback } from "react";
import debounce from "lodash/debounce";

import { MoonLoader } from "react-spinners";

const LOCATIONIQ_API_KEY = "pk.97f6890a4afdd4a0ac0a21f5c62f7d39";
const API_URL = "https://api.locationiq.com/v1/autocomplete.php";

const LocationIQAutocomplete = ({ onLocationSelect }) => {
	const [flagUrls, setFlagUrls] = useState({});
	const flagApiKey = "b0hoJrx6PR7q43Dwrbbg7g==1Qr9NrStxQ5Giwbb";

	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const isDropdownRef = useRef(null);
	const cache = new Map();

	const fetchSuggestions = useCallback(async (input) => {
		if (input.length < 3) return;

		if (cache.has(input)) {
			setSuggestions(cache.get(input));
			return;
		}

		try {
			const response = await fetch(
				`${API_URL}?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
					input
				)}&format=json&limit=5`
			);
			const data = await response.json();
			console.log("LocationIQ API Response:", data); // Add this for debugging

			if (Array.isArray(data)) {
				cache.set(input, data); // Store in cache
				setSuggestions(data);
			}

			const flagRequests = data.map(async (location) => {
				if (!location?.address?.country_code) return null; // Ensure country exists

				const country = location?.address?.country_code;
				try {
					const flagResponse = await fetch(
						`https://api.api-ninjas.com/v1/countryflag?country=${country}`,
						{
							headers: { "X-Api-Key": flagApiKey },
						}
					);
					const flagData = await flagResponse.json();

					const flagUrl =
						flagData.square_image_url || flagData.rectangle_image_url;
					if (flagUrl) {
						return { country, flagUrl: flagUrl };
					}
					return null;
				} catch (err) {
					console.error(`Error fetching flag for ${country}:`, err);
					return null;
				}
			});

			const flagResults = await Promise.all(flagRequests);
			const flagMap = {};
			flagResults.forEach((result) => {
				if (result && result.country && result.flagUrl) {
					flagMap[result.country] = result.flagUrl;
				}
			});

			setFlagUrls(flagMap);
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	}, []);

	const debouncedFetchSuggestions = useRef(
		debounce((input) => fetchSuggestions(input), 200)
	).current;

	const handleInputChange = (e) => {
		setQuery(e.target.value);
		debouncedFetchSuggestions(e.target.value);
	};

	const handleSelect = (suggestion) => {
		setQuery(suggestion.display_name);
		setSelectedLocation(suggestion);
		setSuggestions([]); // hide suggestions after selection
		setQuery("");
		onLocationSelect(suggestion);
		//setActivePage("weather");
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (selectedLocation) {
				onLocationSelect(selectedLocation);
			} else {
				console.error("No location selected.");
			}
		}
	};

	useEffect(() => {
		if (selectedLocation) {
			console.log(
				`You have selected ${selectedLocation.display_name}`,
				selectedLocation
			);
		}
	}, [selectedLocation]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (
				isDropdownRef.current &&
				!isDropdownRef.current.contains(event.target)
			) {
				setSuggestions([]); // Close dropdown when clicking outside
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="container relative z-1">
			<div id="search-box">
				{/* <div className="absolute inset-y-0 start-0 flex items-center ps-3 xl:mx-0  lg:mx-[clamp(50px,20px)] md:mx-[clamp(10px,40px)]  pointer-events-none"> */}
				<div className="absolute inset-y-0 flex items-center justify-start ps-3 pointer-events-none">
					<svg
						className="w-4 h-4 text-gray-500 dark:text-gray-400"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 20"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
						/>
					</svg>
				</div>
				<input
					type="text"
					// className={`block w-full py-4 ps-10 text-md text-gray-900 border-gray-300 focus:outline-0 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-[#202b3b] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
					// 	 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
					className="block hover:bg-[#374252] focus:bg-[#374252] w-full py-4 ps-12 text-md text-gray-900 border-gray-300 focus:outline-0 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:bg-[#202b3b] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					id="search-box-input"
					value={query}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder="Search for a location..."
				/>
				{suggestions.length > 0 && (
					<div ref={isDropdownRef}>
						<ul className="autocomplete-dropdown md:w-[1/2] sm:w-[1/2] xl:w-full lg:w-full absolute px-2  py-2 md:px-1 md:py-1 dark:bg-[#202b3bcc] border border-gray-500  backdrop-contrast-125 backdrop-blur-xl dark:border-gray-900  rounded-lg text-[22px] shadow-md max-h-100 mt-2 overflow-y-auto z-50">
							{suggestions.map((suggestion, index) => (
								<div
									key={index}
									className="flex justify-between items-center border-b-2 border-[#5e646c] hover:bg-[#334155]  rounded-xl pr-2 last:border-b-0"
								>
									<li
										className="py-2 pl-4 w-full"
										onClick={() => {
											handleSelect(suggestion);
										}}
									>
										<strong>{suggestion.display_place}</strong>
										<br />
										<small className="text-base">
											{suggestion.address && (
												<>
													{suggestion.address.city &&
														`${suggestion.address.city}, `}
													{suggestion.display_address}
												</>
											)}{" "}
										</small>
									</li>

									{flagUrls[suggestion.address?.country_code] ? (
										<img
											src={flagUrls[suggestion.address.country_code]}
											alt={` Flag`}
											onError={(e) => {
												e.target.style.display = "none"; // Hide if image fails to load
											}}
											className="w-8 h-6 object-cover"
										/>
									) : (
										<div className="text-sm">
											<MoonLoader size="25px" color="#334155" />
										</div>
									)}
								</div>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default LocationIQAutocomplete;
