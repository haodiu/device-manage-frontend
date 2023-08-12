import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./components/AuthenForm/Login";
import ErrorPage from "./pages/ErrorPage";
import DevicesManagement from "./pages/DevicesManagement";
import UserOrdersDetails from "./pages/UserOrdersDetails";
import InventoryManagement from "./pages/InventoryManagement"
import ShippingPartnerManagement from "./pages/ShippingPartnerManagement"
import LogbooksManagement from "./pages/LogbooksManagement"
import Profile from "./pages/Profile"
import UserDevices from "./pages/UserDevices"
import Signup from "./components/AuthenForm/SignUp";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="devices" element={<DevicesManagement />} />
            <Route path="logbooks" element={<LogbooksManagement />} />
            <Route path="profile" element={<Profile />} />
            <Route path="users/:id" element={<UserOrdersDetails />} />
            <Route path="user-devices" element={<UserDevices/>} />
            <Route path="shipping" element={<ShippingPartnerManagement/>} />
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
