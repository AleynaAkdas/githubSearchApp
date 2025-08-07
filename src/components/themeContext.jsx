import { createContext, useContext, useEffect, useState } from "react";

const themes = ["Klasik", "Aktif", "Anadolu", "Minimalist", "Nostalji", "Üretken"];

const ThemeContext = createContext();

export const ThemeProvider = ({ children, userData }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "Klasik");

  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g");

  const decideTheme = (userData) => {
    if (!userData || !userData.login) return "Klasik";

    const location = userData.location?.toLowerCase() || "";
    const repoCount = userData.public_repos || 0;
    const followers = userData.followers || 0;

    if (followers > 100 || repoCount > 50) return "Üretken";
    if (location.includes("istanbul") || location.includes("türkiye")) return "Anadolu";
    if (followers < 10 && repoCount < 5) return "Nostalji";
    if (repoCount >= 5 && repoCount <= 20) return "Minimalist";

    return "Aktif";
  };

  useEffect(() => {
    const linkId = "theme-link";
    let link = document.getElementById(linkId);

    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.id = linkId;
      document.head.appendChild(link);
    }

    if (theme === "Klasik") {
      link.href = "";
      localStorage.setItem("theme", "Klasik");
      return;
    }

    const fileName = normalize(theme);
    link.href = `/themes/${fileName}.css`;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (userData && userData.login) {
      const autoTheme = decideTheme(userData);
      setTheme(autoTheme);
    }
  }, [userData]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
