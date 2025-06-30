import { createContext, useContext, useState, useRef, useEffect } from "react";

const SearchContext = createContext({
	recentSearches: [],
	setRecentSearches: () => {}, // Provide a default function to avoid `undefined`
});

export const SearchProvider = ({ children }) => {
	const [recentSearches, setRecentSearches] = useState(() => {
		const storedSearches = localStorage.getItem("recentSearches");

		return storedSearches && storedSearches !== "undefined"
			? JSON.parse(storedSearches)
			: [];
	});
	const mostRecentRef = useRef(null);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
	}, [recentSearches]);

	// Update ref whenever recentSearches change
	useEffect(() => {
		if (recentSearches.length > 0) {
			mostRecentRef.current = recentSearches[0]; // Always store the latest search
		}
	}, [recentSearches]);

	return (
		<SearchContext.Provider
			value={{
				searchQuery,
				setSearchQuery,
				mostRecentRef,
				recentSearches,
				setRecentSearches,
			}}
		>
			{children}
		</SearchContext.Provider>
	);
};

// Custom hook to use context
export const useSearch = () => useContext(SearchContext);
