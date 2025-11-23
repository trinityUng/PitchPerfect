import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Start from "./Start";

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
      navigate("/present");
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

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

  const BackButton = () => {
    const goBack = () => window.history.back();
  
    return (
      <div
        onClick={goBack}
        style={{
          cursor: "pointer",
          padding: "2px",
          left: "2px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "18px",
          color: "#1E406E",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <label style={{ fontFamily: "Jua-Regular", color: "#1E406E", cursor: "pointer"}}>
              Back
            </label>
      </div>
    );
  };

  return (
    <Start>
      {/* YELLOW SIGN-UP CARD ONLY */}
      <div
              style={{
                transform: "translate(-50%, -50%) scale(0.9)",       // center and shrink the whole card
                transformOrigin: "center center",
                width: "700px",
                position: "absolute",
                top: "50%",
                left: "50%",
                background: "#FFFDEB",
                padding: "15px 20px",
                borderRadius: "24px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                zIndex: 10,
                textAlign: "center",
              }}
        // style={{
        //   transform: "scale(0.9)",
        //   transformOrigin: "top center",
        //   width: "700px",
        //   margin: "60px auto 130px auto",
        //   background: "#FFFDEB",
        //   padding: "15px 20px",
        //   borderRadius: "24px",
        //   boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        //   position: "relative",
        //   zIndex: 10,
        //   textAlign: "center",
        // }}
      >
        <BackButton/>
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
              marginBottom: "10px"
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </Start>
  );
};

export default Profile;
