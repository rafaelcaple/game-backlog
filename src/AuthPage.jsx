import { useState } from "react";
import "./AuthPage.css";
import { User, Lock, LogIn } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function AuthPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        setError("Invalid credentials. Please try again.");
        return;
      }
      const token = await response.text();
      onLogin(token);
    } catch {
      setError("Connection error. Check your server.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* LEFT PANEL */}
        <div className="auth-left">
          <div className="auth-logo">
            <span className="auth-logo-name">BACKLOG</span>
          </div>

          <div className="auth-headline">
            <h2>Track your gaming library</h2>
            <p>
              Organize every title you've played, dropped, or still need to
              finish.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? "active" : ""}`}
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
            >
              Log in
            </button>
            <button
              className={`auth-tab ${!isLogin ? "active" : ""}`}
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
            >
              Sign up
            </button>
          </div>

          <div className="auth-field">
            <label>Username</label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-input-icon" />
              <input
                className="auth-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="auth-field">
            <label>
              Password
              <a href="#">Forgot password?</a>
            </label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                className="auth-input"
                type="password"
                placeholder="•••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            className="auth-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              "Loading..."
            ) : (
              <>{isLogin ? "Log in" : "Create an account"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
