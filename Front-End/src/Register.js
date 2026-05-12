import React, { useState } from "react";

function Register() {

const [form, setForm] = useState({
name: "",
email: "",
password: "",
dob: "",
phone: "",
role: "donor"
});

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value
});
};

const handleRegister = async () => {

try {

const {
name,
email,
password,
dob,
phone,
role
} = form;

// ✅ Empty validation
if (
!name ||
!email ||
!password ||
!dob ||
!phone
) {
alert("All fields are required ❗");
return;
}

// ✅ DOB validation
const year =
new Date(dob).getFullYear();

if (year > 2005) {
alert("❌ You must be born before 2005");
return;
}

// ✅ Phone validation
if (!/^[0-9]{10}$/.test(phone)) {
alert("❌ Enter valid 10-digit phone number");
return;
}

// ✅ API call
const res = await fetch(
"http://127.0.0.1:5000/register",
{
method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
name,
email,
password,
dob,
phone,
role
})
}
);

const data = await res.json();

// ✅ Success
if (res.ok) {

localStorage.setItem(
"user",
JSON.stringify({
name,
email,
dob,
phone,
role
})
);

alert("Registered Successfully ✅");

window.location.href = "/login";

} else {

alert(
data.error ||
"Registration Failed ❌"
);

}

} catch (err) {

console.log(err);

alert("Server Error ❌");

}
};

return (

<div style={container}>

<div style={card}>

<h2 style={title}>
Register 📝
</h2>

<input
name="name"
placeholder="Enter Full Name"
onChange={handleChange}
style={input}
/>

<input
name="email"
type="email"
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

<input
name="dob"
type="date"
onChange={handleChange}
style={input}
/>

<input
name="phone"
placeholder="Enter Phone Number"
onChange={handleChange}
style={input}
/>

<select
name="role"
onChange={handleChange}
style={input}
>

<option value="donor">
Donor
</option>

<option value="creator">
Creator
</option>

<option value="admin">
Admin
</option>

</select>

<button
onClick={handleRegister}
style={button}
>
Register
</button>

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
width: "100%",
maxWidth: "400px",
background: "white",
padding: "35px",
borderRadius: "20px",
boxShadow:
"0 10px 30px rgba(0,0,0,0.2)",
display: "flex",
flexDirection: "column",
gap: "15px"
};

const title = {
textAlign: "center",
marginBottom: "10px",
color: "#11998e"
};

const input = {
padding: "14px",
borderRadius: "10px",
border: "1px solid #ccc",
fontSize: "15px",
outline: "none",
color: "black",
caretColor: "black",
background: "white"
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

export default Register;