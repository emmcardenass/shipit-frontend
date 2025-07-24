import { useEffect, useState } from "react";

function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="w-10 h-5 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors"
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
          isDarkMode ? "translate-x-5" : ""
        }`}
      ></div>
    </button>
  );
}

export default DarkModeToggle;
