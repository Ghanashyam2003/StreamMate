// src/context/AuthContext.jsx
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";           // e.g. "http://localhost:8000"

export const AuthContext = createContext(null);

/* ---------------------------  custom hook  ----------------------- */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

/* ---------------------------  axios client  ---------------------- */
const api = axios.create({
  baseURL: `${server}/api/v1/users`
});

/* ---------------------------  provider  -------------------------- */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // user object or null
  const navigate = useNavigate();

  /* ---------------------------------------------------------------
     If a token already exists (page refresh) -> keep user “logged in”
  ---------------------------------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
  }, []);

  /* -------------------------  register  ------------------------- */
  const register = async (name, username, password) => {
    try {
      const res = await api.post("/register", { name, username, password });
      if (res.status === 201) return { ok: true, msg: res.data.message };
    } catch (err) {
      return { ok: false, msg: err.response?.data?.message || "register failed" };
    }
  };

  /* ---------------------------  login  -------------------------- */
  const login = async (username, password) => {
    try {
      const res = await api.post("/login", { username, password });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        setUser({ username, token: res.data.token });
        navigate("/home");
        return { ok: true };
      }
    } catch (err) {
      return { ok: false, msg: err.response?.data?.message || "login failed" };
    }
  };

  /* -----------------------  history APIs  ----------------------- */
  const getHistory = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/get-history", { params: { token } });   // ✅ route fixed
    return res.data;
  };

  const addToHistory = async (meetingCode) => {
    const token = localStorage.getItem("token");
    return api.post("/add-to-history", { token, meeting_code: meetingCode }); // ✅ route fixed
  };

  /* -------------------------  logout  --------------------------- */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  /* ------------------------  provider value  -------------------- */
  const value = { user, register, login, logout, getHistory, addToHistory };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
