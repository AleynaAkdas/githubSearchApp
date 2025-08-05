import { useEffect, useState, useRef } from "react";
import "./App.css";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [theme, setTheme] = useState("Başlangıç");
  const [showThemes, setShowThemes] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.body.className = theme;
    localStorage.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (username) {
      setLoading(true);
      setUserData(null);
      setTimeout(() => {
        fetch(`https://api.github.com/users/${username}`)
          .then((res) => res.json())
          .then((data) => {
            setUserData(data);
            setLoading(false);
          });
      }, 800);
    }
  }, [username]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowThemes(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    setUsername(inputValue);
    setInputValue("");
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>Github Kullanıcı Arama</h1>
      </header>

      <div className="input-row">
        <input
          type="text"
          placeholder="Github kullanıcı adı"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Ara</button>
      </div>

      <div className="theme-info" ref={dropdownRef}>
        <span>
          Aktif tema: <strong>{theme}</strong>
        </span>
        <button
          className="theme-dropdown-btn"
          onClick={() => setShowThemes(!showThemes)}
        >
          Temayı Değiştir
        </button>

        {showThemes && (
          <div className="theme-dropdown">
            {[
              "Başlangıç",
              "Aktif",
              "Anadolu",
              "Minimalist",
              "Nostalji",
              "Üretken",
            ].map((t) => (
              <div
                key={t}
                className="theme-option"
                onClick={() => {
                  setTheme(t);
                  setShowThemes(false);
                }}
              >
                {t}
              </div>
            ))}
          </div>
        )}
      </div>
      {loading && (
        <div className="loading-spinner">
          <div className="spinner">
            <span>Yükleniyor...</span>
          </div>
        </div>
      )}
      {userData && userData.login && !loading && (
        <div
          className={`user-info ${!showThemes ? "clickable" : "disabled"}`}
          onClick={() => {
            if (!showThemes) {
              window.open(userData.html_url, "_blank");
            }
          }}
        >
          <img src={userData.avatar_url} alt="profile avatar" />
          <div className="user-details">
            <h2 className="name">{userData.name || userData.login}</h2>
            <h3 className="username">@{userData.login}</h3>
            {userData.location && (
              <p className="location">{userData.location}</p>
            )}
            <div className="stats-row">
              <div className="stat-box">
                <span>{userData.public_repos}</span> Repo
              </div>
              <div className="stat-box">
                <span>{userData.followers}</span> Takipçi
              </div>
              <div className="stat-box">
                <span>{userData.following}</span> Takip
              </div>
            </div>
            <span className="created">
              Oluşturuldu:{" "}
              {new Date(userData.created_at).toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      )}

      {userData && !userData.login && !loading && (
        <div className="not-found">Kullanıcı bulunamadı</div>
      )}
    </div>
  );
}
