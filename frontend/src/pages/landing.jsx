import React from 'react';
import "../App.css";
import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const router = useNavigate();

  return (
    <div className='landingPageContainer'>
      {/* Navbar */}
      <nav>
        <div className='navHeader'>
          <h2>STREAMMATE</h2>
        </div>
        <div className='navlist'>
          <p onClick={() => router("/aljk23")}>Join as Guest</p>
          <p onClick={() => router("/auth")}>Register</p>
          <div onClick={() => router("/auth")} role='button'>
            <p>Login</p>
          </div>
        </div>
      </nav>

      {/* Main Hero Section */}
      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "#FF9839" }}>StreamMate</span> brings you closer
          </h1>
          <p>Talk, laugh, and share moments — anytime, anywhere</p>
          <div role='button'>
            <Link to={"/auth"}>Get Started</Link>
          </div>
        </div>

        <div>
          <img src="/mobile.png" alt="Video call mockup" />
        </div>
      </div>
    </div>
  );
}
