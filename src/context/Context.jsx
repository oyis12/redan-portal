import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [baseUrl] = useState("https://cutlist.onrender.com/api/v1");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userBlockedStatus, setUserBlockedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const savedUser = Cookies.get("loggedInUser");
    const savedToken = Cookies.get("accessToken");

    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.phoneNumber) {
          if (isMounted) {
            setLoggedInUser(user);
            setAccessToken(savedToken);
            setUserBlockedStatus(user.blockedStatus || "active");
          }
        } else {
          throw new Error("Invalid user data");
        }
      } catch (error) {
        Cookies.remove("loggedInUser");
        Cookies.remove("accessToken");
        if (isMounted) navigate("/admin-login");
      }
    } else {
      if (isMounted) navigate("/admin-login");
    }

    // Set loading to false after user check
    if (isMounted) {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    Cookies.set(name, value, {
      expires,
      secure: true,
      sameSite: "Strict",
    });
  };

  const login = (userData, token) => {
    setLoggedInUser(userData);
    setAccessToken(token);
    setUserBlockedStatus(userData.blockedStatus || "active");
    setCookie("loggedInUser", JSON.stringify(userData)); // Expire in 1 hour
    setCookie("accessToken", token); // Expire in 1 hour
  };

  const logout = () => {
    setLoggedInUser(null);
    setAccessToken(null);
    setUserBlockedStatus("active");
    Cookies.remove("loggedInUser");
    Cookies.remove("accessToken");
    navigate("/admin-login");
  };

  // Show loader only if user is null and loading is true
  if (isLoading && loggedInUser === null) {
    return (
      <div className="w-full h-screen flex justify-center items-center flex-col">
        <div className="p-4 text-xl font-bold flex items-center">
          <img src={logo} alt="" className="logo animate-fadeIn" />
          <h2 className="text-[2rem] ml-2 animate-slideIn cutlist">Cutlist</h2>
        </div>
        <div className="loader"></div> {/* Loader */}
      </div>
    );
  }

  return (
    <Context.Provider
      value={{
        baseUrl,
        loggedInUser,
        setLoggedInUser,
        accessToken,
        login,
        logout,
        userBlockedStatus,
        setUserBlockedStatus,
      }}
    >
      {children}
    </Context.Provider>
  );
};
