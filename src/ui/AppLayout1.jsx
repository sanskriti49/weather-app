import { Outlet, useLocation, useNavigation } from "react-router-dom";
import WeeklyForecast from "../weather-page/WeeklyForecast";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import { useState } from "react";

export default function AppLayout() {
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";
	const location = useLocation();
	const [hoverMenu, setHoverMenu] = useState(false);

	const isMapPage = location.pathname.includes("/map");

	return (
		<div className="relative">
			{isLoading && <Loader />}

			<div
				className={` 
		${
			isMapPage
				? "grid grid-cols-1 lg:grid-cols-[auto_1fr]"
				: "grid grid-cols-1 lg:grid-cols-[auto_minmax(40px,_800px)_0.5fr] xl:grid-cols-[80px_minmax(700px,_890px)_1fr]"
		}
		lg:h-screen px-4 pt-1 pb-4 items-start`}
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
