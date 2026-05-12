import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import Home from "./Home";
import Donor from "./Donor";
import Creator from "./Creator";
import CampaignDetails from "./CampaignDetails";
import Admin from "./Admin";
import Login from "./Login";
import Register from "./Register";
import Bookmarks from "./Bookmarks";
import Profile from "./Profile";


// ================= HOME =================



// ================= APP =================
function App() {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [language, setLanguage] = useState("en");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const textColor = darkMode ? "white" : "black";

  // FETCH USER
  useEffect(() => {

    const updateUser = () => {
      const stored = JSON.parse(localStorage.getItem("user"));

      if (stored) {
        setUser(stored);
      } else {
        setUser(null);
      }
    };

    updateUser();

    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };

  }, []);

  // THEME TOGGLE
  const toggleTheme = () => {

    const newTheme = !darkMode;

    setDarkMode(newTheme);

    localStorage.setItem(
      "darkMode",
      newTheme
    );
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (

    <Router>

      <div
        style={{
          padding: "10px",
          minHeight: "100vh",
          background: darkMode ? "#121212" : "#f4f6f9",
          transition: "0.3s",
          color: textColor
        }}
      >

        {/* NAVBAR */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: darkMode ? "#1f1f1f" : "white",
            padding: "15px 20px",
            borderRadius: "15px",
            marginBottom: "20px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}
        >

          {/* HOME */}
          <button
            onClick={() => window.location.href = "/"}
            style={{
              ...navButton,
              color: textColor
            }}
            onMouseEnter={(e) => e.target.style.color = "#2ecc71"}
            onMouseLeave={(e) => e.target.style.color = textColor}
          >
            Home
          </button>

          {/* DONOR */}
          {user?.role === "donor" && (
            <>
              <button
                onClick={() => window.location.href = "/donor"}
                style={{
                  ...navButton,
                  color: textColor
                }}
                onMouseEnter={(e) => e.target.style.color = "#2ecc71"}
                onMouseLeave={(e) => e.target.style.color = textColor}
              >
                Donor
              </button>

              <button
                onClick={() => window.location.href = "/bookmarks"}
                style={{
                  ...navButton,
                  color: textColor
                }}
                onMouseEnter={(e) => e.target.style.color = "#2ecc71"}
                onMouseLeave={(e) => e.target.style.color = textColor}
              >
                Bookmarks
              </button>
            </>
          )}

          {/* CREATOR */}
          {user?.role === "creator" && (
            <>
              <button
                onClick={() => window.location.href = "/creator"}
                style={{
                  ...navButton,
                  color: textColor
                }}
                onMouseEnter={(e) => e.target.style.color = "#2ecc71"}
                onMouseLeave={(e) => e.target.style.color = textColor}
              >
                Creator
              </button>

              <button
                onClick={() => window.location.href = "/bookmarks"}
                style={{
                  ...navButton,
                  color: textColor
                }}
                onMouseEnter={(e) => e.target.style.color = "#2ecc71"}
                onMouseLeave={(e) => e.target.style.color = textColor}
              >
                Bookmarks
              </button>
            </>
          )}

          {/* ADMIN */}
          {user?.role === "admin" && (
            <>
              <button
                onClick={() => window.location.href = "/admin"}
                style={{
                  ...navButton,
                  color: textColor
                }}
                onMouseEnter={(e) => e.target.style.color = "#2ecc71"}
                onMouseLeave={(e) => e.target.style.color = textColor}
              >
                Admin
              </button>

              <button
                onClick={() => window.location.href = "/bookmarks"}
                style={{
                  ...navButton,
                  color: textColor
                }}
                onMouseEnter={(e) => e.target.style.color = "#2ecc71"}
                onMouseLeave={(e) => e.target.style.color = textColor}
              >
                Bookmarks
              </button>
            </>
          )}

          {/* RIGHT SIDE */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: "15px",
              alignItems: "center"
            }}
          >

            {/* THEME BUTTON */}
            <button
              onClick={toggleTheme}
              style={{
                background: darkMode ? "#f1c40f" : "#2c3e50",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>

            {!user && (
              <Link
                to="/login"
                style={{
                  ...nav,
                  color: textColor
                }}
              >
                Login
              </Link>
            )}

            {!user && (
              <Link
                to="/register"
                style={{
                  ...nav,
                  color: textColor
                }}
              >
                Register
              </Link>
            )}

            {user && (
              <>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#2ecc71",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold"
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <Link
                  to="/profile"
                  style={{
                    ...nav,
                    color: textColor
                  }}
                >
                  {user.name}
                </Link>

                <button
                  onClick={handleLogout}
                  style={logoutBtn}
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </nav>

        {/* ROUTES */}
        <Routes>

          <Route
  path="/"
  element={<Home />}
/>

          <Route
            path="/donor"
            element={
              user?.role === "donor"
                ? <Donor language={language} darkMode={darkMode} />
                : <Login />
            }
          />

          <Route
            path="/creator"
            element={
              user?.role === "creator"
                ? <Creator darkMode={darkMode} />
                : <Login />
            }
          />

          <Route
            path="/admin"
            element={
              user?.role === "admin"
                ? <Admin darkMode={darkMode} />
                : <Login />
            }
          />

          <Route
            path="/bookmarks"
            element={
              user
                ? <Bookmarks darkMode={darkMode} />
                : <Login />
            }
          />

          <Route
            path="/campaign/:id"
            element={<CampaignDetails darkMode={darkMode} />}
          />

          <Route
            path="/login"
            element={<Login darkMode={darkMode} />}
          />

          <Route
            path="/register"
            element={<Register darkMode={darkMode} />}
          />

          <Route
            path="/profile"
            element={
              user
                ? <Profile darkMode={darkMode} />
                : <Login />
            }
          />

        </Routes>
                     

      </div>

    </Router>
  );
}


// ================= STYLES =================

const nav = {
  textDecoration: "none",
  fontWeight: "bold",
  padding: "5px 10px"
};

const logoutBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer"
};

const heroStyle = {
  height: "700px",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "30px",
  position: "relative",
  borderRadius: "20px",
  overflow: "hidden"
};

const overlayStyle = {
  background: "rgba(0,0,0,0.5)",
  padding: "30px",
  borderRadius: "12px",
  color: "white",
  textAlign: "center"
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const imgStyle = {
  width: "100%",
  height: "150px",
  objectFit: "cover"
};

const btnGreen = {
  marginTop: "8px",
  background: "#28a745",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const navButton = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  padding: "8px 12px",
  borderRadius: "6px",
  transition: "0.3s"
};

const btnGray = {
  marginTop: "5px",
  background: "#6c757d",
  color: "white",
  border: "none",
  padding: "5px 8px",
  borderRadius: "5px",
  cursor: "pointer"
};

export default App;