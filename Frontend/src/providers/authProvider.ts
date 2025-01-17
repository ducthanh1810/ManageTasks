import { AuthProvider, HttpError } from "@refinedev/core";
import { API_BASE_URL } from "./data";
export const TOKEN_KEY = "refine-auth";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const userCredentials = {
      username: email,
      password: password,
    };
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: "POST",
      body: JSON.stringify(userCredentials),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.access) {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      return { success: true, redirectTo: "/" };
    }

    return { success: false };
  },
  register: async ({ username, password, providerName }) => {
    const response = await fetch(`${API_BASE_URL}/user/register/`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        email: "",
        last_name: "",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: any = await response.json();
    if (response.status < 200 || response.status > 299) {
      try {
        if (data.username[0] == "A user with that username already exists.")
          return {
            success: false,
            error: {
              name: "Register Error",
              message: "Username already exist",
            },
          };
      } catch {}
      return {
        success: false,
        error: {
          name: "Register Error",
          message: "Invalid email or password",
        },
      };
    }
    return {
      success: true,
      successNotification: {
        name: "Register Success",
        message: "You have successfully registered",
      },
      redirectTo: "/login",
    };
  },
  // --
  check: async () => {
    const token = localStorage.getItem("access_token");

    return { authenticated: Boolean(token) };
  },
  logout: async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/token/me`, {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    });

    if (response.status < 200 || response.status > 299) {
      return null;
    }

    const data = await response.json();

    return data;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
