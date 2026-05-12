import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Bookmarks() {

const [campaigns, setCampaigns] = useState([]);
const navigate = useNavigate();

useEffect(() => {
fetch("http://127.0.0.1:5000/bookmarks/user1")
.then((res) => res.json())
.then((data) => setCampaigns(data || []));
}, []);

const toggleBookmark = async (campaign) => {

const confirmRemove = window.confirm(
"Remove from bookmarks?"
);

if (!confirmRemove) return;

await fetch("http://127.0.0.1:5000/unbookmark", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
id: campaign._id,
user: "user1"
})
});

setCampaigns(
campaigns.filter(
(c) => c._id !== campaign._id
)
);
};

return (

<div style={page}>

<div style={heroSection}>

<h1 style={heroTitle}>
Saved Campaigns
</h1>

<p style={heroText}>
Your bookmarked fundraising campaigns
</p>

</div>

{campaigns.length === 0 && (

<div style={emptyBox}>
No bookmarks yet
</div>

)}

<div style={grid}>

{campaigns.map((c, index) => {

const progress = Math.min(
(c.raised / c.amount) * 100,
100
);

return (

<div
key={c._id}
style={{
...card,
animation:
`fadeUp 0.8s ease ${index * 0.1}s both`
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

{c.fraud && (
<div style={fraudBadge}>
Fraud Alert
</div>
)}

<img
src={
c.images?.[0] ||
"https://via.placeholder.com/300"
}
alt=""
style={image}
/>

<div style={cardBody}>

<h3 style={title}>
{c.title}
</h3>

<p style={description}>
{c.description?.substring(0, 90)}...
</p>

<div style={amountBox}>

<div style={amountCard}>
<h2 style={amount}>
₹{c.raised}
</h2>

<p style={label}>
Raised
</p>
</div>

<div style={amountCard}>
<h2 style={amount}>
₹{c.amount}
</h2>

<p style={label}>
Goal
</p>
</div>

</div>

<div style={progressBg}>
<div
style={{
...progressFill,
width: `${progress}%`
}}
/>
</div>

<p style={progressText}>
{progress.toFixed(1)}% funded
</p>

<button
onClick={() =>
navigate(`/campaign/${c._id}`)
}
style={viewBtn}
>
View Campaign
</button>

<button
onClick={() => toggleBookmark(c)}
style={removeBtn}
>
Remove Bookmark
</button>

</div>

</div>

);
})}

</div>

</div>

);
}

export default Bookmarks;

/* ================= STYLES ================= */

const page = {
minHeight: "100vh",
padding: "40px 25px",
background:
"linear-gradient(135deg,#11998e 0%, #38ef7d 100%)",
fontFamily: "Arial, sans-serif"
};

const heroSection = {
textAlign: "center",
marginBottom: "50px",
background: "rgba(255,255,255,0.12)",
backdropFilter: "blur(14px)",
padding: "40px",
borderRadius: "28px",
boxShadow:
"0 8px 32px rgba(0,0,0,0.2)"
};

const heroTitle = {
fontSize: "48px",
color: "white",
marginBottom: "10px",
fontWeight: "bold"
};

const heroText = {
fontSize: "18px",
color: "#f1f1f1"
};

const emptyBox = {
background: "rgba(255,255,255,0.12)",
padding: "30px",
borderRadius: "20px",
textAlign: "center",
color: "white",
fontSize: "20px",
fontWeight: "bold"
};

const grid = {
display: "grid",
gridTemplateColumns:
"repeat(auto-fill,minmax(340px,1fr))",
gap: "30px"
};

const card = {
background: "rgba(255,255,255,0.15)",
backdropFilter: "blur(14px)",
borderRadius: "25px",
overflow: "hidden",
position: "relative",
transition: "0.4s",
cursor: "pointer",
boxShadow:
"0 10px 30px rgba(0,0,0,0.15)"
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

const title = {
fontSize: "24px",
marginBottom: "12px"
};

const description = {
lineHeight: "1.7",
color: "#f1f1f1",
marginBottom: "20px"
};

const amountBox = {
display: "flex",
gap: "15px",
marginBottom: "20px"
};

const amountCard = {
flex: "1",
background: "rgba(255,255,255,0.12)",
padding: "18px",
borderRadius: "18px",
textAlign: "center"
};

const amount = {
fontSize: "26px",
marginBottom: "5px"
};

const label = {
fontSize: "14px",
color: "#f1f1f1"
};

const progressBg = {
width: "100%",
height: "12px",
background: "rgba(255,255,255,0.2)",
borderRadius: "10px",
overflow: "hidden",
marginBottom: "10px"
};

const progressFill = {
height: "100%",
background:
"linear-gradient(135deg,#2ecc71,#27ae60)"
};

const progressText = {
marginBottom: "18px",
fontWeight: "bold"
};

const fraudBadge = {
position: "absolute",
top: "15px",
left: "15px",
background: "#ff4d4d",
color: "white",
padding: "6px 12px",
borderRadius: "8px",
fontSize: "12px",
fontWeight: "bold",
zIndex: "5"
};

const viewBtn = {
width: "100%",
padding: "14px",
border: "none",
borderRadius: "14px",
background:
"linear-gradient(135deg,#2ecc71,#27ae60)",
color: "white",
fontWeight: "bold",
fontSize: "15px",
cursor: "pointer",
marginBottom: "12px",
boxShadow:
"0 6px 20px rgba(46,204,113,0.35)"
};

const removeBtn = {
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
boxShadow:
"0 6px 20px rgba(255,77,77,0.35)"
};