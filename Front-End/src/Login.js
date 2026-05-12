import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";

function Login() {

const [form, setForm] = useState({
email: "",
password: ""
});

const [otp, setOtp] = useState("");

const [step, setStep] = useState("login");

const navigate = useNavigate();

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value
});
};

// ================= LOGIN =================

const handleLogin = async () => {

try {

const res = await fetch(
"http://127.0.0.1:5000/login",
{
method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify(form)
}
);

const data = await res.json();

if (data.otp_required) {

alert("OTP sent successfully ✅");

setStep("otp");

} else {

alert(data.error || "Login Failed ❌");

}

} catch {

alert("Server not running ❌");

}
};

// ================= VERIFY OTP =================

const verifyOtp = async () => {

try {

const res = await fetch(
"http://127.0.0.1:5000/verify-login-otp",
{
method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
email: form.email,
otp
})
}
);

const data = await res.json();

if (data.user) {

try {

localStorage.setItem(
"user",
JSON.stringify({
name: data.user.name,
email: data.user.email,
role: data.user.role,
dob: data.user.dob || "",
phone: data.user.phone || "",
profileImage:
data.user.profileImage || ""
})
);

} catch (err) {

localStorage.clear();

localStorage.setItem(
"user",
JSON.stringify({
name: data.user.name,
email: data.user.email,
role: data.user.role
})
);

}

alert("Login successful ✅");

// ROLE BASED REDIRECT

if (data.user.role === "donor") {

navigate("/donor");

} else if (
data.user.role === "creator"
) {

navigate("/creator");

} else if (
data.user.role === "admin"
) {

navigate("/admin");

} else {

navigate("/");

}

window.location.reload();

} else {

alert("Invalid OTP ❌");

}

} catch (error) {

console.log(error);

alert("Server Error ❌");

}
};

return (

<div style={container}>

<div style={card}>

<h2 style={title}>
Login 🔐
</h2>

{step === "login" ? (

<>

<input
name="email"
placeholder="Enter Email"
onChange={handleChange}
style={input}
/>

<input
name="password"
type="password"
placeholder="Enter Password"
onChange={handleChange}
style={input}
/>

<button
onClick={handleLogin}
style={button}
>
Login
</button>

<p style={registerText}>

Don't have an account?{" "}

<Link
to="/register"
style={registerLink}
>
Register
</Link>

</p>

</>

) : (

<>

<input
placeholder="Enter OTP"
value={otp}
onChange={(e) =>
setOtp(e.target.value)
}
style={input}
/>

<button
onClick={verifyOtp}
style={button}
>
Verify OTP
</button>

</>

)}

</div>

</div>

);
}

/* ================= STYLES ================= */

const container = {
display: "flex",
justifyContent: "center",
alignItems: "center",
minHeight: "100vh",
background:
"linear-gradient(135deg,#11998e,#38ef7d)",
padding: "20px"
};

const card = {
background: "white",
padding: "35px",
width: "100%",
maxWidth: "400px",
borderRadius: "20px",
boxShadow:
"0 10px 30px rgba(0,0,0,0.2)",
display: "flex",
flexDirection: "column",
gap: "15px"
};

const title = {
textAlign: "center",
color: "#11998e",
marginBottom: "10px"
};

const input = {
padding: "14px",
borderRadius: "10px",
border: "1px solid #ccc",
width: "100%",
fontSize: "15px",
outline: "none",
background: "white",
color: "black",
caretColor: "black",
boxSizing: "border-box"
};

const button = {
padding: "14px",
background:
"linear-gradient(135deg,#11998e,#38ef7d)",
color: "white",
border: "none",
borderRadius: "10px",
fontSize: "16px",
fontWeight: "bold",
cursor: "pointer"
};

const registerText = {
marginTop: "10px",
textAlign: "center",
color: "#555"
};

const registerLink = {
color: "#11998e",
fontWeight: "bold",
textDecoration: "none"
};

export default Login;