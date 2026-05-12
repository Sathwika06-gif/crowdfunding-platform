import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);

  // ================= FETCH =================
  useEffect(() => {
    fetch("http://127.0.0.1:5000/recommendations")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  // ================= ANIMATIONS =================
  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      @keyframes floatAnimation {
        0% {
          transform: translate(-50%, -50%) translateY(0px);
        }

        50% {
          transform: translate(-50%, -50%) translateY(-15px);
        }

        100% {
          transform: translate(-50%, -50%) translateY(0px);
        }
      }

      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }

        to {
          opacity: 1;
          transform: translateY(0px);
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={page}>

      {/* HERO SECTION */}
      <div style={hero}>

        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt=""
          style={heroImg}
        />

        <div style={heroOverlay}>

          <h1 style={heroTitle}>
            🚀 Crowdfunding Platform
          </h1>

          <p style={heroText}>
            Support causes. Change lives. Make impact ❤️
          </p>

          <button
            style={heroBtn}

            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.08)";
              e.target.style.boxShadow =
                "0 18px 35px rgba(46,204,113,0.6)";
            }}

            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow =
                "0 10px 25px rgba(46,204,113,0.4)";
            }}

            onClick={() =>
              window.scrollTo({
                top: 700,
                behavior: "smooth"
              })
            }
          >
            Explore Campaigns
          </button>

        </div>

      </div>

      {/* STATS */}
      {/* FEATURES SECTION */}
{/* FEATURES SECTION */}
<div style={featureSection}>

  <div style={featureCard}>

    <h3 style={featureTitle}>
      Trusted Donations
    </h3>

    <p style={featureText}>
      Safe and secure fundraising with fraud detection
    </p>

  </div>

  <div style={featureCard}>

    <h3 style={featureTitle}>
      Fast Campaign Growth
    </h3>

    <p style={featureText}>
      Reach thousands of supporters instantly
    </p>

  </div>

  <div style={featureCard}>

    <h3 style={featureTitle}>
      Multi Language Support
    </h3>

    <p style={featureText}>
      Campaigns available in English, Telugu and Hindi
    </p>

  </div>

</div>

      {/* CAMPAIGNS */}
      <div style={section}>

        <h2 style={sectionTitle}>
          📢 Recommended Campaigns
        </h2>

        <div style={grid}>

          {campaigns.map((c, index) => (

            <div
              key={c._id}

              style={{
                ...card,
                animation: `fadeUp 0.8s ease ${index * 0.1}s both`
              }}

              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-12px) scale(1.02)";

                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0,0,0,0.3)";
              }}

              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0px)";

                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0,0,0,0.2)";
              }}
            >

              <div style={{ position: "relative" }}>

                <img
                  src={
                    c.images?.[0] ||
                    "https://via.placeholder.com/300"
                  }
                  alt=""
                  style={image}
                />

                {c.fraud && (
                  <div style={fraudBadge}>
                    🚨 Fraud Alert
                  </div>
                )}

              </div>

              <div style={cardBody}>

                <h3 style={cardTitle}>
                  {c.title}
                </h3>

                <p style={desc}>
                  {c.description?.substring(0, 90)}...
                </p>

                <div style={progressBg}>
                  <div
                    style={{
                      ...progressFill,
                      width: `${Math.min(
                        (c.raised / c.amount) * 100,
                        100
                      )}%`
                    }}
                  />
                </div>

                <p style={raisedText}>
                  ₹{c.raised} raised of ₹{c.amount}
                </p>

                <button
                  style={viewBtn}

                  onMouseEnter={(e) => {
                    e.target.style.transform =
                      "scale(1.04)";

                    e.target.style.boxShadow =
                      "0 12px 28px rgba(46,204,113,0.5)";
                  }}

                  onMouseLeave={(e) => {
                    e.target.style.transform =
                      "scale(1)";

                    e.target.style.boxShadow =
                      "0 6px 20px rgba(46,204,113,0.3)";
                  }}

                  onClick={() =>
                    navigate(`/campaign/${c._id}`)
                  }
                >
                  👁 View Campaign
                </button>
<button
  style={listenBtn}
  onClick={(e) => {

    e.stopPropagation();

    const speech =
      new SpeechSynthesisUtterance(
        c.description
      );

    speech.lang = "en-IN";

    window.speechSynthesis.speak(speech);
  }}
>
  🔊 Listen
</button>
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Home;

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",

  background:
    "linear-gradient(135deg,#11998e 0%, #38ef7d 100%)",

  paddingBottom: "80px",

  fontFamily: "Arial, sans-serif"
};

const hero = {
  position: "relative",
  height: "100vh",
  overflow: "hidden"
};

const heroImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",

  filter: "brightness(45%)",

  transform: "scale(1.08)"
};

const heroOverlay = {
  position: "absolute",

  top: "50%",
  left: "50%",

  transform: "translate(-50%, -50%)",

  width: "90%",
  maxWidth: "850px",

  padding: "50px",

  borderRadius: "30px",

  background: "rgba(255,255,255,0.15)",

  backdropFilter: "blur(14px)",

  border: "1px solid rgba(255,255,255,0.2)",

  boxShadow:
    "0 8px 32px rgba(0,0,0,0.2)",

  textAlign: "center",

  color: "white",

  animation:
    "floatAnimation 4s ease-in-out infinite"
};

const heroTitle = {
  fontSize: "65px",

  fontWeight: "bold",

  marginBottom: "20px",

  textShadow:
    "0 4px 20px rgba(0,0,0,0.4)"
};

const heroText = {
  fontSize: "22px",

  marginBottom: "35px",

  lineHeight: "1.7"
};

const heroBtn = {
  padding: "16px 34px",

  border: "none",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg,#2ecc71,#27ae60)",

  color: "white",

  fontSize: "18px",

  fontWeight: "bold",

  cursor: "pointer",

  transition: "0.4s",

  boxShadow:
    "0 10px 25px rgba(46,204,113,0.4)"
};
const featureSection = {
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(280px,1fr))",

  gap: "25px",

  width: "90%",

  maxWidth: "1200px",

  margin: "-70px auto 60px auto",

  position: "relative",

  zIndex: "10"
};

const featureCard = {
  background: "rgba(255,255,255,0.15)",

  backdropFilter: "blur(14px)",

  border: "1px solid rgba(255,255,255,0.2)",

  borderRadius: "24px",

  padding: "35px",

  textAlign: "center",

  color: "white",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.2)",

  transition: "0.4s"
};

const featureIcon = {
  fontSize: "50px",

  marginBottom: "18px"
};

const featureTitle = {
  fontSize: "24px",

  marginBottom: "12px",

  fontWeight: "bold"
};

const featureText = {
  color: "#f1f1f1",

  lineHeight: "1.7"
};

const statsContainer = {
  display: "flex",

  justifyContent: "center",

  gap: "25px",

  flexWrap: "wrap",

  marginTop: "-60px",

  position: "relative",

  zIndex: "10"
};

const statCard = {
  background: "rgba(255,255,255,0.18)",

  backdropFilter: "blur(12px)",

  border: "1px solid rgba(255,255,255,0.2)",

  borderRadius: "24px",

  padding: "28px",

  width: "220px",

  textAlign: "center",

  color: "white",

  boxShadow:
    "0 8px 25px rgba(0,0,0,0.2)"
};

const section = {
  padding: "70px 35px"
};

const sectionTitle = {
  textAlign: "center",

  color: "white",

  fontSize: "40px",

  marginBottom: "40px",

  fontWeight: "bold"
};

const grid = {
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fill,minmax(320px,1fr))",

  gap: "30px"
};

const card = {
  background: "rgba(255,255,255,0.15)",

  backdropFilter: "blur(14px)",

  border: "1px solid rgba(255,255,255,0.2)",

  borderRadius: "25px",

  overflow: "hidden",

  cursor: "pointer",

  transition: "0.4s",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.2)"
};

const image = {
  width: "100%",

  height: "240px",

  objectFit: "cover"
};

const cardBody = {
  padding: "22px",

  color: "white"
};

const cardTitle = {
  fontSize: "24px",

  marginBottom: "12px"
};

const desc = {
  lineHeight: "1.7",

  color: "#f1f1f1",

  minHeight: "70px"
};

const progressBg = {
  width: "100%",

  height: "10px",

  background: "rgba(255,255,255,0.2)",

  borderRadius: "10px",

  overflow: "hidden",

  marginTop: "18px"
};

const progressFill = {
  height: "100%",

  background:
    "linear-gradient(135deg,#2ecc71,#27ae60)"
};

const raisedText = {
  marginTop: "12px",

  color: "white",

  fontWeight: "bold"
};

const viewBtn = {
  width: "100%",

  marginTop: "20px",

  padding: "14px",

  border: "none",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg,#2ecc71,#27ae60)",

  color: "white",

  fontWeight: "bold",

  fontSize: "15px",

  cursor: "pointer",

  transition: "0.4s",

  boxShadow:
    "0 6px 20px rgba(46,204,113,0.35)"
};
const listenBtn = {
  width: "100%",

  marginTop: "12px",

  padding: "12px",

  border: "none",

  borderRadius: "14px",

  background:
    "rgba(255,255,255,0.15)",

  backdropFilter: "blur(10px)",

  color: "white",

  fontWeight: "bold",

  cursor: "pointer",

  border:
    "1px solid rgba(255,255,255,0.2)",

  transition: "0.4s"
};
const fraudBadge = {
  position: "absolute",

  top: "15px",

  right: "15px",

  background: "#e74c3c",

  color: "white",

  padding: "6px 12px",

  borderRadius: "8px",

  fontSize: "12px",

  fontWeight: "bold"
};