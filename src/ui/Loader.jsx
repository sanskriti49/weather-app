import React from "react";
import { BounceLoader, GridLoader } from "react-spinners";

export default function Loader() {
	return (
		<div className="fixed inset-0 z-500 flex items-center justify-center bg-auto/10 backdrop-blur-md">
			<GridLoader size="18px" color="#6b88b1" />{" "}
		</div>
	);
}
