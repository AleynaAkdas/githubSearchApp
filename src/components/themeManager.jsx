import { createContext, useContext, useEffect, useState } from "react";

const themes = ["aktif", "anadolu", "minimalist", "nostalji", "uretken"];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "aktif");

  useEffect(() => {
    const linkId = "theme-link";
    let link = document.getElementById(linkId);

    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.id = linkId;
      document.head.appendChild(link);
    }


    link.href = `/src/components/themes/${theme}.css`;
    localStorage.setItem("theme", theme);

  }, [theme]); 

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
