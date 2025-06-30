import { useState, useEffect } from "react";

const useGeoLocation = () => {
	const [location, setLocation] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isFetched, setIsFetched] = useState(false);

	useEffect(function getPosition() {
		if (!navigator.geolocation) {
			setError("Geolocation not supported");
			setLoading(false);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const coords = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					source: "gps",
				};
				setLocation(coords);
				setIsFetched(true);
			},
			(err) => {
				setError(err.message || "Failed to get location");
				setLocation(null);
			}
		);
	}, []);

	useEffect(() => {
		if (location || !error) {
			setLoading(false);
		}
	}, [location, error]);

	return { location, error, loading, isFetched };
};

export default useGeoLocation;
