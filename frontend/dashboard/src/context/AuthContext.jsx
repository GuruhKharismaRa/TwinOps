import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiFetch } from "@/services/api";
// import { useAuth } from "@/context/AuthContext.jsx";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {

    loadUser();

    loadPermissions();

  }, []);

  async function refreshAuth() {

    await loadUser();

    await loadPermissions();

  }

  async function loadUser() {

    try {

      const response =
        await apiFetch("/auth/me");

      if (response.status === "success") {

        setUser(response.data);

      }

    } catch (error) {

      console.error(
        "Failed load user",
        error
      );

    }
  }

  async function loadPermissions() {

    try {

      const response =
        await apiFetch(
          "/auth/permissions"
        );

      if (response.status === "success") {

        setPermissions(
          response.data.permissions
        );

      }

    } catch (error) {

      console.error(
        "Failed load permissions",
        error
      );

    }
  }

  const hasPermission = (
    permission
  ) => {

    return permissions.includes(
      permission
    );

  };

  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
        permissions,
        hasPermission,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>

  );
}

export function useAuth() {
  return useContext(AuthContext);
}