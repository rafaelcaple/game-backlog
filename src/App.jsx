import { useState, useEffect } from 'react'
import './App.css'

import { Trash2 } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function App() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [games, setGames] = useState([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [listLoading, setListLoading] = useState(true)

  const search = async () => {
    try {
      const response = await fetch(`${API_URL}/games/search?query=${query}`)
      const data = await response.json()
      setResults(data.results || [])
      setSearchError(false)
    } catch (error) {
      setResults([])
      setSearchError(true)
    }
  }

  const save = async (rawgId) => {
    const response = await fetch(`${API_URL}/games/save/${rawgId}`, { method: 'POST' })
    if (!response.ok) {
      setSavedMessage('Game already in your list!')
      setTimeout(() => setSavedMessage(''), 2000)
      return
    }
    const gamesResponse = await fetch(`${API_URL}/games`)
    const data = await gamesResponse.json()
    setGames(data)
    setResults([])
    setSavedMessage('Game saved!')
    setTimeout(() => setSavedMessage(''), 2000)
  }
  const updateStatus = async (id, status) => {
  await fetch(`${API_URL}/games/${id}/status?status=${status}`, { method: 'PATCH' })
  setGames(games.map(g => g.id === id ? { ...g, status } : g))
  setSavedMessage(`Status updated to ${status}`)
  setTimeout(() => setSavedMessage(''), 2000)
}

  const deleteGame = async (id) => {
    setConfirmDeleteId(id)
  }

  const confirmDelete = async () => {
    await fetch(`${API_URL}/games/${confirmDeleteId}`, { method: 'DELETE' })
    setGames(games.filter(g => g.id !== confirmDeleteId))
    setConfirmDeleteId(null)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-wrapper')) {
        setResults([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])



  useEffect(() => {
    fetch(`${API_URL}/games`)
      .then(res => res.json())
      .then(data => {
        setGames(data)
        setListLoading(false)
      })
  }, [])

  useEffect(() => {
    if (query === '') {
      setResults([])
      return
    }
    const timeout = setTimeout(async () => {
      setLoading(true)
      await search()
      setLoading(false)
    }, 800)
    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div>
      <nav>
        <h1>Backlog</h1>
        <div className="search-wrapper" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                if (e.target.value === '') setResults([])
              }}
              placeholder="Search for your games here"
            />
          </div>
          {searchError && (
            <div className="dropdown">
              <div style={{ textAlign: 'center', padding: '16px', color: '#ff4444' }}>
                Failed to search. Try again.
              </div>
            </div>
          )}
          {loading && (
            <div className="dropdown">
              <div style={{ textAlign: 'center', padding: '16px', color: '#aaa' }}>Searching...</div>
            </div>
          )}

          {!loading && !searchError && results.length > 0 && (
            <div className="dropdown">
              {results.map(game => (
                <div key={game.id} className="dropdown-item">
                  <img src={game.background_image} alt={game.name} />
                  <span>{game.name}</span>
                  <button onClick={() => save(game.id)}>Save</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
      {savedMessage && (
        <div className="toast">
          {savedMessage}
        </div>
      )}

      <div className="content">
        <div className="tabs">
          <button onClick={() => setActiveTab('ALL')} className={activeTab === 'ALL' ? 'active' : ''}>All</button>
          <button onClick={() => setActiveTab('PLAYING')} className={activeTab === 'PLAYING' ? 'active' : ''}>Playing</button>
          <button onClick={() => setActiveTab('PLAYED')} className={activeTab === 'PLAYED' ? 'active' : ''}>Played</button>
          <button onClick={() => setActiveTab('BACKLOG')} className={activeTab === 'BACKLOG' ? 'active' : ''}>Backlog</button>
          <button onClick={() => setActiveTab('DROPPED')} className={activeTab === 'DROPPED' ? 'active' : ''}>Dropped</button>
        </div>

        <table className="game-table" key="game-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cover</th>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listLoading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#aaa', padding: '32px' }}>
                  Loading...
                </td>
              </tr>
            ) : games.filter(g => activeTab === 'ALL' || g.status === activeTab).length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#555', padding: '32px' }}>
                  Nothing here yet
                </td>
              </tr>
            )}
            {games
              .filter(g => activeTab === 'ALL' || g.status === activeTab)
              .map((game, index) => (
                <tr key={game.id}>
                  <td>{index + 1}</td>
                  <td><img src={game.coverImage} alt={game.title} /></td>
                  <td>{game.title}</td>
                  <td>
                    <select onChange={e => updateStatus(game.id, e.target.value)} value={game.status}>
                      <option value="PLAYING">Playing</option>
                      <option value="PLAYED">Played</option>
                      <option value="BACKLOG">Backlog</option>
                      <option value="DROPPED">Dropped</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => deleteGame(game.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this game?</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="modal-confirm">Delete</button>
              <button onClick={() => setConfirmDeleteId(null)} className="modal-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
export default App