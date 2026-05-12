import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {

  const navigate = useNavigate();

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [editMode, setEditMode] = useState(false);

  const [showPasswordBox, setShowPasswordBox] =
    useState(false);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const [twoStep, setTwoStep] = useState(
    localStorage.getItem("twoStep") === "true"
  );

  const [form, setForm] = useState({
    name: "",
    dob: "",
    phone: ""
  });

  // ================= FETCH USER =================
  useEffect(() => {

    if (!storedUser?.email) {
      navigate("/login");
      return;
    }

    setUser(storedUser);

  }, [navigate, storedUser]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= SAVE =================
  const handleSave = async () => {

    const updatedData = {
      ...user,
      ...form
    };

    await fetch(
      "http://127.0.0.1:5000/update-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: storedUser.email,
          ...form
        })
      }
    );

    setUser(updatedData);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedData)
    );

    alert("Profile updated ✅");

    setEditMode(false);

    window.dispatchEvent(new Event("storage"));
  };

  // ================= PASSWORD CHANGE =================
  const handlePasswordChange = async () => {

    if (
      !passwords.oldPassword ||
      !passwords.newPassword
    ) {
      alert("Fill all password fields");
      return;
    }

    const res = await fetch(
      "http://127.0.0.1:5000/change-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword
        })
      }
    );

    const data = await res.json();

    if (data.message) {

      alert("Password Updated ✅");

      setPasswords({
        oldPassword: "",
        newPassword: ""
      });

      setShowPasswordBox(false);

    } else {
      alert(data.error || "Password update failed");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {

    localStorage.removeItem("user");

    window.dispatchEvent(new Event("storage"));

    navigate("/");
  };

  if (!user) return <h2>Loading...</h2>;

  return (

    <div style={container}>

      <div style={profileCard}>

        {/* LEFT */}
        <div style={leftSection}>

          <div style={avatarWrapper}>

            <div style={avatarCircle}>
              {user?.name
                ?.split(" ")
                .map(word => word[0])
                .join("")
                .toUpperCase()}
            </div>

          </div>

          <h2 style={userName}>
            {user.name}
          </h2>

          <p style={roleText}>
            {user.role?.toUpperCase()}
          </p>

        </div>

        {/* RIGHT */}
        <div style={rightSection}>

          <div style={topBar}>

            <h1 style={heading}>
              My Profile
            </h1>

            {/* NAVIGATION */}
            <div style={navButtons}>

              <button
                onClick={() =>
                  window.location.href = "/"
                }
                style={topBtn}
              >
                Home
              </button>

              {user?.role === "donor" && (
                <button
                  onClick={() =>
                    window.location.href = "/donor"
                  }
                  style={topBtn}
                >
                  Donor
                </button>
              )}

              {user?.role === "creator" && (
                <button
                  onClick={() =>
                    window.location.href = "/creator"
                  }
                  style={topBtn}
                >
                  Creator
                </button>
              )}

              {user?.role === "admin" && (
                <button
                  onClick={() =>
                    window.location.href = "/admin"
                  }
                  style={topBtn}
                >
                  Admin
                </button>
              )}

              <button
                onClick={() =>
                  window.location.href = "/bookmarks"
                }
                style={topBtn}
              >
                Bookmarks
              </button>

            </div>

            {/* TWO STEP */}
          

          </div>

          {/* EDIT MODE */}
          {editMode ? (

            <div style={formBox}>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                style={input}
              />

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                style={input}
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                style={input}
              />

              <button
                onClick={handleSave}
                style={saveBtn}
              >
                Save Changes
              </button>

            </div>

          ) : (

            <div style={detailsBox}>

              <div style={detailCard}>
                <span style={label}>
                  Full Name
                </span>

                <span style={value}>
                  {user.name}
                </span>
              </div>

              <div style={detailCard}>
                <span style={label}>
                  Email Address
                </span>

                <span style={value}>
                  {user.email}
                </span>
              </div>

              <div style={detailCard}>
                <span style={label}>
                  Date of Birth
                </span>

                <span style={value}>
                  {user.dob}
                </span>
              </div>

              <div style={detailCard}>
                <span style={label}>
                  Phone Number
                </span>

                <span style={value}>
                  {user.phone}
                </span>
              </div>

              <div style={detailCard}>
                <span style={label}>
                  Role
                </span>

                <span style={value}>
                  {user.role}
                </span>
              </div>

              <button
                onClick={() => {

                  setForm({
                    name: user.name || "",
                    dob: user.dob || "",
                    phone: user.phone || ""
                  });

                  setEditMode(true);

                }}
                style={editBtn}
              >
                Edit Profile
              </button>

            </div>
          )}

          {/* PASSWORD */}
          <div style={passwordBox}>

            <div style={passwordHeader}>

              <div>

                <h3 style={passwordTitle}>
                  Update Password
                </h3>

                <p style={passwordText}>
                  Change your account password securely
                </p>

              </div>

              <button
                onClick={() =>
                  setShowPasswordBox(
                    !showPasswordBox
                  )
                }
                style={editBtn}
              >
                {showPasswordBox
                  ? "Close"
                  : "Update"}
              </button>

            </div>

            {showPasswordBox && (

              <div style={{ marginTop: "20px" }}>

                <input
                  type="password"
                  placeholder="Old Password"
                  value={passwords.oldPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      oldPassword:
                        e.target.value
                    })
                  }
                  style={input}
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      newPassword:
                        e.target.value
                    })
                  }
                  style={input}
                />

                <button
                  onClick={
                    handlePasswordChange
                  }
                  style={saveBtn}
                >
                  Save Password
                </button>

              </div>
            )}

          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            style={logoutBtn}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;

//
// 🎨 STYLES
//

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background:
    "linear-gradient(to right, #eef2f3, #dfe9f3)",
  padding: "40px"
};

const profileCard = {
  width: "1000px",
  minHeight: "600px",
  background: "white",
  borderRadius: "25px",
  overflow: "hidden",
  display: "flex",
  boxShadow:
    "0 15px 40px rgba(0,0,0,0.15)"
};

const leftSection = {
  width: "35%",
  background:
    "linear-gradient(to bottom, #2ecc71, #27ae60)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  padding: "40px"
};

const rightSection = {
  width: "65%",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const avatarWrapper = {
  padding: "10px",
  borderRadius: "50%",
  background:
    "rgba(255,255,255,0.2)"
};

const avatarCircle = {
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  background: "white",
  color: "#27ae60",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "50px",
  fontWeight: "bold"
};

const userName = {
  marginTop: "25px",
  fontSize: "32px",
  fontWeight: "bold"
};

const roleText = {
  marginTop: "10px",
  background:
    "rgba(255,255,255,0.2)",
  padding: "10px 20px",
  borderRadius: "20px",
  fontWeight: "bold",
  letterSpacing: "1px"
};

const heading = {
  marginBottom: "20px",
  fontSize: "34px",
  color: "#2c3e50"
};

const topBar = {
  marginBottom: "20px"
};

const navButtons = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px"
};

const topBtn = {
  background: "#34495e",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};

const detailsBox = {
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

const detailCard = {
  background: "#f8f9fa",
  borderRadius: "12px",
  padding: "18px",
  display: "flex",
  flexDirection: "column",
  boxShadow:
    "0 3px 8px rgba(0,0,0,0.05)"
};

const label = {
  fontSize: "13px",
  color: "gray",
  marginBottom: "5px"
};

const value = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#2c3e50"
};

const formBox = {
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

const input = {
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #dcdde1",
  fontSize: "16px",
  outline: "none"
};

const editBtn = {
  background: "#3498db",
  color: "white",
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  marginTop: "10px"
};

const saveBtn = {
  background: "#2ecc71",
  color: "white",
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold"
};

const logoutBtn = {
  background: "#111",
  color: "white",
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  marginTop: "25px"
};

const twoStepBox = {
  marginTop: "20px",
  marginBottom: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#f8f9fa",
  padding: "15px",
  borderRadius: "12px"
};

const twoStepHeading = {
  margin: 0,
  color: "#2c3e50"
};

const twoStepText = {
  margin: "5px 0 0 0",
  color: "gray"
};

const twoStepBtn = {
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "30px",
  cursor: "pointer",
  fontWeight: "bold"
};

const passwordBox = {
  marginTop: "25px",
  background: "#f8f9fa",
  padding: "20px",
  borderRadius: "15px"
};

const passwordHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const passwordTitle = {
  margin: 0,
  color: "#2c3e50"
};

const passwordText = {
  color: "gray",
  marginTop: "5px"
};