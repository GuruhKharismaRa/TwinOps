import { Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext.jsx";

// import usePermission
//   from "@/hooks/usePermission";

export default function PermissionGuard({
  permission,
  children
}) {


 
  const { permissions } = useAuth();

  if (!permissions.includes(permission)) {
     return <Navigate to="/" />;
  }

 
  return children;
}