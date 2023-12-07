// PrivateRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ element, fallbackPath }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  return isAuthenticated ? (
    <Route element={element} />
  ) : (
    <Navigate to={authentication/sign-up} replace />
  );
};

export default PrivateRoute;

