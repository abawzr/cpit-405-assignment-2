import React, { useState } from "react";
import "./App.css";

function App() {
  const [surah, setSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRandomSurahWithAyahs = async () => {
    setLoading(true);
    try {
      const corsProxy = "https://api.allorigins.win/raw?url=";
      const surahListEndpoint =
        corsProxy + encodeURIComponent("https://api.alquran.cloud/v1/surah");
      const surahListResponse = await fetch(surahListEndpoint);
      const surahListData = await surahListResponse.json();

      const surahs = surahListData.data;
      const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];

      const surahDetailsEndpoint =
        corsProxy +
        encodeURIComponent(
          `https://api.alquran.cloud/v1/surah/${randomSurah.number}`
        );
      const surahDetailsResponse = await fetch(surahDetailsEndpoint);
      const surahDetailsData = await surahDetailsResponse.json();

      setSurah(randomSurah);
      setAyahs(surahDetailsData.data.ayahs);
    } catch (error) {
      console.error("Error fetching surah or ayahs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>📖 Random Surah with Ayahs</h1>
      <button onClick={fetchRandomSurahWithAyahs} disabled={loading}>
        {loading ? "Loading..." : "Fetch Random Surah"}
      </button>
      <p style={{ marginTop: "1rem", fontStyle: "italic", color: "#555" }}>
        ⚠️ Note: Sometimes the fetch might not work on the first try because
        i'm using a free proxy to bypass browser security (CORS). If nothing
        loads, just click the button again — it should work!
      </p>

      {surah && (
        <div className="surah-container">
          <div className="surah-header">
            <h2>
              {surah.englishName} ({surah.name})
            </h2>
          </div>
          <div className="surah-details">
            <p>
              <strong>Number of Ayahs:</strong> {surah.numberOfAyahs}
            </p>
          </div>

          <div className="ayahs">
            {ayahs.map((ayah) => (
              <div key={ayah.number} className="ayah">
                <p className="ayah-text">{ayah.text}</p>
                <p className="ayah-number">Ayah {ayah.numberInSurah}</p>
                <hr />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
