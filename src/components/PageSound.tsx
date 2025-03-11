import { useEffect, useState } from "react";

const PageSound = () => {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const enableSound = () => {
      setHasInteracted(true);
      document.removeEventListener("click", enableSound);
      document.removeEventListener("keydown", enableSound);
      document.removeEventListener("touchstart", enableSound);
    };

    document.addEventListener("click", enableSound);
    document.addEventListener("keydown", enableSound);
    document.addEventListener("touchstart", enableSound);

    return () => {
      document.removeEventListener("click", enableSound);
      document.removeEventListener("keydown", enableSound);
      document.removeEventListener("touchstart", enableSound);
    };
  }, []);

  useEffect(() => {
    if (hasInteracted) {
      const sound = new Audio("/startup.mp3");
      sound.volume = 0.5;
      sound.play().catch((err) => console.error("Audio play failed:", err));
    }
  }, [hasInteracted]);

  return null;
};

export default PageSound;
