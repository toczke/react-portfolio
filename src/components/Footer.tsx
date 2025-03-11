import React from "react";
import "../App.css";

const Footer: React.FC = () => {
    return (
      <footer className="terminal-footer">
        <p className="footer-text">© {new Date().getFullYear()} Tomasz Toczek. All rights reserved.</p>
        <div className="footer-links">
          <a href="https://github.com/toczke" target="_blank" rel="noopener noreferrer" className="footer-button">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/toczek-tomasz/" target="_blank" rel="noopener noreferrer" className="footer-button">
            LinkedIn
          </a>
        </div>
      </footer>
    );
  };
  
  export default Footer;