import RecentCitiesList from "../cities-page/RecentCitiesList";
import Search from "../ui/Search";
import Map from "./Map";

const MapPage = () => {
	return (
		<div className="flex flex-col lg:flex-row gap-12 sm:gap-11 lg:gap-2">
			{/* Left side: Search and Map */}
			<div className="w-full flex flex-col">
				<div className="lg:ml-4 w-full ">
					<Search isCitiesSearchPage={true} />
				</div>
				{/* Map Container with Aspect Ratio */}
				{/* <div className="lg:ml-8 min-w-fit w-[500px] sm:w-[580px] md:w-[728px] lg:w-[500px] xl:w-[680px] 2xl:w-[770px] min-h-[400px] aspect-square sm:ml-2 object-cover py-2 my-5 mx-4 rounded-2xl flex items-center justify-center cursor-grab flex-1"> */}
				<div className="relative aspect-4/3 max-w-full object-fill sm:ml-2 lg:ml-8 py-2 my-5 mx-4">
					<Map />
				</div>
			</div>

			{/* Right side: Recent Cities List */}
			<div className=" mt-4 lg:mt-0">
				<p className="lg:hidden font-bold text-2xl  ml-7">
					Recently searched cities:
				</p>

				<div className="w-full flex-1 ">
					<RecentCitiesList isMapPage={true} />
				</div>
			</div>
		</div>
	);
};

export default MapPage;

// const MapPage = () => {
// 	return (
// 		<div className="">
// 			{/* Responsive grid: 1 column by default, 2 on large screens */}
// 			<div className="flex flex-col lg:flex-row gap-12 sm:gap-11 lg:gap-2">
// 				{/* Left side: Search and Map */}
// 				<div className="flex flex-col ">
// 					{/* <div className="lg:ml-2 w-[428px] sm:w-[500px]  md:w-[728px]  lg:w-[590px] xl:w-[680px] 2xl:w-[770px]  "> */}
// 					<div className="lg:ml-2 w-[428px] sm:w-[500px]  md:w-[728px]  lg:w-[590px] xl:w-[680px] 2xl:w-[770px]  ">
// 						<Search isCitiesSearchPage={true} />
// 					</div>
// 					{/* <div className="min-w-[400px] min-h-[560px] sm:w-[560px] h-[450px] sm:h-[500px] md:w-[730px] md:h-[400px] lg:w-[570px] lg:h-[500px] xl:w-[660px] xl:h-[545px]  2xl:w-[750px] 2xl:h-[557px] py-2 my-5 mx-4 rounded-2xl flex items-center justify-center cursor-grab shrink"> */}
// 					{/* <div className="min-w-[400px] min-h-[560px] h-full py-2 my-5 mx-4 rounded-2xl flex items-center justify-center cursor-grab flex-1"> */}
// 					<div className="min-w-[400px] aspect-w-16 aspect-h-9 py-2 my-5 mx-4 rounded-2xl flex items-center justify-center cursor-grab">

// 						<Map />
// 					</div>
// 					{/* <div className="cursor-grab shrink sm:min-w-[500px] sm:max-w-[650px] md:min-w-[600px] md:max-w-[790px] lg:max-w-[850px] h-[450px]"> */}
// 				</div>

// 				{/* Right side: Recent Cities List */}
// 				<div className="mt-4 lg:mt-0 ml-7">
// 					<p className="lg:hidden font-bold text-2xl">
// 						Recently searched cities:{" "}
// 					</p>
// 					<RecentCitiesList isMapPage={true} />
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// import CitiesSearchPage from "../cities-page/CitiesSearchPage";
// import RecentCitiesList from "../cities-page/RecentCitiesList";
// import Search from "../ui/Search";
// import Map from "./Map";

// const MapPage = () => {
// 	return (
// 		<div className="">
// 			{/* Responsive grid: 1 column by default, 2 on large screens */}
// 			{/* <div className="min-w-[200px] max-w-[800px] flex flex-col lg:flex-row gap-12 sm:gap-11 lg:gap-2"> */}
// 			<div className="min-w-[200px] max-w-[800px] flex flex-col lg:flex-row gap-12 sm:gap-11 lg:gap-2">
// 				{/* Left side: Search and Map */}
// 				<div className="flex flex-col shrink">
// 					<div className="lg:ml-2 w-[428px] sm:w-[500px]  md:w-[728px]  lg:w-[590px] xl:w-[680px] 2xl:w-[770px]  ">
// 						<Search isCitiesSearchPage={true} />
// 					</div>
// 					<div className="h-[450px] sm:h-[500px] md:w-[730px] md:h-[400px] lg:w-[570px] lg:h-[500px] xl:w-[660px] xl:h-[545px]  2xl:w-[750px] 2xl:h-[557px] py-2 my-5 mx-4 rounded-2xl flex items-center justify-center cursor-grab flex-1">
// 						{/* <div className="h-[450px] sm:h-[500px]  md:h-[400px] lg:h-[500px] xl:h-[545px] 2xl:h-[557px] py-2 my-5 mx-4 cursor-grab flex-1"> */}
// 						<Map />
// 					</div>
// 				</div>

// 				{/* Right side: Recent Cities List */}
// 				<div className="mt-4 lg:mt-0 ml-7">
// 					<p className="lg:hidden font-bold text-2xl">
// 						Recently searched cities:{" "}
// 					</p>
// 					<RecentCitiesList isMapPage={true} />
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default MapPage;
