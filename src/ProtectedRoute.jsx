import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
	//const navigate = useNavigate();

	//replace means navigate to / and replace the current entry in the browser's history stack.
	return children;
};

export default ProtectedRoute;
// if (!isAuthenticated) return <Navigate to="/" replace />;
