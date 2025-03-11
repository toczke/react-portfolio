import React from "react";

interface HeaderProps {
  downloadFile: (filename: string, displayName: string) => void;
}

const Header: React.FC<HeaderProps> = ({ downloadFile }) => {
  return (
    <header>
      <button onClick={() => downloadFile("CV.pdf", "Toczek Tomasz - Curriculum Vitae.pdf")}>
        Download CV
      </button>
    </header>
  );
};

export default Header;
