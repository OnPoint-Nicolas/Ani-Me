

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("ani-me-theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
    localStorage.setItem("ani-me-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-1.5 rounded-md bg-secondary hover:bg-accent transition-all duration-300"
      title={dark ? "Light Mode" : "Dark Mode"}
    >
      {dark ? (
        <Sun className="w-4 h-4 text-yellow-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-primary transition-transform duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
