import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "./map.css";

import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvents,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useWeatherContext } from "../contexts/WeatherContext";
import useGeoLocation from "../hooks/useGeoLocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { BeatLoader } from "react-spinners";

import L from "leaflet";

const redMarkerIcon = new L.Icon({
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
});

const Map = () => {
	const navigate = useNavigate();

	//const position = [51.505, -0.09];
	const {
		weatherData,
		loading,
		selectedLocation,
		currentHourIndex,
		recentSearchesData,
		getWeatherDetails,
		fetchWeatherData,
		setRecentSearches,
		fetchCityData,
	} = useWeatherContext();
	const {
		isLoading: isLoadingPosition,
		location: geoLocationPosition,
		getPosition,
		isFetched: hasGPSed,
	} = useGeoLocation();

	const [mapPosition, setMapPosition] = useState(null); // start as null

	const [isClicked, setIsClicked] = useState(false);

	const [clickedLocation, setClickedLocation] = useState(null);
	const [clickedCityInfo, setClickedCityInfo] = useState(null);

	const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
	const [geocodingError, setGeocodingError] = useState("");

	//	console.log(geoLocationPosition?.latitude, geoLocationPosition?.longitude);
	useEffect(() => {
		if (
			selectedLocation &&
			selectedLocation.latitude &&
			selectedLocation.longitude
		) {
			setMapPosition({
				lat: selectedLocation.latitude,
				lng: selectedLocation.longitude,
			});
		}
	}, [selectedLocation]);

	//console.log("SELECTED LOCA: ", selectedLocation);

	const recentLocations = Object.entries(recentSearchesData).map(
		([cityName, data]) => ({
			name: cityName,
			latitude: data.latitude,
			longitude: data.longitude,
			temp: data?.hourly.temperature_2m?.[currentHourIndex],
			wea_code: data?.hourly.weather_code?.[currentHourIndex] ?? 0,
		})
	);

	// useEffect(() => {
	// 	async function fetchCityData() {
	// 		if (!clickedLocation) return;

	// 		setIsLoadingGeocoding(true);
	// 		setGeocodingError("");

	// 		try {
	// 			const res = await fetch(
	// 				`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${clickedLocation.lat}&longitude=${clickedLocation.lng}`
	// 			);
	// 			const data = await res.json();

	// 			console.log("⏳ Fetching geocoding for", clickedLocation);

	// 			setClickedCityInfo({
	// 				cityName: data.city || data.locality || "",
	// 				country: data.countryName,
	// 				countryCode: data.countryCode?.toUpperCase(),
	// 			});
	// 		} catch (error) {
	// 			setGeocodingError(error.message || "Failed to fetch city data.");
	// 			console.error(error);
	// 		} finally {
	// 			setIsLoadingGeocoding(false);
	// 		}
	// 	}

	// 	if (clickedLocation) {
	// 		fetchCityData();
	// 	}
	// }, [clickedLocation]);

	useEffect(() => {
		async function loadCityInfo() {
			if (!clickedLocation) return;

			setIsLoadingGeocoding(true);
			setGeocodingError("");

			try {
				const cityInfo = await fetchCityData(
					clickedLocation.lat,
					clickedLocation.lng
				);
				console.log("⏳ Fetched geocoding:", cityInfo);

				// Optional: check if it’s really a city
				// if (!data.countryCode) {
				// 	throw new Error("That doesn't seem to be a city. Click somewhere else 🙂");
				// }
				setClickedCityInfo(cityInfo);
			} catch (error) {
				setGeocodingError(error.message);
			} finally {
				setIsLoadingGeocoding(false);
			}
		}

		loadCityInfo();
	}, [clickedLocation]);

	useEffect(() => {
		console.log("CLICKED LOCA: ", clickedCityInfo); // just note: logs every render
	}, [clickedCityInfo]);

	const handleGetWeather = () => {
		if (clickedLocation) {
			fetchWeatherData(
				clickedLocation.lat,
				clickedLocation.lng,
				false,
				setRecentSearches
			);

			setIsClicked(false);
			setClickedLocation(null); // ✅ Prevent stale rendering
			setClickedCityInfo(null);

			navigate("/");
		}
	};

	if (
		!selectedLocation ||
		selectedLocation.latitude == null ||
		selectedLocation.longitude == null ||
		!mapPosition
	)
		return <div>Loading map...</div>;

	return (
		<div className="w-full h-full rounded-2xl overflow-hidden relative z-10  mr-5">
			{!geoLocationPosition && !hasGPSed && (
				<button onClick={getPosition}>
					{isLoadingPosition ? "Loading...:" : "Use your posiiton"}
				</button>
			)}
			<MapContainer
				center={
					geoLocationPosition &&
					geoLocationPosition.latitude &&
					geoLocationPosition.longitude
						? [geoLocationPosition.latitude, geoLocationPosition.longitude]
						: [mapPosition.lat, mapPosition.lng]
				}
				zoom={7}
				scrollWheelZoom={true}
				style={{ width: "100%", height: "100%" }} // Explicitly set size
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
				/>
				{recentLocations.map((location, index) => {
					const { img, desc } = getWeatherDetails(location.wea_code);

					const key = `${location.latitude}-${location.longitude}`;

					return (
						<Marker
							key={key}
							position={[location.latitude, location.longitude]}
						>
							<Popup className="leaflet-popup-custom">
								{/* <div className="backdrop-blur-md bg-slate-800/60 rounded-xl text-slate-100 shadow-xl w-[120px] h-[140px]"> */}
								<div>
									<p className="font-bold text-base text-sky-100">
										{location.name.charAt(0).toUpperCase() +
											location.name.slice(1)}
									</p>
									<div className="flex flex-col items-center text-sky-100">
										<img
											src={img}
											className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12"
											alt={desc}
										/>
										<p className="text-base">{Math.round(location.temp)}°C</p>
									</div>
								</div>
							</Popup>
						</Marker>
					);
				})}
				{isClicked && clickedLocation && (
					<Marker
						position={[clickedLocation.lat, clickedLocation.lng]}
						icon={redMarkerIcon}
					>
						<Popup className="leaflet-popup-custom">
							{/* <div className="backdrop-blur-md bg-slate-800/60 rounded-xl text-slate-100 shadow-xl w-[120px] h-[140px]"> */}
							{isLoadingGeocoding && <BeatLoader />}
							{geocodingError && <p>{geocodingError}</p>}

							{clickedCityInfo && (
								<div>
									<p className="font-bold text-base text-sky-100">
										{clickedCityInfo.cityName}, {clickedCityInfo.country}
									</p>
									<button
										className="popup-weather-btn"
										onClick={handleGetWeather}
									>
										Get Weather Info{" "}
									</button>
								</div>
							)}
						</Popup>
					</Marker>
				)}
				;
				<ChangeCenter position={mapPosition} />
				<DetectClick
					setClickedLocation={setClickedLocation}
					setIsClicked={setIsClicked}
				/>
			</MapContainer>
		</div>
	);
};

function ChangeCenter({ position }) {
	const map = useMap();

	useEffect(() => {
		map.setView(position);
	}, [map, position]);
	return null;
}
function DetectClick({ setClickedLocation, setIsClicked }) {
	const navigate = useNavigate();

	useMapEvents({
		click: (e) => {
			console.log(e);

			const target = e.originalEvent.target;
			if (target.closest(".leaflet-popup")) return;

			//interacting w the map by cliking on it and storing data in url

			navigate(`?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
			//			window.confirm("Do you want to find temp for this location?: ");
			setIsClicked(true);
			setClickedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
		},
	});
}

export default Map;

{
	/* <Popup className="leaflet-popup-custom ">
								<div
									className="backdrop-blur-xl bg-blue-100/10 rounded-xl text-slate-100 shadow-xl w-[120px]"
									style={{
										backdropFilter: "blur(10px)",
										WebkitBackdropFilter: "blur(10px)",
										backgroundColor: "rgba(30,41,59,0.4)",
										// marginTop: "-25px",
										color: "#f8fafc",
									}}
								>
									<p className="font-bold text-base text-blue-100">
										{location.name.charAt(0).toUpperCase() +
											location.name.slice(1)}
									</p>
									
									<div className="flex flex-col items-center text-blue-100">
										<img
											src={img}
											className="xl:w-12 xl:h-12 lg:w-10 lg:h-10 w-8 h-8"
											alt={desc}
										/>
										<p className="text-base">{Math.round(location.temp)}°C</p>
									</div>
								</div>
							</Popup> */
}
