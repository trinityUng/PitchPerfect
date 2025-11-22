import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---- SIGNUP SUBMIT FUNCTION ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Signup successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // ---- INPUT STYLE ----
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    marginTop: "4px",
    background: "#EFF3FF",
    border: "none",
    outline: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    color: "black",
    fontFamily: "Jua-Regular",
  };

  return (
    <div
        style={{
        position: "relative",
        width: "100vw",
        minHeight: "100vh",   // <-- FIXED
        overflow: "visible",  // <-- FIXED
        }}
    >

      {/* ---- SIDE DECOR IMAGES ---- */}
      <img
        src="/images/pinkWeed.png"
        width={430}
        style={{
          position: "absolute",
          left: -80,
          bottom: -20,
          zIndex: 0,
        }}
      />

      <img
        src="/images/brownWeed.png"
        width={430}
        style={{
          position: "absolute",
          right: -90,
          bottom: -60,
          zIndex: 0,
        }}
      />

      {/* --- LOGO TOP LEFT --- */}
      <img
        src="/images/logo.png"
        width={95}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 3,
        }}
      />

      {/* --- BOTTOM LOG IMAGE (FIXED z-index!!) --- */}
      <img
        src="/images/log.png"
        width={950}
        style={{
          position: "absolute",
          bottom: -55,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 0,        // <<< FIXED — no longer blocks yellow box
        }}
      />

      {/* ---- SIGN-UP CARD ---- */}
      <div style={{ 
        transform: "scale(0.9)",       // shrink the whole card
        transformOrigin: "top center", // shrink downward from the top
        width: "700px",
        margin: "60px auto 130px auto",
        background: "#FFFDEB",
        padding: "15px 20px",
        borderRadius: "24px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        position: "relative",
        zIndex: 10,
        textAlign: "center",
        }}>

        {/* Profile icon */}
        <img
          src="/images/portrait.png"
          width={75}
          height={75}
          style={{ marginBottom: "10px" }}
        />

        <h1
          style={{
            color: "black",
            fontFamily: "Jua-Regular",
            marginBottom: "20px",
            fontSize: "1.6rem",
          }}
        >
          Sign Up
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* USERNAME */}
          <div>
            <label style={{ fontFamily: "Jua-Regular", color: "black" }}>
              Username
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label style={{ fontFamily: "Jua-Regular", color: "black" }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label style={{ fontFamily: "Jua-Regular", color: "black" }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* REPEAT PASSWORD */}
          <div>
            <label style={{ fontFamily: "Jua-Regular", color: "black" }}>
              Repeat Password
            </label>
            <input
              name="repeatPassword"
              type="password"
              value={formData.repeatPassword}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#1E406E",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontFamily: "Jua-Regular",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Sign Up
          </button>
        </form>
      </div>

      {/* ---- FLOATING BOTTOM NAV ---- */}
      <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", zIndex: 5, display: "flex", gap: "60px" }}>
        <img src="/images/featherHome.png" width={90} className="button-image" onClick={() => navigate("/")} />
        <img src="/images/nestProfile.png" width={90} className="button-image" onClick={() => navigate("/profile")} />
        <img src="/images/pawHistory.png" width={90} className="button-image" onClick={() => navigate("/history")} />
        <img src="/images/binoExport.png" width={90} className="button-image" onClick={() => navigate("/")} />
      </div>
    </div>
  );
};

export default Profile;
