import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CampaignDetails() {

const { id } = useParams();
const navigate = useNavigate();

const [campaign, setCampaign] = useState(null);
const [donationAmount, setDonationAmount] = useState("");
const [currentImage, setCurrentImage] = useState(0);
const [bookmarked, setBookmarked] = useState(false);
const [related, setRelated] = useState([]);
const [showFullDesc, setShowFullDesc] = useState(false);

useEffect(() => {

fetch("http://127.0.0.1:5000/campaigns")
.then((res) => res.json())
.then((data) => {

const found = data.find((c) => c._id === id);

if (!found) {
alert("Campaign not found ❌");
navigate("/");
return;
}

setCampaign(found);

const relatedCampaigns = data.filter(
(c) =>
c.category === found.category &&
c._id !== found._id
);

setRelated(relatedCampaigns);

if (found?.bookmarkedBy?.includes("user1")) {
setBookmarked(true);
}

})
.catch(() => alert("Failed to load campaign ❌"));

}, [id, navigate]);

// ================= BOOKMARK =================

const toggleBookmark = async () => {

const url = bookmarked
? "unbookmark"
: "bookmark";

await fetch(`http://127.0.0.1:5000/${url}`, {
method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
id: campaign._id,
user: "user1"
})
});

setBookmarked(!bookmarked);
};

if (!campaign) {
return (
<div style={loadingPage}>
<h2 style={{ color: "white" }}>
Loading Campaign...
</h2>
</div>
);
}

const progress =
campaign.amount > 0
? Math.min(
(campaign.raised / campaign.amount) * 100,
100
)
: 0;

const nextImage = () => {
if (!campaign.images?.length) return;

setCurrentImage(
(prev) => (prev + 1) % campaign.images.length
);
};

const prevImage = () => {
if (!campaign.images?.length) return;

setCurrentImage((prev) =>
prev === 0
? campaign.images.length - 1
: prev - 1
);
};

// ================= DONATE =================

const handleDonate = async () => {

const user = JSON.parse(
localStorage.getItem("user")
);

if (!user) {
alert("Please login to donate ❌");
navigate("/login");
return;
}

if (!donationAmount || donationAmount <= 0) {
alert("Enter valid donation amount");
return;
}



try {

const res = await fetch(
"http://127.0.0.1:5000/create-order",
{
method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
amount: parseInt(donationAmount)
})
}
);

const data = await res.json();

const options = {

key: "rzp_test_SfHZo74uWOERAI",

amount: data.amount,

currency: "INR",

order_id: data.id,

name: "Crowdfunding Platform",

description: campaign.title,

image:
"https://cdn-icons-png.flaticon.com/512/3135/3135715.png",

method: {
upi: true,
card: true,
netbanking: true,
wallet: true
},

prefill: {
name: user?.name || "Test User",
email: "success@razorpay.com",
contact: "9000090000"
},

theme: {
color: "#2ecc71"
},

modal: {
ondismiss: function () {
console.log("Payment Closed");
}
},

handler: async function () {

await fetch(
"http://127.0.0.1:5000/donate",
{
method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
id: campaign._id,
amount: parseInt(donationAmount)
})
}
);

alert("Payment Successful 🎉");

setCampaign((prev) => ({
...prev,
raised:
prev.raised +
parseInt(donationAmount)
}));

setDonationAmount("");
}
};

if (typeof window.Razorpay === "undefined") {
alert("Razorpay SDK failed to load ❌");
return;
}

const rzp = new window.Razorpay(options);

rzp.open();

} catch (err) {

console.log(err);

alert("Payment Failed ❌");

}
};

const fullText =
campaign.fullDescription || "";

const limit = 500;

const isLong = fullText.length > limit;

const displayText = showFullDesc
? fullText
: fullText.slice(0, limit);

return (

<div style={page}>

{/* HERO */}

<div style={heroSection}>

<img
src={
campaign.images?.[0] ||
"https://via.placeholder.com/1200"
}
alt=""
style={heroImage}
/>

<div style={heroOverlay}>

<h1 style={heroTitle}>
{campaign.title}
</h1>



<button
style={bookmarkBtn}
onClick={toggleBookmark}
>
{bookmarked
? "★ Bookmarked"
: "☆ Bookmark"}
</button>

</div>

</div>

{/* MAIN CARD */}

<div style={glassCard}>

{/* IMAGE SLIDER */}

<div style={sliderWrapper}>

<img
src={
campaign.images?.[currentImage] ||
"https://via.placeholder.com/600"
}
alt=""
style={mainImage}
/>

<button
onClick={prevImage}
style={navLeft}
>
◀
</button>

<button
onClick={nextImage}
style={navRight}
>
▶
</button>

</div>

{/* FRAUD */}

{campaign.fraud && (
<div style={fraudBox}>
🚨 FRAUD ALERT DETECTED
</div>
)}

{/* DETAILS */}

<h2 style={titleStyle}>
{campaign.title}
</h2>

<div style={infoBox}>

<h3 style={sideHeading}>
Category:</h3>

<p style={category}>
{campaign.category}
</p>

</div>

<div style={infoBox}>

<h3 style={sideHeading}>
Description:</h3>

<p style={description}>
{campaign.description}
</p>

</div>
<div style={fullDescBox}>

<h3 style={sideHeading}>
Full Description:
</h3>

<p style={fullDescription}>
{displayText}
{!showFullDesc && isLong && "..."}
</p>

{isLong && (
<button
style={readBtn}
onClick={() =>
setShowFullDesc(!showFullDesc)
}
>
{showFullDesc
? "Show Less ▲"
: "Read More ▼"}
</button>
)}

</div>

{/* PROGRESS */}

<div style={amountRow}>

<div style={amountBox}>
<h3 style={amount}>
₹{campaign.raised}
</h3>

<p style={label}>
Raised
</p>
</div>

<div style={amountBox}>
<h3 style={amount}>
₹{campaign.amount}
</h3>

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

{/* DONATION */}

<div style={donateBox}>

<input
type="number"
placeholder="Enter donation amount"
value={donationAmount}
onChange={(e) =>
setDonationAmount(e.target.value)
}
style={donationInput}
/>

<button
onClick={handleDonate}
style={donateBtn}
>
💰 Donate Now
</button>

</div>

</div>

{/* RELATED */}

<div style={relatedSection}>

<h2 style={relatedTitle}>
Related Campaigns
</h2>

<div style={relatedGrid}>

{related.map((r) => (

<div
key={r._id}
style={relatedCard}
onClick={() =>
navigate(`/campaign/${r._id}`)
}
>

<img
src={r.images?.[0]}
alt=""
style={relatedImg}
/>

<div style={relatedBody}>

<h3 style={relatedCardTitle}>
{r.title}
</h3>

<button
style={viewBtn}
onClick={(e) => {
e.stopPropagation();
navigate(`/campaign/${r._id}`);
}}
>
👁 View Campaign
</button>

</div>

</div>

))}

</div>

</div>

</div>

);
}

export default CampaignDetails;

/* ================= STYLES ================= */

const page = {
minHeight: "100vh",
background:
"linear-gradient(135deg,#11998e 0%, #38ef7d 100%)",
paddingBottom: "60px",
fontFamily: "Arial, sans-serif"
};

const loadingPage = {
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
background:
"linear-gradient(135deg,#11998e 0%, #38ef7d 100%)"
};

const heroSection = {
position: "relative",
height: "45vh",
overflow: "hidden"
};

const heroImage = {
width: "100%",
height: "100%",
objectFit: "cover",
filter: "brightness(55%)",
transform: "scale(1.08)"
};

const heroOverlay = {
position: "absolute",
top: "50%",
left: "50%",
transform: "translate(-50%, -50%)",
textAlign: "center",
color: "white",
background: "rgba(255,255,255,0.12)",
backdropFilter: "blur(14px)",
padding: "25px",
borderRadius: "28px",
width: "90%",
maxWidth: "650px",
boxShadow:
"0 8px 32px rgba(0,0,0,0.2)"
};

const heroTitle = {
fontSize: "32px",
fontWeight: "bold",
marginBottom: "18px",
whiteSpace: "nowrap",
overflow: "hidden",
textOverflow: "ellipsis",
maxWidth: "100%"
};
const heroText = {
fontSize: "20px",
marginBottom: "25px"
};

const glassCard = {
width: "90%",
maxWidth: "1200px",
margin: "-80px auto 0 auto",
background: "rgba(255,255,255,0.15)",
backdropFilter: "blur(14px)",
borderRadius: "28px",
padding: "35px",
boxShadow:
"0 10px 35px rgba(0,0,0,0.2)"
};

const sliderWrapper = {
position: "relative",
marginBottom: "25px"
};

const mainImage = {
width: "100%",
height: "450px",
objectFit: "cover",
borderRadius: "22px"
};

const navLeft = {
position: "absolute",
top: "50%",
left: "15px",
transform: "translateY(-50%)",
background: "rgba(0,0,0,0.5)",
color: "white",
border: "none",
padding: "12px",
borderRadius: "50%",
cursor: "pointer"
};

const navRight = {
position: "absolute",
top: "50%",
right: "15px",
transform: "translateY(-50%)",
background: "rgba(0,0,0,0.5)",
color: "white",
border: "none",
padding: "12px",
borderRadius: "50%",
cursor: "pointer"
};

const fraudBox = {
background: "#ff4d4d",
padding: "14px",
borderRadius: "12px",
color: "white",
fontWeight: "bold",
marginBottom: "20px",
textAlign: "center"
};

const titleStyle = {
fontSize: "18px",
color: "white",
marginBottom: "8px",
fontWeight: "700",
lineHeight: "1.5",
textAlign: "center",
wordBreak: "break-word",
padding: "0 10px"
};

const category = {
color: "#f1f1f1",
marginBottom: "20px",
fontSize: "18px"
};

const description = {
fontSize: "18px",
lineHeight: "1.8",
color: "white",
marginBottom: "20px"
};

const fullDescription = {
fontSize: "16px",
lineHeight: "1.9",
color: "#f1f1f1"
};
const fullDescBox = {
marginTop: "20px",
padding: "22px",
borderRadius: "20px",
background: "rgba(255,255,255,0.12)",
backdropFilter: "blur(10px)",
border: "1px solid rgba(255,255,255,0.2)",
boxShadow: "0 8px 25px rgba(0,0,0,0.12)"
};
const readBtn = {
marginTop: "12px",
background:
"linear-gradient(135deg,#2ecc71,#27ae60)",
border: "none",
color: "white",
padding: "10px 18px",
borderRadius: "12px",
cursor: "pointer",
fontWeight: "bold",
fontSize: "14px",
boxShadow:
"0 6px 18px rgba(46,204,113,0.3)"
};

const amountRow = {
display: "flex",
justifyContent: "space-between",
marginTop: "30px",
marginBottom: "20px",
flexWrap: "wrap",
gap: "20px"
};
const amountBox = {
flex: "1",
minWidth: "220px",
padding: "25px",
borderRadius: "20px",
background: "rgba(255,255,255,0.15)",
backdropFilter: "blur(12px)",
border: "1px solid rgba(255,255,255,0.2)",
boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
textAlign: "center"
};

const amount = {
fontSize: "34px",
color: "white",
marginBottom: "5px"
};

const label = {
color: "#f1f1f1"
};

const progressBg = {
width: "100%",
height: "14px",
background: "rgba(255,255,255,0.3)",
borderRadius: "12px",
overflow: "hidden",
marginTop: "15px"
};

const progressFill = {
height: "100%",
background:
"linear-gradient(135deg,#2ecc71,#27ae60)"
};

const progressText = {
marginTop: "12px",
color: "white",
fontWeight: "bold"
};

const donateBox = {
marginTop: "35px",
display: "flex",
gap: "15px",
flexWrap: "wrap"
};

const donationInput = {
flex: "1",
padding: "16px",
borderRadius: "14px",
border: "none",
outline: "none",
fontSize: "16px",
minWidth: "250px",
color: "black",
background: "white",
caretColor: "black" // ✅ cursor color
};
const donateBtn = {
padding: "16px 28px",
border: "none",
borderRadius: "14px",
background:
"linear-gradient(135deg,#2ecc71,#27ae60)",
color: "white",
fontWeight: "bold",
fontSize: "16px",
cursor: "pointer",
boxShadow:
"0 6px 20px rgba(46,204,113,0.35)"
};

const bookmarkBtn = {
padding: "12px 20px",
background: "#f1c40f",
border: "none",
borderRadius: "12px",
fontWeight: "bold",
cursor: "pointer",
fontSize: "16px"
};

const relatedSection = {
marginTop: "60px"
};

const relatedTitle = {
fontSize: "34px",
color: "white",
marginBottom: "25px"
};

const relatedGrid = {
display: "grid",
gridTemplateColumns:
"repeat(auto-fill,minmax(300px,1fr))",
gap: "25px"
};

const relatedCard = {
background: "rgba(255,255,255,0.15)",
backdropFilter: "blur(12px)",
borderRadius: "22px",
overflow: "hidden",
cursor: "pointer",
transition: "0.4s",
boxShadow:
"0 10px 30px rgba(0,0,0,0.15)"
};

const relatedImg = {
width: "100%",
height: "220px",
objectFit: "cover"
};

const relatedBody = {
padding: "20px"
};

const relatedCardTitle = {
color: "white",
marginBottom: "15px"
};
const sideHeading = {
fontSize: "22px",
fontWeight: "bold",
marginBottom: "12px",
color: "black"
};

const infoBox = {
display: "flex",
alignItems: "flex-start",
gap: "5px",
marginBottom: "25px",
flexWrap: "wrap"
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
cursor: "pointer"
};
