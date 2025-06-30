import CitiesSearchPage from "./CitiesSearchPage";
import ThreeDaySummary from "./ThreeDaySummary";

export default function CitiesPage() {
	return (
		<div className="flex flex-row lg:flex-col w-full">
			<div className="w-full mr-2">
				<CitiesSearchPage />
			</div>
			<div className="w-full lg:w-1/2">
				<ThreeDaySummary />
			</div>
		</div>
	);
}
