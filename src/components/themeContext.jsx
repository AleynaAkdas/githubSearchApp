import { createContext, useContext, useEffect, useState } from "react";

const themes = [
  "Klasik",
  "Aktif",
  "Anadolu",
  "Minimalist",
  "Nostalji",
  "Üretken",
];

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

  const decideTheme = (user) => {
    if (!user || !user.login) return "Klasik";

    const location = user.location?.toLowerCase() || "";
    const repoCount = user.public_repos || 0;
    const followers = user.followers || 0;
    const lastActive = new Date(user.updated_at);
    const now = new Date();
    const monthsSinceLastActivity =
      (now - lastActive) / (1000 * 60 * 60 * 24 * 30);

    // Az üretim varsa önce zaman kontrol edilir
    if (repoCount < 5) {
      if (monthsSinceLastActivity > 6) return "Nostalji";
      return "Minimalist";
    }

    // Çok üretken
    if (followers > 100 || repoCount > 50) return "Üretken";

    // Orta üretim ve güncel
    if (repoCount >= 5 && repoCount <= 20 && monthsSinceLastActivity <= 6) {
      return "Aktif";
    }

    // Lokasyon bazlı
    if (location.includes("istanbul") || location.includes("türkiye"))
      return "Anadolu";

    return "Klasik"; // fallback
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
