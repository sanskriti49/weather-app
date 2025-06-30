import { Outlet, useLocation, useNavigation } from "react-router-dom";
import WeeklyForecast from "../weather-page/WeeklyForecast";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import { useEffect, useState } from "react";

export default function AppLayout() {
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";
	const location = useLocation();
	const [hoverMenu, setHoverMenu] = useState(false);
	const [fakeLoading, setFakeLoading] = useState(false);

	const isMapPage = location.pathname.includes("/map");
	const isCitiesPage = location.pathname.includes("/cities");
	const isWeatherPage = location.pathname.includes("/weather");

	useEffect(() => {
		setFakeLoading(true);
		const timeout = setTimeout(() => setFakeLoading(false), 400);
		return () => clearTimeout(timeout);
	}, [location]);

	let layoutClass =
		"grid grid-cols-1 lg:grid-cols-[auto_minmax(40px,_800px)_0.5fr] lg:gap-5 xl:grid-cols-[80px_minmax(700px,_890px)_1fr] lg:h-screen";

	if (isMapPage) {
		layoutClass = "grid grid-cols-[auto_minmax(100px,_1300px)_0.5fr]";
	} else if (isCitiesPage) {
		layoutClass = "grid grid-cols-[auto_minmax(100px,_900px)_auto]";
	}
	return (
		<div className="relative">
			{fakeLoading && <Loader />}

			{/* <div className="grid grid-cols-1 lg:grid-cols-[auto_minmax(40px,_800px)_0.5fr] xl:grid-cols-[80px_minmax(700px,_890px)_1fr] lg:h-screen px-4 pt-1 pb-4 items-start"> */}
			<div
				className={` 
		${layoutClass} pt-1 pb-0 `}
			>
				{/* <div className="hidden lg:block">
					<Sidebar hoverMenu={hoverMenu} setHoverMenu={setHoverMenu} />
				</div> */}
				<Sidebar hoverMenu={hoverMenu} setHoverMenu={setHoverMenu} />

				<div className="flex flex-col ml-7">
					<Outlet context={{ setHoverMenu }} />
				</div>

				{location.pathname === "/weather" && (
					<div className="hidden 2xl:block xl:block lg:block">
						<WeeklyForecast weather={null} />
					</div>
				)}
			</div>
		</div>
	);
}
