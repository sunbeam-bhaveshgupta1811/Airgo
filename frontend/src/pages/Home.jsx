import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HomeNavbar from '../components/HomeNavbar';
import '../css/Home.css';
import FlightSearch from './customer/FlightSearch';

function Home() {
  const location = useLocation();
  
  // Check if we're on the home page (root path)
  const isHomePage = location.pathname === '/';

  return (
    <div className="airline-home-background">
      <div className="content-overlay">
        <HomeNavbar />
        
        {/* Show FlightSearch only on the home page */}
        {isHomePage && (
          <div className="main-content">
            <div className="center-content">
              <FlightSearch />
            </div>
          </div>
        )}
        
        {/* Outlet for nested routes */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Home;