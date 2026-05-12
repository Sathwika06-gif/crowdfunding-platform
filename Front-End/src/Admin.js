import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

function Admin() {

  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);

  // ================= LOAD DATA =================
  useEffect(() => {

    const loadData = async () => {

      try {

        const campRes = await fetch(
          "http://127.0.0.1:5000/campaigns"
        );

        const campData = await campRes.json();

        setCampaigns(campData);

        const statRes = await fetch(
          "http://127.0.0.1:5000/admin-stats"
        );

        const statData = await statRes.json();

        setStats(statData);

      } catch (error) {

        console.error("Error loading data:", error);

      }
    };

    loadData();

    const interval = setInterval(
      loadData,
      3000
    );

    return () => clearInterval(interval);

  }, []);

  // ================= DELETE =================
  const deleteCampaign = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this campaign?"
    );

    if (!confirmDelete) return;

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/delete-campaign/${id}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            admin_key: "admin123"
          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Campaign deleted successfully");

        // remove instantly from UI
        setCampaigns((prev) =>
          prev.filter((c) => c._id !== id)
        );

      } else {

        alert(data.error || "Delete failed");

      }

    } catch (error) {

      console.error("Delete error:", error);

      alert("Server error while deleting");

    }
  };

  const fraudCount = campaigns.filter(
    (c) => c.fraud
  ).length;

  const cleanCount = campaigns.filter(
    (c) => !c.fraud
  ).length;

  return (
    <div style={page}>

      {/* HEADER */}
      <div style={headerBox}>

        <h1 style={heading}>
          ⚙ Admin Dashboard
        </h1>

        <p style={subHeading}>
          Monitor campaigns, fraud detection,
          analytics and platform growth
        </p>

      </div>

     {/* ANALYTICS */}
{stats && (

  <div style={analyticsContainer}>

    {/* PIE CHART */}
    <div style={chartCard}>

      <h2 style={chartTitle}>
        🚨 Fraud Analytics
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <PieChart>

          <Pie
            data={[
              {
                name: "Fraud",
                value: fraudCount
              },

              {
                name: "Clean",
                value: cleanCount
              }
            ]}

            dataKey="value"

            outerRadius={100}

            label
          >

            <Cell fill="#ff6b81" />
            <Cell fill="#7bed9f" />

          </Pie>

          <Tooltip
            contentStyle={{
              background: "#1e272e",
              border: "none",
              borderRadius: "10px",
              color: "white"
            }}
          />

          <Legend
            wrapperStyle={{
              color: "white"
            }}
          />

        </PieChart>

      </ResponsiveContainer>

    </div>

    {/* BAR CHART */}
    <div style={chartCard}>

      <h2 style={chartTitle}>
        📊 Funding Analytics
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart
          data={stats.bar_data || []}
        >

          <XAxis
            dataKey="name"
            hide
          />

          <YAxis />

          <Tooltip
            contentStyle={{
              background: "#1e272e",
              border: "none",
              borderRadius: "10px",
              color: "white"
            }}
          />

          <Legend
            wrapperStyle={{
              color: "white"
            }}
          />

          <Bar
            dataKey="required"
            fill="#74b9ff"
            radius={[10, 10, 0, 0]}
          />

          <Bar
            dataKey="raised"
            fill="#55efc4"
            radius={[10, 10, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

    {/* RADAR CHART */}
    <div style={chartCard}>

      <h2 style={chartTitle}>
        🛡 Campaign Radar
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <RadarChart
          outerRadius={90}
          data={
            campaigns.map((c) => ({
              name: c.title?.slice(0, 8),
              raised: c.raised,
              amount: c.amount
            }))
          }
        >

          <PolarGrid />

          <PolarAngleAxis
            dataKey="name"
          />

          <PolarRadiusAxis />

          <Radar
            name="Raised"
            dataKey="raised"
            stroke="#6c5ce7"
            fill="#6c5ce7"
            fillOpacity={0.6}
          />

          <Radar
            name="Goal"
            dataKey="amount"
            stroke="#00cec9"
            fill="#00cec9"
            fillOpacity={0.3}
          />

          <Tooltip />

          <Legend />

        </RadarChart>

      </ResponsiveContainer>
                {/* LINE CHART */}
<div style={chartCard}>

  <h2 style={chartTitle}>
    📈 Donation Trends
  </h2>

  <ResponsiveContainer
    width="100%"
    height={300}
  >

    <LineChart
      data={
        campaigns.map((c) => ({
          name: c.title?.slice(0, 8),
          raised: c.raised
        }))
      }
    >

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Legend />

      <Line
        type="monotone"
        dataKey="raised"
        stroke="#0984e3"
        strokeWidth={3}
      />

    </LineChart>

  </ResponsiveContainer>

</div>

    </div>

  </div>

)}
      {/* TOTALS */}
      <div style={statsRow}>

        <div style={statCard}>
          <h2>
            ₹{stats?.total_required || 0}
          </h2>

          <p>Total Required</p>
        </div>

        <div style={statCard}>
          <h2>
            ₹{stats?.total_raised || 0}
          </h2>

          <p>Total Raised</p>
        </div>

        <div style={statCard}>
          <h2>{campaigns.length}</h2>

          <p>Total Campaigns</p>
        </div>

      </div>

      {/* CAMPAIGNS */}
      <div style={campaignGrid}>

        {campaigns.map((c, index) => (

          <div
            key={c._id}

            style={{
              ...campaignCard,

              border: c.fraud
                ? "2px solid #ff4d4d"
                : "2px solid #2ecc71",

              animation:
                `fadeUp 0.7s ease ${index * 0.1}s both`
            }}

            onMouseEnter={(e) => {

              e.currentTarget.style.transform =
                "translateY(-10px) scale(1.02)";

              e.currentTarget.style.boxShadow =
                "0 20px 40px rgba(0,0,0,0.25)";
            }}

            onMouseLeave={(e) => {

              e.currentTarget.style.transform =
                "translateY(0px)";

              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.15)";
            }}
          >

            <img
              src={c.images?.[0]}
              alt=""
              style={campaignImage}
            />

            <div style={cardBody}>

              <h2 style={campaignTitle}>
                {c.title}
              </h2>

              {c.fraud && (

                <div style={fraudBadge}>
                  🚨 FRAUD DETECTED
                </div>

              )}

              <p style={description}>
                {c.description}
              </p>

              <p style={amount}>
                ₹{c.amount}
              </p>

              <button
                onClick={() =>
                  deleteCampaign(c._id)
                }

                style={deleteBtn}
              >
                Delete Campaign
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Admin;

/* ================= MODERN STYLES ================= */

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

  backdropFilter: "blur(14px)",

  borderRadius: "25px",

  padding: "35px",

  color: "white",

  boxShadow:
    "0 8px 32px rgba(0,0,0,0.2)"
};

const heading = {
  fontSize: "48px",

  marginBottom: "10px",

  fontWeight: "bold"
};

const subHeading = {
  fontSize: "18px",

  opacity: "0.9"
};

const analyticsContainer = {
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(350px,1fr))",

  gap: "25px",

  marginBottom: "40px"
};

const chartCard = {
  background: "rgba(255,255,255,0.12)",

  backdropFilter: "blur(16px)",

  borderRadius: "28px",

  padding: "25px",

  minHeight: "420px",

  border: "1px solid rgba(255,255,255,0.2)",

  boxShadow:
    "0 12px 35px rgba(0,0,0,0.25)"
};

const chartTitle = {
  color: "white",

  marginBottom: "15px",

  textAlign: "center"
};

const statsRow = {
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",

  gap: "20px",

  marginBottom: "45px"
};

const statCard = {
  background: "rgba(255,255,255,0.15)",

  backdropFilter: "blur(12px)",

  borderRadius: "22px",

  padding: "30px",

  textAlign: "center",

  color: "white",

  boxShadow:
    "0 8px 25px rgba(0,0,0,0.2)"
};

const campaignGrid = {
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fill,minmax(350px,1fr))",

  gap: "30px"
};

const campaignCard = {
  background: "rgba(255,255,255,0.15)",

  backdropFilter: "blur(14px)",

  borderRadius: "25px",

  overflow: "hidden",

  transition: "0.4s",

  cursor: "pointer",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.15)"
};

const campaignImage = {
  width: "100%",

  height: "240px",

  objectFit: "cover"
};

const cardBody = {
  padding: "22px",

  color: "white"
};

const campaignTitle = {
  marginBottom: "12px",

  fontSize: "28px"
};

const description = {
  lineHeight: "1.7",

  color: "#f1f1f1",

  marginBottom: "15px"
};

const amount = {
  fontSize: "22px",

  fontWeight: "bold",

  marginBottom: "20px"
};

const fraudBadge = {
  display: "inline-block",

  background: "#ff4d4d",

  color: "white",

  padding: "6px 12px",

  borderRadius: "8px",

  fontSize: "12px",

  fontWeight: "bold",

  marginBottom: "15px"
};

const deleteBtn = {
  width: "100%",

  padding: "14px",

  border: "none",

  borderRadius: "14px",

  background:
    "linear-gradient(135deg,#ff4d4d,#c0392b)",

  color: "white",

  fontWeight: "bold",

  fontSize: "15px",

  cursor: "pointer",

  transition: "0.4s",

  boxShadow:
    "0 6px 20px rgba(255,77,77,0.35)"
};