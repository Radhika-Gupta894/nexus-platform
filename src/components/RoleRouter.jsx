import React from "react";
import { Navigate } from "react-router-dom";

const RoleRouter = ({ user }) => {
  // Since App.jsx now syncs the role into the user object, we can use it directly
  const role = user?.role || "user";

  // Admin Access
  if (role === "admin") return <Navigate to="/admin" replace />;
  
  // Volunteer Access
  if (role === "volunteer") return <Navigate to="/volunteer" replace />;
  
  // Standard Citizen Access
  return <Navigate to="/user" replace />;
};

export default RoleRouter;