import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Donor({ language }) {

  const [campaigns, setCampaigns] = useState([]);

  const navigate = useNavigate();

  const user = "user1";

  // =========================
  // FETCH CAMPAIGNS
  // =========================
  useEffect(() => {

    fetch(
      "http://127.0.0.1:5000/campaigns?t=" + Date.now()
    )
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch((err) => console.error(err));

  }, []);

  // =========================
  // TOGGLE BOOKMARK
  // =========================
  const toggleBookmark = async (campaign) => {

    const isSaved =
      campaign.bookmarkedBy?.includes(user);

    if (isSaved) {

      alert("Already bookmarked ❤️");

      const confirmRemove =
        window.confirm(
          "Do you want to remove it?"
        );

      if (!confirmRemove) return;

      await fetch(
        "http://127.0.0.1:5000/unbookmark",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            id: campaign._id,
            user
          })
        }
      );

      setCampaigns((prev) =>
        prev.map((c) =>
          c._id === campaign._id
            ? {
                ...c,
                bookmarkedBy:
                  c.bookmarkedBy.filter(
                    (u) => u !== user
                  )
              }
            : c
        )
      );

    } else {

      await fetch(
        "http://127.0.0.1:5000/bookmark",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            id: campaign._id,
            user
          })
        }
      );

      alert("Bookmarked ❤️");

      setCampaigns((prev) =>
        prev.map((c) =>
          c._id === campaign._id
            ? {
                ...c,
                bookmarkedBy: [
                  ...(c.bookmarkedBy || []),
                  user
                ]
              }
            : c
        )
      );
    }
  };

  return (

    <div style={page}>

      {/* HEADER */}
      <div style={headerBox}>

        <h1 style={heading}>
          ❤️ Browse Campaigns
        </h1>

        <p style={subHeading}>
          Support genuine causes and make a difference
        </p>

      </div>

      {/* GRID */}
      <div style={grid}>

        {campaigns.map((c, index) => (

          <div
            key={c._id}

            style={{
              ...card,

              border: c.fraud
                ? "2px solid #ff4d4d"
                : "1px solid rgba(255,255,255,0.25)",

              animation:
                `fadeUp 0.6s ease ${index * 0.1}s both`
            }}

            onMouseEnter={(e) => {

              e.currentTarget.style.transform =
                "translateY(-8px) scale(1.02)";

              e.currentTarget.style.boxShadow =
                "0 18px 35px rgba(0,0,0,0.25)";
            }}

            onMouseLeave={(e) => {

              e.currentTarget.style.transform =
                "translateY(0px)";

              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.15)";
            }}
          >

            {/* IMAGE */}
            <img
              loading="lazy"
              src={c.images?.[0]}
              alt="campaign"
              style={image}
            />

            {/* CONTENT */}
            <div style={content}>

              <h2 style={title}>
                {c.title_translations?.[language] ||
                  c.title_translations?.["en"] ||
                  c.title}
              </h2>

              {/* CATEGORY */}
              <div style={categoryBadge}>
                📂 {c.category || "General"}
              </div>

              {/* FRAUD */}
              {c.fraud && (

                <div style={fraudBadge}>
                  ⚠ Fraud Detected
                </div>

              )}

              {/* DESCRIPTION */}
              <p style={description}>
                {(
                  c.description_translations?.[
                    language
                  ] ||
                  c.description_translations?.["en"] ||
                  c.description ||
                  ""
                ).slice(0, 120)}...
              </p>

              {/* AMOUNT */}
              <p style={amount}>
                🎯 Goal: ₹{c.amount}
              </p>

              {/* RAISED */}
              <p style={raised}>
                💰 Raised: ₹{c.raised || 0}
              </p>

              {/* PROGRESS BAR */}
              <div style={progressContainer}>

                <div
                  style={{
                    ...progressBar,

                    width: `${
                      Math.min(
                        (
                          (c.raised || 0) /
                          (c.amount || 1)
                        ) * 100,
                        100
                      )
                    }%`
                  }}
                />

              </div>

              {/* BUTTONS */}
              <div style={buttonRow}>

                {/* BOOKMARK */}
                <button
                  onClick={(e) => {

                    e.stopPropagation();

                    toggleBookmark(c);
                  }}

                  style={{
                    ...bookmarkBtn,

                    background:
                      c.bookmarkedBy?.includes(user)
                        ? "gold"
                        : "linear-gradient(135deg,#6c5ce7,#4834d4)"
                  }}
                >

                  {c.bookmarkedBy?.includes(user)
                    ? "★ Saved"
                    : "☆ Bookmark"}

                </button>

                {/* VIEW */}
                <button
                  onClick={() =>
                    navigate(`/campaign/${c._id}`)
                  }

                  style={viewBtn}
                >
                  View
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Donor;

/* =========================
   MODERN GLASSMORPHISM UI
========================= */

const page = {

  minHeight: "100vh",

  padding: "40px 25px",

  background:
    "linear-gradient(135deg,#11998e 0%, #38ef7d 100%)",

  fontFamily: "Arial, sans-serif"
};

const headerBox = {

  textAlign: "center",

  marginBottom: "40px",

  background: "rgba(255,255,255,0.12)",

  backdropFilter: "blur(16px)",

  borderRadius: "28px",

  padding: "35px",

  color: "white",

  boxShadow:
    "0 8px 32px rgba(0,0,0,0.2)"
};

const heading = {

  fontSize: "46px",

  marginBottom: "10px",

  fontWeight: "bold"
};

const subHeading = {

  fontSize: "18px",

  opacity: "0.9"
};

const grid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fill,minmax(360px,1fr))",

  gap: "30px"
};

const card = {

  background: "rgba(255,255,255,0.18)",

  backdropFilter: "blur(14px)",

  borderRadius: "26px",

  overflow: "hidden",

  transition: "0.4s",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.15)"
};

const image = {

  width: "100%",

  height: "240px",

  objectFit: "cover"
};

const content = {

  padding: "22px",

  color: "white"
};

const title = {

  fontSize: "28px",

  marginBottom: "12px",

  color: "white"
};

const categoryBadge = {

  display: "inline-block",

  background:
    "rgba(255,255,255,0.22)",

  padding: "6px 12px",

  borderRadius: "10px",

  marginBottom: "12px",

  fontSize: "13px",

  color: "white",

  fontWeight: "bold"
};

const fraudBadge = {

  display: "inline-block",

  background: "#ff4d4d",

  color: "white",

  padding: "6px 12px",

  borderRadius: "8px",

  fontSize: "12px",

  fontWeight: "bold",

  marginBottom: "12px"
};

const description = {

  color: "#f1f1f1",

  lineHeight: "1.7",

  marginBottom: "15px"
};

const amount = {

  fontSize: "18px",

  fontWeight: "bold",

  marginBottom: "8px",

  color: "white"
};

const raised = {

  fontSize: "16px",

  marginBottom: "12px",

  color: "#f1f1f1"
};

const progressContainer = {

  width: "100%",

  height: "10px",

  background:
    "rgba(255,255,255,0.2)",

  borderRadius: "10px",

  overflow: "hidden",

  marginBottom: "18px"
};

const progressBar = {

  height: "100%",

  background:
    "linear-gradient(90deg,#00f260,#0575e6)",

  borderRadius: "10px"
};

const buttonRow = {

  display: "flex",

  gap: "12px"
};

const bookmarkBtn = {

  flex: 1,

  padding: "12px",

  border: "none",

  borderRadius: "14px",

  color: "white",

  fontWeight: "bold",

  cursor: "pointer",

  transition: "0.3s"
};

const viewBtn = {

  flex: 1,

  padding: "12px",

  border: "none",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg,#00b894,#00cec9)",

  color: "white",

  fontWeight: "bold",

  cursor: "pointer",

  transition: "0.3s"
};