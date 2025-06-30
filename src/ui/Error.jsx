import { useRouteError } from "react-router-dom";

const Error = () => {
	const error = useRouteError();

	return (
		<div className="text-center mt-10">
			<h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
			<p className="mt-4 text-gray-600">
				{error?.message || "Unknwon error occurred."}
			</p>
		</div>
	);
};

export default Error;
