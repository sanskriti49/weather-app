import { useRef, useCallback } from "react";

const CityRefs = ({ mostRecentRef }) => {
	const clickedCityref = useRef(null);

	const setRefs = useCallback(
		(node) => {
			if (node) {
				if (mostRecentRef) mostRecentRef.current = node;
				if (clickedCityref) clickedCityref.current = node;
			}
		},
		[mostRecentRef, clickedCityRef]
	);
	return <div ref={setRefs}>CityRefs</div>;
};

export default CityRefs;
