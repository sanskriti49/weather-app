import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useNavigate,
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import { WeatherProvider } from "./contexts/WeatherContext";
import { SearchProvider } from "./contexts/SearchContext";
import "leaflet/dist/leaflet.css";

import { WeatherPage } from "./weather-page/WeatherPage";

import CitiesSearchPage from "./cities-page/CitiesSearchPage";
import ThreeDaySummary from "./cities-page/ThreeDaySummary";

import Loader from "./ui/Loader";
import AppLayout from "./ui/AppLayout";
import Error from "./ui/Error";
import MapPage from "./map-page/MapPage";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		errorElement: <Error />,
		children: [
			{ path: "/", element: <Navigate to="/weather" replace /> },
			{
				path: "/weather",
				element: (
					<ProtectedRoute>
						<WeatherPage />
					</ProtectedRoute>
				),
			},
			{
				path: "/cities",
				element: (
					<ProtectedRoute>
						<CitiesPage />
					</ProtectedRoute>
				),
			},
			{
				path: "/map",
				element: (
					<ProtectedRoute>
						<MapPage />
					</ProtectedRoute>
				),
			},
		],
	},
]);

function CitiesPage() {
	return (
		<div className="flex flex-col 2xl:flex-row xl:flex-row lg:flex-row w-full gap-4">
			<div className="shrink-1">
				<CitiesSearchPage />
			</div>
			<div className="shrink-1">
				<ThreeDaySummary />
			</div>
		</div>
	);
}

export default function App() {
	return (
		<WeatherProvider>
			<SearchProvider>
				<RouterProvider
					router={router}
					fallbackElement={<Loader />}
				></RouterProvider>
			</SearchProvider>
		</WeatherProvider>
	);
}
