import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./components/AuthenForm/Login";
import ErrorPage from "./pages/ErrorPage";
import DevicesManagement from "./pages/DevicesManagement";
import LogbooksManagement from "./pages/LogbooksManagement"
import Profile from "./pages/Profile"
import UserDevices from "./pages/UserDevices"
import Signup from "./components/AuthenForm/SignUp";
import LiquidationsManagement from "./pages/LiquidationManage"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="devices" element={<DevicesManagement />} />
            <Route path="logbooks" element={<LogbooksManagement />} />
            <Route path="liquidations" element={<LiquidationsManagement />} />
            <Route path="profile" element={<Profile />} />
            <Route path="user-devices" element={<UserDevices/>} />
            <Route path="login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
