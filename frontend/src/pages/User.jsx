import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

const User = () => {
  const username = localStorage.getItem("username") || "User";

  return (
    <Layout>
      <div
        style={{
          transform: "translate(-50%, -50%)",
          transformOrigin: "center center",
          width: "90vw",
          maxWidth: "700px",
          minWidth: "300px",
          position: "absolute",
          top: "50%",
          left: "50%",
          background: "#FFFDEB",
          padding: "0.5vh 2.5vw",
          borderRadius: "24px",
          boxShadow: "0 0.6vh 1.8vh rgba(0,0,0,0.15)",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#1E406E",
            fontFamily: "Jua-Regular",
            marginBottom: "2vh",
            fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
          }}
        >
          {username || "User"}
        </h1>

        <label
            style={{
              fontFamily: "Jua-Regular",
              color: "#1E406E",
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
              marginTop: "1vh"
            }}
          >
            Your High Score
          </label>
          <h1 style={{
            color: "#1E406E",
            fontFamily: "Jua-Regular",
            marginTop: "0",
            marginBottom: "0.1vh",
            fontSize: "clamp(1.2rem, 20vw, 5.0rem)",
          }}>67</h1>
        
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2vh",
            alignItems: "center",
          }}
        >
          

        </div>
      </div>
    </Layout>
  );
};

export default User;
