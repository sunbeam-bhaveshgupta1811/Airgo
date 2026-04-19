import React from "react";
import '../css/Footer.css'

function Footer() {
  // Component names should be capitalized in React
  return (
    <main>
      <footer className="footer">
        <div className="container">
          <div className="copyright">
            <span>Copyright © Airgo @2025</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Footer; // Consistent capitalization with component name
