import { useState, useEffect } from "react";
import "./App.css";
import { Trash2, Search } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function App() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [listLoading, setListLoading] = useState(true);

  const search = async () => {
    try {
      const response = await fetch(`${API_URL}/games/search?query=${query}`);
      const data = await response.json();
      setResults(data.results || []);
      setSearchError(false);
    } catch (error) {
      setResults([]);
      setSearchError(true);
    }
  };

  const save = async (rawgId) => {
    const response = await fetch(`${API_URL}/games/save/${rawgId}`, {
      method: "POST",
    });
    if (!response.ok) {
      setSavedMessage("Game already in your list!");
      setTimeout(() => setSavedMessage(""), 2000);
      return;
    }
    const gamesResponse = await fetch(`${API_URL}/games`);
    const data = await gamesResponse.json();
    setGames(data);
    setResults([]);
    setSavedMessage("Game saved!");
    setTimeout(() => setSavedMessage(""), 2000);
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API_URL}/games/${id}/status?status=${status}`, {
      method: "PATCH",
    });
    setGames(games.map((g) => (g.id === id ? { ...g, status } : g)));
    setSavedMessage(`Status updated to ${status}`);
    setTimeout(() => setSavedMessage(""), 2000);
  };

  const deleteGame = async (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    await fetch(`${API_URL}/games/${confirmDeleteId}`, { method: "DELETE" });
    setGames(games.filter((g) => g.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-wrapper")) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/games`)
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setListLoading(false);
      });
  }, []);

  useEffect(() => {
    if (query === "") {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      await search();
      setLoading(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, [query]);

  const filteredGames = games.filter(
    (g) => activeTab === "ALL" || g.status === activeTab,
  );

  const statusColor = {
    PLAYING: "#646cff",
    PLAYED: "#22c55e",
    BACKLOG: "#f59e0b",
    DROPPED: "#ef4444",
  };

  return (
    <div>
      <nav>
        <h1>BACKLOG</h1>
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") setResults([]);
            }}
            placeholder="Search your games..."
          />
          {searchError && (
            <div className="dropdown">
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  color: "#ff4444",
                }}
              >
                Failed to search. Try again.
              </div>
            </div>
          )}
          {loading && (
            <div className="dropdown">
              <div
                style={{ textAlign: "center", padding: "16px", color: "#aaa" }}
              >
                Searching...
              </div>
            </div>
          )}
          {!loading && !searchError && results.length > 0 && (
            <div className="dropdown">
              <div className="dropdown-header">SEARCH RESULTS</div>
              {results.map((game) => (
                <div key={game.id} className="dropdown-item">
                  <img src={game.background_image} alt={game.name} />
                  <div className="dropdown-item-info">
                    <span className="dropdown-item-name">{game.name}</span>
                  </div>
                  <button onClick={() => save(game.id)}>+</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {savedMessage && <div className="toast">{savedMessage}</div>}

      <div className="content">
        <div className="stats">
          <span>Total: {games.length} Games</span>
          {["PLAYING", "PLAYED", "BACKLOG", "DROPPED"].map((s) => {
            const count = games.filter((g) => g.status === s).length;
            return count > 0 ? (
              <span key={s} style={{ color: statusColor[s] }}>
                • {count} {s.charAt(0) + s.slice(1).toLowerCase()}
              </span>
            ) : null;
          })}
        </div>

        <div className="tabs">
          {["ALL", "PLAYING", "PLAYED", "BACKLOG", "DROPPED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? "active" : ""}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {listLoading ? (
          <div className="empty-state">Loading...</div>
        ) : filteredGames.length === 0 ? (
          <div className="empty-state">Nothing here yet</div>
        ) : (
          <div className="cards-grid">
            {filteredGames.map((game) => (
              <div key={game.id} className="card">
                <div className="card-image">
                  <img src={game.coverImage} alt={game.title} />
                  <div className="card-overlay">
                    <button
                      className="card-delete"
                      onClick={() => deleteGame(game.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <span
                    className="card-status-badge"
                    style={{ backgroundColor: statusColor[game.status] }}
                  >
                    {game.status}
                  </span>
                </div>
                <div className="card-info">
                  <span className="card-title">{game.title}</span>
                  <select
                    value={game.status}
                    onChange={(e) => updateStatus(game.id, e.target.value)}
                    className="card-select"
                  >
                    <option value="PLAYING">Playing</option>
                    <option value="PLAYED">Played</option>
                    <option value="BACKLOG">Backlog</option>
                    <option value="DROPPED">Dropped</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this game?</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="modal-confirm">
                Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="modal-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
