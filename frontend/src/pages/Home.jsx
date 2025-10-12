import React from "react";
import { Outlet } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import "../CSS/Home.css";
import FlightSearch from "./customer/FlightSearch";

function Home() {
  return (
    <div className="airline-home-background">
      <div className="content-overlay">
        <HomeNavbar />
        <div className="main-content">
          <div className="center-content">
            <FlightSearch />
          </div>
        </div>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Home;
